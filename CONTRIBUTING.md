# Contributing & Workflow

This document outlines the core workflows, CI/CD pipelines, and rigorous testing strategies used by the ShopSmart team. We employ a trunk-based development strategy centered around the `main` branch.

---

## 1. Testing Strategy

Comprehensive testing guarantees structural integrity before any code reaches AWS.

### Frontend Testing (Vitest + Playwright)

| Type            | Command                              | Description                                  |
|-----------------|--------------------------------------|----------------------------------------------|
| **Unit**        | `cd client && npm run test:unit`     | Tests pure component rendering logic isolated from DOM mapping. |
| **Integration** | `cd client && npm run test:integration` | Validates async state transitions (e.g., adding to cart, navbar active states). |
| **E2E**         | `cd client && npx playwright test`   | Full automated browser testing covering complete user workflows (Category Pills, Navigation).|
| **Linting**     | `cd client && npm run lint`          | Statically analyzes standard React rules.    |

### Backend Testing (Jest)

| Type            | Command                              | Description                                  |
|-----------------|--------------------------------------|----------------------------------------------|
| **Unit**        | `cd server && npm run test`          | Core logic checks including API handlers and data modeling. |
| **Linting**     | `cd server && npm run lint`          | Prevents formatting and code-style regressions. |

---

## 2. CI/CD Pipeline Ecosystem

Our entire infrastructure is automated via GitHub Actions, housed within `.github/workflows`.

### Development CI (`ci.yml`)
Triggers forcefully on any push or pull request to `main`.
1. **ESLint Validation:** Scans both `server` and `client` directories independently.
2. **Backend Checks:** Installs backend dependencies on cache and runs Node.js `jest` validations.
3. **Frontend Checks:** Executes `vitest` unit/integration tests synchronously.

### Production CD (`deploy.yml`)
Triggers strictly on successful `pull` or manual `push` to `main`, provided CI passes.
*   Authenticates to our remote AWS `.pem` key pairs via repository variables.
*   Executes a native `appleboy/ssh-action` connecting strictly to our assigned `EC2_HOST`.
*   Directly runs our `scripts/deploy.sh` file.

### Maintenance CI (`dependabot.yml`)
*   Scheduled weekly sweep of all `npm` modules across both spaces. Auto-generates Pull Requests to safely patch vulnerabilities, guaranteeing code is continuously modern.

---

## 3. Pull Request Standards
*   **Meaningful Commits:** All changes are committed with granular, logical, and highly descriptive commit messages (e.g., `feat(client): implement premium hero section`). Bulk commits are explicitly prohibited.
*   **PR Approval:** Feature branch integrations must pass the `ci.yml` matrix automatically before humans approve the request.
