# Contributing & Workflow

This document is the **contributor handbook** for ShopSmart: how to set up locally, run tests and linters, interpret CI/CD workflows, and open pull requests. Operational topics (GitHub Environments, branch protection, AWS secrets, rubric mapping) live in **[`.github/DEVOPS.md`](.github/DEVOPS.md)**.

**Canonical GitHub repository:** [`nox-pie/shopsmart`](https://github.com/nox-pie/shopsmart) — clone URL: `git@github.com:nox-pie/shopsmart.git`

We use a **trunk-based** flow: short-lived branches merge into **`main`** via pull request when possible.

---

## 1. Getting Started

### 1.1 Clone and install

1. **Fork** (if contributing from outside the main org) or **clone** the repository.
2. Install dependencies in **both** workspaces. For parity with CI, prefer **`npm ci`** when `package-lock.json` is present and up to date:

```bash
cd server && npm ci
cd ../client && npm ci
```

Use `npm install` only when you intentionally change dependencies and need lockfile updates.

3. **Create a branch:** `git checkout -b feat/short-description`
4. Make changes, run **tests and lint/format** locally (see §3–§6).
5. **Push** and open a **Pull Request** into `main`.

### 1.2 Run the app locally

| Terminal | Command | URL / notes |
|----------|---------|-------------|
| Backend | `cd server && npm run dev` | API: `http://localhost:5001` (default `PORT`) |
| Frontend | `cd client && npm run dev` | UI: `http://localhost:5173`; Vite proxies `/api` → `5001` |

### 1.3 Environment variables (reference)

| Variable | Where | Purpose |
|----------|--------|---------|
| `PORT` | Server | HTTP listen port (default `5001`). |
| `HOST` | Server | Bind address (default `0.0.0.0`; required for Docker/ECS). |
| `SHOPSMART_STATIC_DIR` | Server | Absolute path to Vite `dist` folder so Express serves the SPA (set in container image). |
| `VITE_API_URL` | Client build | Optional origin for API, e.g. `https://your-domain.com`. If unset, client uses relative `/api`. |
| `EC2_INSTANCE_ID` | Shell | For `scripts/ec2_health_check.sh` and `scripts/safe_ec2_control.sh` (no instance IDs in repo). |

---

## 2. Commit Message Convention

Use a concise, typed prefix:

```text
<type>(<scope>): <short description>
```

| Type | When to use |
|------|-------------|
| `feat` | New user-visible behavior or API |
| `fix` | Bug fix |
| `test` | Tests only |
| `ci` | GitHub Actions, hooks, pipeline YAML |
| `docs` | Documentation (README, ARCHITECTURE, CONTRIBUTING, DEVOPS) |
| `refactor` | Internal change, same external behavior |
| `chore` | Tooling, deps, formatting sweeps |
| `ops` | Terraform, Docker, deploy scripts, Nginx examples |

**Examples:** `feat(client): collection search debounce`, `ci: pin setup-node digest`, `ops(terraform): tighten ECS SG description`.

---

## 3. Testing Strategy

### 3.1 Commands (daily use)

| Goal | Command |
|------|---------|
| Server unit/API tests | `cd server && npm test` |
| Client unit + integration | `cd client && npm test` |
| Client unit only | `cd client && npm run test:unit` |
| Client integration only | `cd client && npm run test:integration` |
| **JUnit reports** (matches rubric pipeline) | `cd client && npm run test:report` and `cd server && npm run test:report` |
| E2E (install browsers once) | `cd client && npx playwright install && npm run test:e2e` |
| Full local suite (no E2E) | `cd server && npm test && cd ../client && npm test` |

JUnit outputs: `client/test-results/vitest-junit.xml`, `server/test-results/jest-junit.xml` (Jest config: `server/jest.config.cjs`).

### 3.2 Where tests live

| Area | Path |
|------|------|
| Client unit | `client/src/__tests__/unit/` |
| Client integration | `client/src/__tests__/integration/` |
| Server | `server/tests/` |
| Playwright | `client/tests/e2e/*.spec.js` |

### 3.3 CI expectations

- **`ci.yml`** runs **client** on Node **20 and 22** and **server** on **18, 20, and 22**: `npm ci`, tests, **Prettier** (`format:check`), **ESLint**, client **production build**, and **blocking** `npm audit --audit-level=high` on both workspaces.
- **`infrastructure-pipeline.yml`** on every push/PR runs **Phase 1 — Tests & reports** (same reports as above + artifact **`test-reports`**). Terraform and Docker/ECS run **only** on **`main`** push or **`workflow_dispatch`** (needs AWS secrets).

---

## 4. Code Style & Linting

| Tool | Location | Command |
|------|----------|---------|
| ESLint | `client/eslint.config.js`, `server/eslint.config.mjs` | `npm run lint` in each workspace |
| Prettier | Patterns in `package.json` per workspace | `npm run format` / `npm run format:check` |

Prettier is **not** only run through ESLint; CI enforces **`format:check`** explicitly.

---

## 5. CI/CD Workflow Reference

All workflows live under **`.github/workflows/`**. Third-party actions are often pinned to **full commit SHAs** (see comments in YAML).

| Workflow | Triggers | Role |
|----------|----------|------|
| **`ci.yml`** | Push & PR on all branches; `workflow_dispatch` | Primary quality gate: matrix tests, format, lint, client build, blocking audit. |
| **`build.yml`** | Push to `main`, `workflow_dispatch` | Production Vite build + **upload-artifact** `client-dist` (server test job). |
| **`infrastructure-pipeline.yml`** | Push & PR all branches; `workflow_dispatch` | **Phase 1** always: tests + JUnit artifact. **Phases 2–3** on `main` only: Terraform (S3, ECR, ECS) → Docker → ECR push → ECS stable wait. Needs **`AWS_*`** secrets and **`ECS_TASK_EXECUTION_ROLE_ARN`**. |
| **`deploy.yml`** | Push to `main` | SSH to EC2 using **`EC2_*`** secrets; GitHub Environment **`production`**. Runs `scripts/deploy.sh`. |
| **`dependency-review.yml`** | Pull requests (same-repo head) | Flags new vulnerable dependencies (high+). |
| **`variables_secrets.yml`** | `workflow_dispatch` | Demo: variables, `VITE_API_URL` build, artifact round-trip. |
| **`recap.yml`** | `workflow_dispatch` | Demo: inputs + checkout listing. |

**Dependabot** (`.github/dependabot.yml`): weekly PRs for npm (`/client`, `/server`), GitHub Actions (`/`), Terraform (`/terraform`).

---

## 6. Infrastructure & Containers (Contributors)

You do **not** need AWS credentials for everyday UI/API work. Touch this when changing deploy behavior:

| Artifact | Purpose |
|----------|---------|
| **`Dockerfile`** (repo root) | Multi-stage production image: builds client, copies `dist` into image, runs Express as non-root with `HEALTHCHECK`. |
| **`terraform/`** | AWS resources for the rubric pipeline (S3, ECR, ECS Fargate, IAM execution role, logs, security group). Run `terraform fmt` before committing TF changes. |
| **`scripts/deploy.sh`** | EC2 bootstrap: Node, PM2, Nginx, git pull, `npm ci`, build, copy static, reload Nginx. |

Local Docker build (requires Docker daemon):

```bash
docker build -t shopsmart:local .
# run example (map host 5001)
docker run --rm -p 5001:5001 shopsmart:local
```

---

## 7. Pull Request Standards

1. **Small, focused PRs** with a clear description and linked issue or rubric item if applicable.
2. **Green CI:** `ci.yml` must pass for merge when branch protection is enabled. Optionally require **`Phase 1 — Tests & reports`** from `infrastructure-pipeline.yml` on PRs.
3. **Reviews:** At least one approval when working as a team; solo coursework may skip but still self-review diff.
4. **Linear history:** Squash-merge to `main` is preferred when the team agrees.

Configure **branch protection** and **required checks** in GitHub **Settings → Branches**; exact job names appear in the **Actions** tab after the first run.

---

## 8. Security & Secrets (Contributor Rules)

- **Never** commit AWS keys, `.pem` files, or personal tokens.
- Use **GitHub Secrets** (and optionally **Environment** secrets for `production`) as documented in **README** and **`.github/DEVOPS.md`**.
- If you add a workflow that prints environment data, **do not** echo secret values.

---

## 9. Where to Read Next

| Document | Contents |
|----------|----------|
| [`README.md`](README.md) | Quick start, URLs, repo tree, secret **names** |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System diagram, API table, deploy topologies, stack |
| [`.github/DEVOPS.md`](.github/DEVOPS.md) | Rubric mapping, branch protection, EC2 vs ECS, Terraform state note |

Questions about **grading or AWS account setup** should follow your course rubric first; this repo’s **DEVOPS** section maps rubric items to files and workflows.
