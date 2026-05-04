# ShopSmart Architecture

This document describes the **logical architecture**, **technology stack**, **testing model**, and **deployment topology** of the ShopSmart full-stack e-commerce demo. It is kept aligned with the repository as of the post–mid-semester project state (CI/CD, Terraform, ECS, and EC2 paths).

**Canonical GitHub repository:** [`nox-pie/shopsmart`](https://github.com/nox-pie/shopsmart) (`git@github.com:nox-pie/shopsmart.git`)

---

## 1. High-Level System Overview

ShopSmart is a **single-page application (React)** backed by a **small Express REST API** with an **in-memory catalog and cart**. The same codebase supports:

- **Local development** — Vite dev server (client) and Node (server), typically with Vite proxying `/api` to the backend.
- **AWS EC2** — Classic VM deploy: Nginx serves static assets, PM2 runs the API, optional reverse proxy from Nginx to the API port.
- **AWS ECS on Fargate** — One **multi-stage Docker image** runs Express and serves the built SPA from disk (`SHOPSMART_STATIC_DIR`), behind Terraform-managed networking and ECR.

```text
                         ┌─────────────────────────────────────────┐
                         │           Developers / CI               │
                         │     git push, PRs, workflow_dispatch    │
                         └────────────────────┬────────────────────┘
                                              │
                                              v
┌─────────────────────────────────────────────────────────────────────────────┐
│              GitHub — nox-pie/shopsmart (repository + Actions)              │
│                                                                              │
│  Quality & security (all branches / PRs where configured)                  │
│  • ci.yml — matrix tests, Prettier, ESLint, Vite build, blocking npm audit │
│  • dependency-review.yml — PR dependency/supply-chain review               │
│                                                                              │
│  Main-branch & manual jobs                                                   │
│  • build.yml — client production build + upload-artifact (client/dist)     │
│  • infrastructure-pipeline.yml — rubric: tests+JUnit → Terraform → Docker   │
│    → ECR → ECS (push to main / dispatch only for Phases 2–3)               │
│  • deploy.yml — SSH to EC2, git sync, scripts/deploy.sh (env: production)   │
│                                                                              │
│  Maintenance / demos                                                       │
│  • dependabot.yml — npm + GitHub Actions + Terraform version bumps         │
│  • recap.yml, variables_secrets.yml — manual teaching / demo workflows     │
└─────────────────────────────────────────────────────────────────────────────┘
          │                                    │
          │ EC2 path                           │ ECS path (Terraform + ECR)
          v                                    v
┌──────────────────────────┐      ┌────────────────────────────────────────────┐
│   AWS EC2 (Ubuntu)       │      │  AWS (same account/region as Terraform)   │
│   Nginx :80              │      │  • S3 bucket (versioning, SSE, no public)│
│   PM2 → Express :5001    │      │  • ECR repository (app image :latest)    │
│   Static files in        │      │  • ECS Fargate service (public task IP   │
│   /var/www/.../dist      │      │    or SG :5001 per terraform/ecs.tf)      │
└──────────────────────────┘      └────────────────────────────────────────────┘
                                              │
                                              v
                         ┌─────────────────────────────────────────┐
                         │           End users (browser)           │
                         │   HashRouter URLs: /#/…  +  /api/…      │
                         └─────────────────────────────────────────┘
```

**Important:** Pushing to `main` can trigger **both** `deploy.yml` (EC2) and `infrastructure-pipeline.yml` (ECS) if both secret sets are configured. For a single production story, restrict one path (see `.github/DEVOPS.md`).

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

### 3.2 ECS Fargate (root `Dockerfile` + `terraform/` + `infrastructure-pipeline.yml`)

1. **Terraform** always provisions the rubric-required S3 resources. ECS/ECR resources are optional (`terraform/ecs.tf`) and controlled by `enable_ecs` so learner accounts without IAM role privileges can still pass Terraform checks.
2. **CI** builds the image from the root **Dockerfile** (multi-stage: build client → install server prod deps → runtime user `shopsmart`, `HEALTHCHECK` on `/api/health`).
3. Image is **pushed to ECR**; ECS service is **force-deployed** and waited on until **stable**.

Terraform **state** for the rubric pipeline is cached in GitHub Actions under a fixed key on `main` (see `.github/DEVOPS.md` for production-grade remote state options).

---

## 4. Technology Stack (Authoritative Summary)

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, Vite 7, Tailwind CSS 4, `@tailwindcss/postcss`, React Router 7 (`HashRouter`), `lucide-react` |
| **Backend** | Node.js 18+ (Jest locally; CI matrix includes 18/20/22), Express 4, in-memory data |
| **Testing** | Vitest 4 (unit + integration), Jest 29 + Supertest (API), Playwright (E2E under `client/tests/e2e/`) |
| **Quality** | ESLint 8/10, Prettier 3, blocking `npm audit` (high+) on client and server in `ci.yml` |
| **Containers** | Docker (multi-stage, non-root, healthcheck) |
| **IaC / cloud** | Terraform 1.9+ (AWS provider ~> 5.x): S3, ECR, ECS, IAM, CloudWatch, EC2 read for VPC |
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
├── terraform/              # AWS: S3 + ECR + ECS Fargate + IAM + logs
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
4. **Dual deploy (EC2 + ECS)** — Flexibility for different rubric or legacy demos; trade-off: two pipelines to maintain—prefer one for “real” production.

For operator checklists (secrets, branch protection, AWS IAM), use **`.github/DEVOPS.md`** alongside this document.
