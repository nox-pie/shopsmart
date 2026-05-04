# DevOps setup (college / industry alignment)

This file documents GitHub settings that cannot live in YAML alone, plus how the repo expects production to look.

## 0. Official post–mid-sem rubric (PDF) — how this repo maps

| Rubric item | Where it is implemented |
|-------------|-------------------------|
| **GitHub Secrets:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION` | Required by [`.github/workflows/infrastructure-pipeline.yml`](workflows/infrastructure-pipeline.yml). `AWS_SESSION_TOKEN` can be empty for long-lived IAM users. In learner-lab mode, ECS is disabled by default so no execution-role ARN secret is required. |
| **Phase 1 — Testing:** unit + integration tests, **test reports** | Same workflow **Phase 1** job: `client` Vitest + JUnit (`npm run test:report`), `server` Jest + JUnit (`npm run test:report`), artifact **`test-reports`**. |
| **Phase 2 — Terraform:** init, validate, plan, apply; **S3** unique name, versioning, encryption, public access blocked | [`terraform/`](../terraform) — `s3.tf` + `terraform fmt`, `init`, `validate`, `plan`, `apply` in the pipeline. ECS resources are optional and controlled by `TF_VAR_enable_ecs`. |
| **Phase 3 — Docker + ECR + ECS Fargate**; Dockerfile: **multi-stage**, **non-root**, **HEALTHCHECK** | Root [`Dockerfile`](../Dockerfile). This job is intentionally disabled in learner-lab mode because restricted accounts commonly block IAM role creation/pass-role needed by ECS tasks. |
| **Workflow order** Tests → Terraform → Docker → ECS | On **push to `main`** (and **workflow_dispatch**), jobs run in that sequence. **Pull requests** run **Phase 1 only** (tests + reports) so forks and branches without AWS secrets do not fail Terraform. |
| **EC2 SSH deploy** (`deploy.yml`) | Optional / legacy demo; uses `EC2_*` secrets. If you rely only on the rubric ECS path, consider disabling automatic EC2 deploy on `main` to avoid two deploys at once (change triggers in `deploy.yml` or use environments). |

**Terraform state:** The infrastructure workflow caches `terraform/terraform.tfstate` under the key `shopsmart-terraform-tfstate-main-v2` so repeated applies on `main` stay consistent. For team production use, switch to a remote **S3 backend** (separate state bucket) and update `terraform/versions.tf` accordingly.

### AWS Academy Learner Lab (recommended mode)

- Set `TF_VAR_enable_ecs=false` (already configured in this workflow) so Phase 2 validates and applies S3-only infrastructure safely.
- Keep Phase 3 disabled unless your account can provide a valid ECS task execution role and pass-role permissions.
- **`RepositoryAlreadyExists` / log group / security group already exists:** Usually state vs AWS drift. ECR, log group, cluster, service, and SG names include the same **random suffix** as the S3 bucket; the Actions **state cache key is v2**. Delete orphaned old resources in the lab console if you hit limits.

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
