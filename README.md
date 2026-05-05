# ShopSmart 🛍️

[![CI Pipeline](https://github.com/nox-pie/shopsmart/actions/workflows/ci.yml/badge.svg)](https://github.com/nox-pie/shopsmart/actions/workflows/ci.yml)
[![Infrastructure pipeline](https://github.com/nox-pie/shopsmart/actions/workflows/infrastructure-pipeline.yml/badge.svg)](https://github.com/nox-pie/shopsmart/actions/workflows/infrastructure-pipeline.yml)
[![EC2 Deployment](https://github.com/nox-pie/shopsmart/actions/workflows/deploy.yml/badge.svg)](https://github.com/nox-pie/shopsmart/actions/workflows/deploy.yml)
[![Production Build](https://github.com/nox-pie/shopsmart/actions/workflows/build.yml/badge.svg)](https://github.com/nox-pie/shopsmart/actions/workflows/build.yml)

A highly scalable, beautifully designed full-stack e-commerce web application built with React, Express, and deployed on AWS EC2.

---

## Prerequisites

- **Node.js** >= 18 (LTS recommended)
- **npm** >= 9
- **Git**

---

## Quick Start (Running Locally)

### 1. Setup Backend

```bash
# Terminal 1 — Boot the Express Server
cd server
npm install
npm run dev    # Starts backend on localhost:5001 (see server/src/index.js)
```

### 2. Setup Frontend

```bash
# Terminal 2 — Boot the Vite React App
cd client
npm install
npm run dev    # Starts frontend on Localhost:5173
```

| Service          | URL                    |
|------------------|------------------------|
| Frontend (Vite)  | http://localhost:5173   |
| Backend API      | http://localhost:5001   |

---

## Project Structure

```text
shopsmart/
├── .github/
│   ├── DEVOPS.md                  # Branch protection, environments, nginx/env operator notes
│   ├── workflows/
│   │   ├── build.yml                   # Main-branch production build + artifact upload
│   │   ├── ci.yml                      # Main CI pipeline (tests, lint, format, blocking audit)
│   │   ├── dependency-review.yml      # PR dependency/supply-chain review
│   │   ├── deploy.yml                  # EC2 SSH deploy (GitHub Environment: production)
│   │   ├── infrastructure-pipeline.yml # Rubric: tests+reports → Terraform → Docker/ECR → ECS
│   │   ├── recap.yml                   # Manual demo workflow (inputs)
│   │   └── variables_secrets.yml       # Variables, secrets, and artifact demo
│   └── dependabot.yml             # Weekly security & dependency updates
├── client/                        # React 18 Frontend Workspace
│   ├── src/
│   │   ├── api/                   # Fetch wrappers with Mock Fallbacks
│   │   ├── components/            # Reusable UI (Hero, Navbar)
│   │   ├── pages/                 # SPA Routing Pages (Collection, Cart, FAQ, Blog)
│   │   ├── __tests__/             # Unit and Integration Test Suites
│   │   │   ├── unit/              # Isolated component rendering tests
│   │   │   └── integration/       # Async state flow & API interaction tests
│   │   ├── App.jsx                # Main HashRouter application component
│   │   ├── App.test.jsx           # Root-level application test
│   │   ├── index.css              # Custom Tailwind directives and animations
│   │   ├── main.jsx               # React DOM rendering entry point
│   │   └── setupTests.js          # Vitest DOM environment configuration
│   ├── tests/e2e/                 # Playwright Web browser specs
│   │   ├── api-mock.spec.js       # Verifies backend offline/mocking states
│   │   ├── category-pills.spec.js # Verifies interactive DOM filters
│   │   ├── homepage.spec.js       # Core visual workflow tests
│   │   ├── navigation.spec.js     # HashRouter URL validation tests
│   │   ├── responsive.spec.js     # Mobile breakpoint simulations
│   │   └── search.spec.js         # Input validation and rendering tests
│   ├── eslint.config.js           # Frontend Linting rules
│   ├── package.json               # Client dependencies
│   ├── playwright.config.js       # Playwright E2E configuration
│   ├── postcss.config.js          # CSS post-processing rules
│   ├── tailwind.config.js         # Core "Premium Minimalist" design tokens
│   └── vite.config.js             # Vite bundler parameters
├── server/                        # Express Backend Workspace
│   ├── src/
│   │   └── index.js               # Primary Express backend logic & REST API
│   ├── tests/                     # Backend Jest test environment
│   ├── eslint.config.mjs          # Backend Linting configuration
│   └── package.json               # Server Node dependencies
├── terraform/                     # AWS: S3 (rubric) + ECR + ECS Fargate (rubric Phase 2–3)
├── Dockerfile                     # Multi-stage production image (API + static SPA)
├── scripts/
│   ├── deploy.sh                  # Idempotent automated AWS deployment script
│   ├── ec2_health_check.sh        # EC2 status (requires EC2_INSTANCE_ID or arg)
│   ├── launch_ec2.sh              # EC2 initialization script
│   ├── nginx/
│   │   └── shopsmart.conf.example # Example Nginx site (paths match deploy.sh)
│   └── safe_ec2_control.sh        # start/stop EC2 (requires EC2_INSTANCE_ID or arg)
├── ARCHITECTURE.md                # In-depth application architectural footprint
├── CONTRIBUTING.md                # CI/CD and Version Control team guidelines
└── README.md                      # Foundational project documentation
```

---

## Technical Design Decisions

1. **Premium Minimalist UI (Tailwind CSS)**
   Rather than relying on bloated CSS libraries like Bootstrap, a custom "Premium Minimalist" aesthetic was deployed leveraging Tailwind CSS. This enabled glassmorphism, dynamic monochrome palettes, skeleton loaders, and rich micro-animations uniquely defining the brand identity.

2. **Zero-Dependency Idempotent Scripts**
   The primary `scripts/deploy.sh` avoids manual EC2 server setup. It includes a cold-boot detection sequence checking for `node`, `pm2`, and `nginx`, installing them automatically via `apt-get` if they are absent. Running the script 100 times produces the same result as running it once.

3. **Frontend API Mocking Fallbacks**
   To increase development velocity and prevent the application from white-screening when the backend is offline, `api.js` has native catch sequences returning rich local fallback data. This guarantees the UI renders flawlessly regardless of backend availability.

4. **HashRouter over BrowserRouter**
   Choosing `HashRouter` solved a critical SPA deployment bug where Nginx returns `404 Not Found` when users refresh pages like `/collection`. The hash-based URLs (`/#/collection`) ensure all traffic always resolves to `index.html`, eliminating the need for complex server-side URL rewriting.

5. **In-Memory Data Store**
   Products and cart data are stored in in-memory arrays rather than an external database, enabling zero-configuration setup and instant portability. This can be seamlessly upgraded to MongoDB or PostgreSQL when needed.

---

## GitHub Secrets Required (CI/CD)

### Rubric pipeline (`infrastructure-pipeline.yml`)

Configure these **repository** secrets (matches typical evaluation criteria):

| Secret Name             | Description |
|-------------------------|-------------|
| `AWS_ACCESS_KEY_ID`     | IAM access for Terraform, ECR, ECS, ELB |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `AWS_SESSION_TOKEN`     | Leave blank for long-lived keys; set for temporary credentials |
| `AWS_REGION`            | Must match `terraform/variables.tf` defaults or set `TF_VAR_availability_zones` for other regions |

**Repository variable or secret (optional):** `SKIP_AWS_CREATES` — set to **`true`** (Variable **or** Secret) for AWS Academy / Vocareum accounts where **`voc-cancel-cred`** **denies creating** infrastructure. Terraform runs **`validate` / `plan` / `apply`** with **no AWS creates**; Phase 3 jobs are **skipped** via a workflow gate (GitHub does not allow `secrets` in `if:` expressions, so the workflow reads both Variable and Secret in a step). Full rubric provisioning still requires an account that allows those APIs (or instructor-provided resources).

**Workflow:** Phase 1 — client/server tests + JUnit reports → Phase 2 — Terraform (`fmt`, `init`, `validate`, `plan`, `apply`): **S3** (unique name, versioning, SSE, public access block), **VPC**, **ECR**, **ALB**, **ECS Fargate** → Phase 3 — **Docker build**, **push to ECR**, **ECS rolling deploy**, **`aws ecs wait services-stable`**, **HTTP health check** on the ALB (`/api/health`).

Optional **`deploy.yml`** (PM2/Nginx on EC2) uses **`EC2_HOST`**, **`EC2_USER`**, **`EC2_SSH_KEY`** — separate from the rubric ECS path.

**Matching the sai reference repo:** Same layout ideas (`terraform/main.tf` map, optional fixed **`s3_bucket_name`** in `terraform.tfvars`, optional **`ecs_use_iam_role_lookup`** like sai’s `data.aws_iam_role.lab_role`). CI keeps **local Terraform state** + cache so `terraform plan` does not depend on a partial S3 backend block. Terraform **cannot bypass IAM explicit denies**.

For Nginx layout and `VITE_API_URL` / `PORT` notes, use `scripts/nginx/shopsmart.conf.example` and [`.github/DEVOPS.md`](.github/DEVOPS.md).

---

## Challenges and Solutions

| #  | Challenge | Root Cause | Solution |
|----|-----------|------------|----------|
| 1  | Nginx returns 404 on React SPA page refresh | Nginx looks for a physical `/collection` directory on disk which doesn't exist | Adopted `HashRouter` (`/#/collection`) so all URLs resolve to `index.html` without server-side rewrite rules |
| 2  | Fresh EC2 server fails with `npm: command not found` | Brand new Ubuntu EC2 instances ship without Node.js, npm, or any runtime | Made `deploy.sh` idempotent: it auto-detects missing `node`, `pm2`, `nginx` and installs them via `apt-get` before proceeding |
| 3  | Playwright E2E tests hanging indefinitely | `page.goto()` with default `waitUntil: 'load'` blocks forever when Vite's HMR WebSocket never fully resolves | Changed to `waitUntil: 'domcontentloaded'` and refined `page.route()` interception to avoid blocking Vite internal requests |
| 4  | E2E navigation tests clicking wrong links | Multiple generic `<a>` elements matching the same pattern (e.g., multiple "Profile" links in navbar and footer) | Used highly specific Playwright locators targeting exact `href` attributes like `a[href='#/profile']` |
| 5  | GitHub Actions deploy failing with `ssh: unable to authenticate` | The `.pem` key was incomplete — macOS Keychain Access refused to open it, causing manual copy to clip the header | Used terminal `pbcopy < key.pem` to copy the full key including `-----BEGIN RSA PRIVATE KEY-----` header |
| 6  | GitHub submodule arrow icon persisting after folder deletion | The `nandu_shopsmart` reference folder was registered as a Git submodule, so `rm -rf` alone didn't remove its cached entry | Ran `git rm --cached nandu_shopsmart` and cleaned `.git/modules/` to fully purge the submodule reference |
| 7  | Unit tests failing after UI redesign | Test assertions (`getByText('Shop Now')`) no longer matched the updated Premium Minimalist UI text (`'Explore Collection'`) | Rewrote all unit and integration test assertions to exactly match the redesigned component text and structure |
| 8  | E2E category filter tests failing on `/#/collection` | `page.goto('/collection')` navigates to a raw path, but `HashRouter` requires `/#/collection` | Prefixed all E2E navigation URLs with `#` to align with the `HashRouter` URL scheme |
| 9  | PostCSS config error crashing Vite dev server | Missing or misconfigured `postcss.config.js` after Tailwind CSS integration | Created a proper `postcss.config.js` with `tailwindcss` and `autoprefixer` plugins |
| 10 | `source-map` dependency vulnerability in backend | Outdated transitive dependency flagged by `npm audit` | Regenerated `package-lock.json` with `npm audit fix` to pull patched versions |
| 11 | Mixed UI styling inconsistencies across pages | Ad-hoc inline styles conflicting with Tailwind utility classes | Consolidated all custom properties into `theme.extend` within `tailwind.config.js` for a single source of truth |
| 12 | Backend Jest cache permission errors on macOS | Jest's default cache directory lacked write permissions on restrictive macOS environments | Cleared the Jest cache with `npx jest --clearCache` and ensured proper directory permissions |

test
