# ShopSmart Architecture

This document describes the **logical architecture**, **technology stack**, **testing model**, and **deployment topology** of the ShopSmart full-stack e-commerce demo. The rubric path is **Terraform (S3 + VPC + ECR + ALB + ECS Fargate) → Docker → ECR push → ECS**; **deploy.yml** remains an optional EC2/PM2 path.

**Canonical GitHub repository:** [`nox-pie/shopsmart`](https://github.com/nox-pie/shopsmart) (`git@github.com:nox-pie/shopsmart.git`)

---

## 1. High-Level System Overview

ShopSmart is a **single-page application (React)** backed by a **small Express REST API** with an **in-memory catalog and cart**. The same codebase supports:

- **Local development** — Vite dev server (client) and Node (server), typically with Vite proxying `/api` to the backend.
- **AWS EC2** — Classic VM deploy: Nginx serves static assets, PM2 runs the API, optional reverse proxy from Nginx to the API port.
- **AWS ECS on Fargate (rubric)** — One **multi-stage Docker image** (root `Dockerfile`); **CI** pushes to **ECR**, **ALB** serves **HTTP :80** → tasks on **:5001**, **hash routes** and `/api` work same-origin.

```text
                       +--------------------------------------+
                       |            Developers / CI           |
                       |   git push, PRs, workflow_dispatch  |
                       +------------------+-------------------+
                                          |
                                          v
+--------------------------------------------------------------------------+
|        GitHub - nox-pie/shopsmart (repository + Actions)                |
|                                                                          |
|  Quality & security                                                      |
|  - ci.yml (tests, lint, format, build, audit)                           |
|  - dependency-review.yml (PR supply-chain review)                        |
|                                                                          |
|  Main/dispatch jobs                                                      |
|  - build.yml (client build artifact)                                     |
|  - infrastructure-pipeline.yml (tests -> terraform -> ECR push -> ECS Fargate) |
|  - deploy.yml (SSH to EC2, run scripts/deploy.sh)                        |
|                                                                          |
|  Maintenance / demos                                                     |
|  - dependabot.yml                                                        |
|  - recap.yml, variables_secrets.yml                                      |
+--------------------------------------------------------------------------+
          |                                       |
          | EC2 + PM2 (`deploy.yml`)              | Rubric: TF + ECR + ECS (`infrastructure-pipeline.yml`)
          v                                       v
+-----------------------------+     +--------------------------------------+
| AWS EC2 (Ubuntu)            |     | AWS account                          |
| - Nginx :80                 |     | - S3 bucket (versioning + SSE)       |
| - PM2 -> Express :5001      |     | - ECR, ECS Fargate, ALB :80           |
| - Static files under /var   |     | - S3 bucket (versioning + SSE)         |
+-----------------------------+     +--------------------------------------+
                                          |
                                          v
                       +--------------------------------------+
                       |          End users (browser)         |
                       |      HashRouter URLs + /api/...      |
                       +--------------------------------------+
```

**Important:** Pushing to `main` can run **both** `deploy.yml` and `infrastructure-pipeline.yml`—tune `on:` if you only want the rubric ECS path (see `.github/DEVOPS.md`).

---

## 2. Application Architecture (Runtime)

### 2.1 Frontend (`client/`)

| Concern | Implementation |
|---------|----------------|
| **UI** | React 18, functional components, Tailwind CSS 4, `lucide-react` icons. |
| **Routing** | `HashRouter` from React Router — routes look like `/#/collection`, avoiding Nginx rewrite rules for deep links on static hosting. |
| **Build** | Vite produces `client/dist` (tree-shaken JS, hashed assets). |
| **API access** | `client/src/api/api.js` uses `VITE_API_URL` when set (`${VITE_API_URL}/api`), otherwise same-origin `/api` (suits Docker + reverse proxy). |
| **Resilience** | If fetches fail or return empty, curated **mock** product data keeps the UI usable (useful for demos and offline dev). |

### 2.2 Backend (`server/`)

| Concern | Implementation |
|---------|----------------|
| **HTTP** | Express 4, `cors`, `express.json()`. |
| **Data** | In-memory **catalog** (`catalog.js`, `extraProducts.js`); **cart** is a single in-memory object (demo-only, not multi-user persistent). |
| **Port** | `PORT` env, default **5001** (`server/src/index.js`). |
| **Listen address** | `HOST` defaults to **0.0.0.0** so the process accepts connections inside Docker and on EC2. |
| **Static SPA (optional)** | If `SHOPSMART_STATIC_DIR` points at a folder containing `index.html` (or `../static` from `src` exists), Express serves the Vite build and falls through to `index.html` for non-API GET routes — used by the **root Dockerfile** (`/app/static`). |

### 2.3 Public HTTP API (Express)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/health` | Liveness JSON for load balancers, Docker `HEALTHCHECK`, and ops. |
| `GET` | `/api/products` | List products; optional `?search=` filter. |
| `GET` | `/api/products/:id` | Single product or 404. |
| `GET` | `/api/cart` | Current cart snapshot. |
| `POST` | `/api/cart` | Body: `productId`, optional `quantity` (signed deltas for demo). |
| `DELETE` | `/api/cart/:productId` | Remove line item. |

There is **no** `/api/categories` route in the current server; categories appear in product payloads and UI filters where implemented.

---

## 3. Deployment Topologies

### 3.1 EC2 + Nginx + PM2 (`scripts/deploy.sh` + `deploy.yml`)

1. Repo synced under `~/shopsmart` (clone or `git pull`).
2. **Server:** `npm ci`, PM2 process `shopsmart-backend` running `src/index.js`.
3. **Client:** `npm ci`, `npm run build`, `dist` copied to `/var/www/shopsmart/client/dist` (see script).
4. **Nginx** reload; example site config: `scripts/nginx/shopsmart.conf.example` (proxy `/api/` → `127.0.0.1:5001`).

### 3.2 Rubric pipeline — Terraform + ECR + ECS Fargate (`Dockerfile` + `infrastructure-pipeline.yml`)

1. **Terraform** (`terraform/`): **S3** artifacts bucket (unique name, versioning, SSE, public access blocked); **`vpc.tf`** VPC + public subnets; **ECR** repository; **ALB** + target group (health **`/api/health`**); **ECS cluster**, task definition, **Fargate service** registered behind the ALB.
2. **CI** builds from the root **`Dockerfile`** (multi-stage, non-root `shopsmart` user, **`HEALTHCHECK`**).
3. **CI** tags and **pushes** to **ECR**, runs **`aws ecs update-service --force-new-deployment`**, **`aws ecs wait services-stable`**, then **`curl`** the ALB DNS for **`/api/health`**.

Terraform **state** is cached on **`main`** under a fixed Actions cache key (see `.github/DEVOPS.md` for remote state in production).

---

## 4. Technology Stack (Authoritative Summary)

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, Vite 7, Tailwind CSS 4, `@tailwindcss/postcss`, React Router 7 (`HashRouter`), `lucide-react` |
| **Backend** | Node.js 18+ (Jest locally; CI matrix includes 18/20/22), Express 4, in-memory data |
| **Testing** | Vitest 4 (unit + integration), Jest 29 + Supertest (API), Playwright (E2E under `client/tests/e2e/`) |
| **Quality** | ESLint 8/10, Prettier 3, blocking `npm audit` (high+) on client and server in `ci.yml` |
| **Containers** | Docker (multi-stage, non-root, healthcheck) |
| **IaC / cloud** | Terraform 1.9+ (AWS ~> 5.x): S3, VPC, ECR, ALB, ECS Fargate (`enable_ecs`) |
| **CI/CD** | GitHub Actions (pinned action SHAs where configured), Dependabot (npm, actions, terraform) |
| **Legacy / alt deploy** | AWS EC2, PM2, Nginx, SSH (`deploy.yml`) |

---

## 5. Testing Architecture

```text
                    ┌─────────────────────────────────────┐
                    │   E2E — Playwright (6 spec files)   │
                    │   client/tests/e2e/*.spec.js        │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ Integration — Vitest             │
                    │ client/src/__tests__/integration/ │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ Unit — Vitest + Jest              │
                    │ client/__tests__/unit, App…       │
                    │ server/tests/*.test.js            │
                    └───────────────────────────────────┘
```

| Tier | Client | Server |
|------|--------|--------|
| **Unit** | Components (e.g. Hero, Navbar), utilities | HTTP contract via Supertest against `app` |
| **Integration** | API module, navbar, app flows | Same Jest suite exercises REST handlers |
| **E2E** | Playwright: homepage, navigation, search, category pills, responsive, API mock | — |

**CI test reports (rubric / observability):** `infrastructure-pipeline.yml` runs `npm run test:report` in both workspaces and uploads a **`test-reports`** artifact (Vitest JUnit, Jest JUnit under `test-results/`).

---

## 6. Repository Layout (Architecture-Relevant)

```text
shopsmart/
├── client/                 # Vite + React SPA
├── server/                 # Express API
├── terraform/              # AWS: S3, VPC, ECR, ALB, ECS Fargate
├── Dockerfile              # Production image: API + static dist
├── scripts/
│   ├── deploy.sh           # EC2 idempotent deploy
│   ├── nginx/              # Example Nginx site for EC2
│   └── *.sh                # EC2 helpers (instance id via env/args)
├── .github/
│   ├── workflows/          # All YAML pipelines
│   └── DEVOPS.md           # Branch protection, secrets, rubric mapping
├── ARCHITECTURE.md         # This file
├── CONTRIBUTING.md         # Contributor workflow and commands
└── README.md               # Quick start and secret names
```

---

## 7. Security & Supply Chain (Summary)

- **Dependency review** on pull requests (same-repo), high-severity gate for new dependency changes.
- **Dependabot** weekly PRs for `client/`, `server/`, GitHub Actions, and `terraform/`.
- **Pinned third-party Actions** in several workflows (commit SHA + version comment).
- **Least-privilege GitHub `permissions`** where set (`contents: read`, etc., plus `actions: write` only where artifacts require it).
- **Secrets:** repository or environment-scoped — never committed (see README and `.github/DEVOPS.md`).

---

## 8. Design Trade-offs (Why It Looks Like This)

1. **HashRouter** — Correctness on static hosts and simple Nginx without SPA fallback rules; trade-off: URLs contain `#`.
2. **In-memory cart** — Zero database setup; trade-off: no durability or multi-tenant isolation.
3. **Mock fallbacks in `api.js`** — Resilient UI for demos; trade-off: must not hide real production bugs—use env flags or monitoring if you harden beyond coursework.
4. **Dual deploy** (`deploy.yml` PM2 vs rubric Docker on EC2) — Flexibility; trade-off: two pipelines to maintain if both run on `main`.

For operator checklists (secrets, branch protection, AWS IAM), use **`.github/DEVOPS.md`** alongside this document.
