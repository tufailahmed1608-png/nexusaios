# GitHub Actions CI/CD Pipeline

This document describes the CI/CD pipeline for Nexus OS.

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        TRIGGERS                                  │
├─────────────────────────────────────────────────────────────────┤
│  PR → main/develop    Push → develop    Push → main    Release  │
│         ↓                   ↓                ↓            ↓     │
│       ci.yml           deploy-dev.yml   deploy-staging  deploy- │
│                                         .yml            prod.yml│
└─────────────────────────────────────────────────────────────────┘
```

## Workflows

### 1. CI (`ci.yml`)
**Triggers:** Pull requests and pushes to `main`/`develop`

| Job | Description |
|-----|-------------|
| `lint` | ESLint code quality checks |
| `type-check` | TypeScript compilation check |
| `security-scan` | CodeQL analysis + dependency audit |
| `build` | Production build with artifact upload |
| `validate-infrastructure` | Bicep template validation (PRs only) |

### 2. Deploy DEV (`deploy-dev.yml`)
**Triggers:** Push to `develop` branch

| Job | Description |
|-----|-------------|
| `build` | Build application |
| `deploy-infrastructure` | Deploy Azure resources (Bicep) |
| `run-migrations` | Execute database migrations |
| `deploy-frontend` | Deploy to Azure Static Web Apps |
| `deploy-functions` | Deploy Azure Functions |
| `smoke-tests` | Basic health checks |

### 3. Deploy STAGING (`deploy-staging.yml`)
**Triggers:** Push to `main` branch

| Job | Description |
|-----|-------------|
| `build` | Build application |
| `approval` | Manual approval gate |
| `backup-database` | Pre-deployment backup |
| `deploy-infrastructure` | Deploy Azure resources |
| `run-migrations` | Execute database migrations |
| `deploy-frontend` | Deploy to Static Web Apps |
| `deploy-functions` | Deploy Azure Functions |
| `e2e-tests` | Playwright E2E tests |

### 4. Deploy PRODUCTION (`deploy-prod.yml`)
**Triggers:** GitHub Releases (`v*.*.*`)

| Job | Description |
|-----|-------------|
| `validate` | Version tag validation |
| `build` | Production build |
| `approval` | Production approval gate |
| `backup-database` | Full database backup |
| `deploy-infrastructure` | Deploy infrastructure |
| `run-migrations` | Run migrations in transaction |
| `deploy-*-slot` | Deploy to staging slots |
| `health-check-staging` | Validate staging deployment |
| `swap-slots` | Blue-green swap to production |
| `post-deploy-validation` | Final health checks |
| `rollback-on-failure` | Automatic rollback if failed |

### 5. Infrastructure (`infrastructure.yml`)
**Triggers:** Changes to `infrastructure/` or manual

Features:
- Bicep template validation
- What-if analysis for all environments
- Manual deployment with approval

### 6. Database Migration (`database-migration.yml`)
**Triggers:** Manual only

Features:
- Selective migration execution
- Dry-run mode
- Automatic backups
- Production approval gate

### 7. Emergency Rollback (`rollback.yml`)
**Triggers:** Manual only

Features:
- Rollback frontend, functions, or database
- Database restore from backup
- Post-rollback health checks
- Slack notifications

## Required Secrets

### Azure Authentication
| Secret | Description |
|--------|-------------|
| `AZURE_CREDENTIALS` | Service Principal JSON |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `AZURE_TENANT_ID` | Azure AD tenant ID |
| `AZURE_CLIENT_ID` | Service Principal client ID |

### Static Web Apps
| Secret | Description |
|--------|-------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` | DEV deployment token |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING` | STAGING deployment token |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` | PROD deployment token |

### Database (per environment)
| Secret | Description |
|--------|-------------|
| `DB_HOST_*` | Database hostname |
| `DB_USER_*` | Database username |
| `DB_PASSWORD_*` | Database password |

### Application (per environment)
| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL_*` | Supabase/API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY_*` | Public API key |
| `APP_URL_*` | Application URL |
| `API_URL_*` | API endpoint URL |
| `FUNCTION_APP_NAME_*` | Azure Function App name |

### Notifications
| Secret | Description |
|--------|-------------|
| `SLACK_WEBHOOK_URL` | Slack incoming webhook (optional) |

## GitHub Environments

Configure these environments in repository settings:

### `dev`
- No protection rules
- Auto-deploys on push to `develop`

### `staging`
- Required reviewers: 1
- Deploys from `main` branch

### `production`
- Required reviewers: 2
- Wait timer: 5 minutes (optional)
- Deployment branches: release tags only

### `production-database`
- Required reviewers: 2 (DBA team)
- For database migration approvals

### `production-emergency`
- Required reviewers: 1 (on-call)
- For emergency rollback approvals

## Branch Strategy

```
feature/* ──► develop ──► main ──► release tags
                │          │            │
                ▼          ▼            ▼
              DEV      STAGING     PRODUCTION
```

## Creating a Release

1. Ensure all changes are merged to `main`
2. Create a new release in GitHub
3. Tag format: `v1.0.0` (semantic versioning)
4. Production deployment will trigger automatically
5. Approve the deployment when prompted

## Rollback Procedure

### Automatic (on failure)
Production deployments automatically rollback if post-deploy health checks fail.

### Manual
1. Go to Actions → Emergency Rollback
2. Select environment and rollback type
3. For database rollback, provide backup name
4. Type "ROLLBACK" to confirm
5. Approve the rollback request
6. Monitor health checks

## Monitoring

- Slack notifications for all deployment events
- GitHub Actions logs for detailed output
- Azure Portal for infrastructure status
