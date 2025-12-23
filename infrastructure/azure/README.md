# Nexus OS - Azure Infrastructure

Infrastructure as Code (IaC) templates for deploying Nexus OS to Azure, optimized for Saudi Arabia / UAE region.

## 📋 Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- Azure subscription with appropriate permissions
- Bash (Linux/macOS) or PowerShell (Windows)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Azure Front Door (Global)                     │
│                    WAF + CDN + SSL Termination                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
        ┌───────────────────┐           ┌───────────────────┐
        │  Static Web App   │           │   Blob Storage    │
        │   (React App)     │           │  (Public Assets)  │
        │   UAE North       │           │    UAE North      │
        └───────────────────┘           └───────────────────┘
                    │
                    ▼
        ┌───────────────────┐
        │  Azure Functions  │
        │   (API Layer)     │
        │   UAE North       │
        └───────────────────┘
           │            │
           ▼            ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │  Azure OpenAI   │ │   Key Vault     │
│  Flexible Server│ │ Sweden Central  │ │   (Secrets)     │
│   UAE North     │ │  (GPT-4o)       │ │   UAE North     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 📁 File Structure

```
infrastructure/azure/
├── main.bicep                 # Main deployment template
├── modules/
│   ├── core-infrastructure.bicep  # Key Vault, Log Analytics, App Insights
│   ├── database.bicep             # PostgreSQL Flexible Server
│   ├── storage.bicep              # Blob Storage
│   ├── functions.bicep            # Azure Functions
│   ├── static-web-app.bicep       # Static Web App
│   ├── openai.bicep               # Azure OpenAI
│   └── cdn.bicep                  # Front Door + CDN
├── parameters/
│   ├── dev.bicepparam            # Development parameters
│   └── prod.bicepparam           # Production parameters
├── scripts/
│   ├── deploy.sh                 # Bash deployment script
│   └── deploy.ps1                # PowerShell deployment script
└── README.md
```

## 🚀 Deployment

### Quick Start (Development)

```bash
# Navigate to infrastructure directory
cd infrastructure/azure

# Make script executable (Linux/macOS)
chmod +x scripts/deploy.sh

# Deploy development environment
./scripts/deploy.sh -e dev
```

### PowerShell (Windows)

```powershell
cd infrastructure\azure
.\scripts\deploy.ps1 -Environment dev
```

### Manual Deployment

```bash
# Login to Azure
az login

# Set subscription (optional)
az account set --subscription "Your Subscription Name"

# Deploy
az deployment sub create \
  --name "nexus-os-deployment" \
  --location uaenorth \
  --template-file main.bicep \
  --parameters parameters/dev.bicepparam \
  --parameters postgresAdminLogin=nexusadmin \
  --parameters postgresAdminPassword=YourSecurePassword123!
```

## 📝 Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `environment` | Environment name (dev/staging/prod) | `dev` |
| `primaryLocation` | Primary Azure region | `uaenorth` |
| `openAILocation` | Azure OpenAI region | `swedencentral` |
| `projectName` | Project name for resource naming | `nexus-os` |
| `postgresAdminLogin` | PostgreSQL admin username | Required |
| `postgresAdminPassword` | PostgreSQL admin password | Required |

## 🔐 Security Features

### Production Environment
- **WAF**: Azure Front Door Premium with Microsoft_DefaultRuleSet 2.1
- **Key Vault**: Secrets management with RBAC authorization
- **TLS 1.2**: Enforced on all services
- **Private Endpoints**: Available for database (can be enabled)
- **Geo-redundant Backups**: PostgreSQL with 35-day retention

### All Environments
- Managed identities for service-to-service auth
- Key Vault references for secrets in Azure Functions
- Network ACLs with Azure Services bypass

## 💰 Cost Estimation

| Environment | Estimated Monthly Cost |
|-------------|----------------------|
| Development | $150-250 USD |
| Production | $800-1,500 USD |

*Costs vary based on usage. Enable cost alerts in Azure Portal.*

## 📊 Monitoring

All resources are connected to:
- **Log Analytics Workspace**: Centralized logging
- **Application Insights**: APM for Functions and web app
- **Diagnostic Settings**: Metrics and logs for all services

## 🔄 Post-Deployment Steps

1. **Deploy Application Code**
   ```bash
   # Static Web App
   npm run build
   az staticwebapp deploy --app-name <app-name> --environment production
   
   # Azure Functions
   func azure functionapp publish <function-app-name>
   ```

2. **Run Database Migrations**
   ```bash
   # Connect to PostgreSQL and run migrations
   psql -h <server>.postgres.database.azure.com -U <admin> -d nexus_os -f migrations.sql
   ```

3. **Configure Custom Domain**
   ```bash
   # Add custom domain to Static Web App
   az staticwebapp hostname set --name <app-name> --hostname yourdomain.com
   ```

4. **Update Key Vault Secrets**
   ```bash
   az keyvault secret set --vault-name <vault-name> --name jwt-secret --value <your-secret>
   ```

## 🆘 Troubleshooting

### Deployment Fails
```bash
# Check deployment status
az deployment sub show --name <deployment-name> --query properties.error

# View detailed logs
az monitor activity-log list --correlation-id <correlation-id>
```

### PostgreSQL Connection Issues
```bash
# Check firewall rules
az postgres flexible-server firewall-rule list --resource-group <rg> --name <server>

# Add your IP
az postgres flexible-server firewall-rule create --resource-group <rg> --name <server> \
  --rule-name AllowMyIP --start-ip-address <your-ip> --end-ip-address <your-ip>
```

## 📚 Resources

- [Azure Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Database for PostgreSQL](https://docs.microsoft.com/en-us/azure/postgresql/)
