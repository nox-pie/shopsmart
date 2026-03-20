# Contributing & Workflow

This document outlines the core workflows, CI/CD pipelines, and rigorous testing strategies used by the ShopSmart team. We employ a trunk-based development strategy centered around the `main` branch.

---

## 1. Getting Started for Contributors

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally: `git clone <your-fork-url>`
3. **Install dependencies** in both workspaces:

```bash
cd server && npm install
cd ../client && npm install
```

4. **Create a feature branch:** `git checkout -b feat/your-feature-name`
5. **Make changes**, ensuring all tests pass before committing.
6. **Push** and open a Pull Request against `main`.

---

## 2. Commit Message Convention

All commits must follow a structured, descriptive format:

```text
<type>(<scope>): <short description>
```

| Type       | Usage                                                |
|------------|------------------------------------------------------|
| `feat`     | New feature (e.g., `feat(client): add cart drawer`)  |
| `fix`      | Bug fix (e.g., `fix(server): resolve CORS issue`)    |
| `test`     | Adding or updating tests                             |
| `ci`       | CI/CD pipeline changes                               |
| `docs`     | Documentation updates                                |
| `refactor` | Code restructuring without behavior change           |
| `chore`    | Maintenance tasks (dependencies, configs)            |
| `ops`      | Infrastructure and deployment changes                |

**Examples:**

- `feat(client): implement premium hero section with glassmorphism`
- `test(e2e): add Playwright navigation specs for HashRouter`
- `ops(deploy): bootstrap Node.js installation in deploy script`

---

## 3. Testing Strategy

Comprehensive testing guarantees structural integrity before any code reaches production.

### Frontend Testing (Vitest + Playwright)

| Type            | Command                                 | Description                                                      |
|-----------------|-----------------------------------------|------------------------------------------------------------------|
| **Unit**        | `cd client && npm run test:unit`        | Tests pure component rendering logic in isolation                |
| **Integration** | `cd client && npm run test:integration` | Validates async state transitions (cart, navbar, API flows)      |
| **E2E**         | `cd client && npx playwright test`      | Full automated browser testing across Chromium, WebKit, Firefox  |
| **Linting**     | `cd client && npm run lint`             | Statically analyzes React-specific ESLint rules                  |

### Backend Testing (Jest)

| Type            | Command                        | Description                                                    |
|-----------------|--------------------------------|----------------------------------------------------------------|
| **Unit**        | `cd server && npm run test`    | Core logic checks including API handlers and data modeling     |
| **Linting**     | `cd server && npm run lint`    | Prevents formatting and code-style regressions                 |

### Running All Tests at Once

```bash
# Backend
cd server && npm test

# Frontend Unit + Integration
cd client && npm test

# Frontend E2E (requires Playwright browsers installed)
cd client && npx playwright install && npx playwright test
```

---

## 4. CI/CD Pipeline Ecosystem

Our entire infrastructure is automated via GitHub Actions, housed within `.github/workflows/`.

### `ci.yml` — Development CI

Triggers on every **push** and **pull request** to `main`.

1. **ESLint Validation** — Scans both `server/` and `client/` directories independently
2. **Backend Tests** — Installs dependencies and runs Jest test suites
3. **Frontend Tests** — Executes Vitest unit and integration tests

### `build.yml` — Production Build

Triggers on every **push** to `main`.

1. **Dependency Installation** — Clean `npm ci` install
2. **Vite Production Build** — Compiles optimized `/dist` bundle
3. **Artifact Verification** — Confirms build output integrity

### `deploy.yml` — Production CD

Triggers on every **push** to `main`.

1. **SSH Authentication** — Connects to EC2 via `appleboy/ssh-action` using repository secrets
2. **Code Sync** — Runs `git clone` (first deploy) or `git pull` (subsequent deploys)
3. **Environment Bootstrap** — Idempotently installs Node.js, PM2, and Nginx if missing
4. **Build & Deploy** — Runs `npm ci`, builds frontend, copies `/dist` to webroot, restarts services

### `dependabot.yml` — Automated Maintenance

- Scheduled weekly sweep of all `npm` modules across both client and server
- Auto-generates Pull Requests to safely patch vulnerabilities

### `recap.yml` — Weekly Summary

- Generates an automated summary of recent code activity

### `variables_secrets.yml` — Environment Topology

- Defines and validates the environment variables and secrets topology

---

## 5. Pull Request Standards

- **Meaningful Commits:** All changes use granular, logical, descriptive commit messages. Bulk commits are prohibited.
- **CI Gate:** Feature branch PRs must pass the full `ci.yml` pipeline automatically before review.
- **PR Approval:** At least one team member must review and approve before merging to `main`.
- **Clean History:** Squash-merge is preferred to keep the `main` branch history clean and readable.

---

## 6. Code Style & Linting

| Tool       | Config File             | Scope    |
|------------|-------------------------|----------|
| ESLint     | `client/eslint.config.js`   | Frontend |
| ESLint     | `server/eslint.config.mjs`  | Backend  |
| Prettier   | Integrated via ESLint   | Both     |
| Tailwind   | `client/tailwind.config.js` | Styles   |
