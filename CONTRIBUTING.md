# Contributing Workflow

This document outlines the core workflows, CI/CD pipelines, and branch management strategies used by the ShopSmart team.

## 1. Version Control & Branching Workflow
We employ a trunk-based development strategy centered around the `main` branch.
*   **Meaningful Commits:** All changes are committed with granular, logical, and highly descriptive commit messages (e.g., `feat(client): implement premium hero section`, `fix(server): resolve PM2 caching permission`). Bulk commits are explicitly prohibited.
*   **Pull Requests (PRs):** New features should be developed on feature branches and merged back into `main` using Pull Requests to ensure code review.

## 2. Continuous Integration (CI)
GitHub Actions triggers our CI pipeline (`.github/workflows/ci.yml`) automatically on every push and PR to `main`.
Our CI workflow enforces:
*   **Code Quality:** strict structural enforcement using ESLint and formatting via Prettier.
*   **Test Coverage:** Runs all Jest (Backend) and Vitest (Frontend) suites automatically.
*   **E2E Integrity:** Automatically runs Playwright headless browser tests to ensure no UX regressions.

Any failing step in this pipeline explicitly blocks the Deployment phase.

## 3. Continuous Deployment (CD)
Upon a successful CI run, the Continuous Deployment pipeline (`.github/workflows/deploy.yml`) is triggered.
*   **Secure Auth:** Utilizing strictly injected GitHub Secrets (`EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`).
*   **Idempotency:** The pipeline executes `scripts/deploy.sh` on the AWS EC2 instance. This script is fully idempotent—meaning it automatically detects missing dependencies (like Node, Nginx, or PM2) and installs them dynamically if the server is performing a cold boot.

## 4. Automated Maintenance (Dependabot)
Security vulnerabilities and outdated packages are managed automatically. 
*   `.github/dependabot.yml` is configured to run weekly sweeps across both `npm` domains (client and server), generating automated PRs to securely bump package versions without manual developer overhead.
