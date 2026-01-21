# Azure DevOps Pipelines

This directory contains Azure DevOps pipeline configurations for CI/CD.

## Pipeline Overview

| Pipeline | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | PR & push to main/develop | Lint, type-check, security scan, build |
| `deploy-dev.yml` | Push to develop | Deploy to development environment |
| `deploy-staging.yml` | Push to main | Deploy to staging with approval |
| `deploy-prod.yml` | Manual only | Blue-green production deployment |

## Directory Structure

```
azure-pipelines/
├── ci.yml                    # Continuous Integration
├── deploy-dev.yml            # Development deployment
├── deploy-staging.yml        # Staging deployment  
├── deploy-prod.yml           # Production deployment
├── templates/
│   ├── build.yml             # Reusable build steps
│   ├── deploy-infrastructure.yml  # Bicep deployment
│   ├── deploy-database.yml   # Database migrations
│   └── health-check.yml      # Health check steps
└── README.md
```

## Prerequisites

### 1. Variable Groups

Create these variable groups in Azure DevOps > Pipelines > Library:

#### `nexus-dev-secrets`
| Variable | Type | Description |
|----------|------|-------------|
| DB_HOST | Plain | PostgreSQL hostname |
| DB_USER | Plain | Database username |
| DB_PASSWORD | Secret | Database password |
| VITE_SUPABASE_URL | Plain | Supabase/API URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | Plain | Supabase anon key |
| AZURE_SWA_TOKEN | Secret | Static Web App deployment token |
| SLACK_WEBHOOK_URL | Secret | (Optional) Slack notifications |

Repeat for `nexus-staging-secrets` and `nexus-prod-secrets`.

### 2. Service Connections

Create Azure Resource Manager service connections:
- `azure-subscription-dev`
- `azure-subscription-staging`
- `azure-subscription-prod`

### 3. Environments

Create environments with approvals:
- `staging` - Optional approval
- `production` - Required approval (add approvers)

## Setting Up Pipelines

### Step 1: Import Repository

1. Go to Azure DevOps > Repos > Files
2. Click "Import repository"
3. Enter your GitHub clone URL
4. Complete the import

### Step 2: Create Pipelines

1. Go to Pipelines > New Pipeline
2. Select "Azure Repos Git"
3. Select your repository
4. Choose "Existing Azure Pipelines YAML file"
5. Select the pipeline file (e.g., `/azure-pipelines/ci.yml`)
6. Save and run

Repeat for each pipeline file.

### Step 3: Configure Branch Policies

1. Go to Repos > Branches
2. Click "..." on `main` > Branch policies
3. Enable:
   - Build validation (select CI pipeline)
   - Require reviewers
   - Check for linked work items

## Pipeline Features

### CI Pipeline (`ci.yml`)
- ✅ ESLint code quality checks
- ✅ TypeScript type checking
- ✅ npm security audit
- ✅ Production build verification
- ✅ Artifact publishing

### Deployment Pipelines
- ✅ Infrastructure-as-Code (Bicep)
- ✅ Database migrations (transactional)
- ✅ Static Web App deployment
- ✅ Azure Functions deployment
- ✅ Health checks with retry logic
- ✅ Slack notifications

### Production Pipeline (`deploy-prod.yml`)
- ✅ Version tag validation
- ✅ Manual approval gates
- ✅ Database backup before deployment
- ✅ Blue-green deployment (staging slot)
- ✅ Automatic rollback on failure
- ✅ Post-deployment validation

## Environment-Specific Configuration

### Development
- Auto-deploys on push to `develop`
- No approval required
- Smoke tests only

### Staging
- Auto-deploys on push to `main`
- Optional approval
- Full E2E test suite

### Production
- Manual trigger only
- Required approval
- Blue-green deployment
- Auto-rollback on failure

## Troubleshooting

### Pipeline not triggering
- Check branch filters in trigger section
- Verify YAML syntax
- Check service connection permissions

### Build failures
- Review build logs in Azure DevOps
- Check variable group access
- Verify Node.js/pnpm versions

### Deployment failures
- Check Azure subscription permissions
- Verify Bicep template syntax
- Review deployment logs in Azure Portal

## Related Documentation

- [Azure Migration Guide](../public/docs/Azure-Migration-Guide.md)
- [Infrastructure README](../infrastructure/azure/README.md)
- [Database Migrations](../infrastructure/azure/database/README.md)
