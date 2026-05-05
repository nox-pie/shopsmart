# DevOps setup (college / industry alignment)

This file documents GitHub settings that cannot live in YAML alone, plus how the repo expects production to look.

## 0. Official post–mid-sem rubric (PDF) — how this repo maps

| Rubric item | Where it is implemented |
|-------------|-------------------------|
| **GitHub Secrets** (rubric) | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION` for [`.github/workflows/infrastructure-pipeline.yml`](workflows/infrastructure-pipeline.yml). Optional `EC2_*` for [`deploy.yml`](workflows/deploy.yml) only. |
| **Phase 1 — Testing:** unit + integration tests, **test reports** | `client` / `server` `npm run test:report`, artifact **`test-reports`**. |
| **Phase 2 — Terraform:** init, validate, plan, apply; **S3** | [`terraform/`](../terraform): unique bucket, versioning, SSE, public access block; **`vpc.tf`** VPC + public subnets; **ECR**, **ALB**, **ECS Fargate**. Plan uses **`-refresh=false`** where labs deny some S3 read APIs. |
| **Phase 3 — Docker + ECR + ECS** | Root [`Dockerfile`](../Dockerfile): **multi-stage**, **non-root**, **HEALTHCHECK**. Workflow: **build**, **push ECR**, **`ecs update-service`**, **`wait services-stable`**, **`curl` ALB `/api/health`**. |
| **Workflow order** | Push/PR → Tests → (on `main`) Terraform → Docker build/push → ECS deploy → verify. PRs: Phase 1 only. |
| **`deploy.yml`** (EC2 / PM2) | Separate optional path; does not replace Phase 3 ECR/ECS for the rubric. |

**Terraform state:** The infrastructure workflow caches `terraform/terraform.tfstate` under the key `shopsmart-terraform-tfstate-main-v2` so repeated applies on `main` stay consistent. For team production use, switch to a remote **S3 backend** (separate state bucket) and update `terraform/versions.tf` accordingly.

### Terraform ECS execution role

- Default **`enable_ecs = true`**. VPC is created in Terraform (`vpc.tf`).
- Optional **`ecs_task_execution_role_arn`**; otherwise ARN is `arn:aws:iam::<account>:role/<ecs_lab_role_name>` from STS (no `iam:GetRole`).
- Use **`LabRole`** (or your course role) with **`iam:PassRole`** / ECS permissions as required by the instructor account.

## 1. Branch protection on `main`

**Fits a college rubric:** you enable policy in GitHub; the repo already ships workflows (`ci.yml`, `build.yml`) you can require as status checks.

1. GitHub → **Settings** → **Branches** → **Add branch protection rule** (or **Rulesets**).
2. Branch name pattern: `main`.
3. Enable:
   - **Require a pull request before merging** (optional: require approvals).
   - **Require status checks to pass before merging** → add:
     - `Client — Node 20` and `Client — Node 22` (from `ci.yml`), and/or
     - `Server — Node …` jobs, and/or
     - `Client production build` / `Server install & test` from `build.yml` (runs on `main` only).
4. Optional: **Do not allow bypassing the above settings** for admins (strongest demo).

> **Note:** Required check names must match the job names shown in the Actions UI exactly.

## 2. GitHub Environment `production` (deploy)

The workflow **Deploy to EC2** (`.github/workflows/deploy.yml`) uses:

```yaml
environment: production
```

**First run:** GitHub may create the `production` environment automatically when the workflow runs.

**Optional (industry):** GitHub → **Settings** → **Environments** → **production** → enable **Required reviewers** so deploys need approval.

**Secrets:** You can keep repo-level secrets (`EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`) or move copies into the **production** environment for tighter scoping. Names stay the same as in [README](../README.md#github-secrets-required-cicd).

## 3. CI security gates

- **`npm audit --audit-level=high`** runs as a **blocking** step in `ci.yml` after dependency updates (`npm audit fix` was applied in-repo).
- **Dependency Review** runs on pull requests (`.github/workflows/dependency-review.yml`).

## 4. Pinned GitHub Actions

Workflows pin third-party actions to **full commit SHAs** (comment shows the human-readable version tag). Update pins deliberately when upgrading actions.

## 5. Nginx + env vars

- Example site config: `scripts/nginx/shopsmart.conf.example` (paths align with `scripts/deploy.sh`).
- **Vite:** set `VITE_API_URL` before production `npm run build` if the API is not same-origin.
- **Express:** `PORT` (default **5001**).

## 6. EC2 helper scripts (no baked-in instance IDs)

`ec2_health_check.sh` and `safe_ec2_control.sh` expect **`EC2_INSTANCE_ID`** or an instance id argument — no default instance id is stored in the repository.

Examples:

```bash
export EC2_INSTANCE_ID=i-0123456789abcdef0
./scripts/ec2_health_check.sh
./scripts/safe_ec2_control.sh start
./scripts/safe_ec2_control.sh stop
```

Or pass the id explicitly (see each script’s usage).
