# Nexus AI OS - Azure Migration Guide
## Hosting in Saudi Arabia / Middle East Region

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Migration](#step-by-step-migration)
5. [Azure Services Configuration](#azure-services-configuration)
6. [Security & Compliance](#security-compliance)
7. [Cost Estimation](#cost-estimation)
8. [Post-Migration Checklist](#post-migration-checklist)

---

## Executive Summary

This guide provides a comprehensive roadmap for migrating Nexus AI OS from Lovable Cloud to Microsoft Azure, specifically targeting deployment in the Saudi Arabia / Middle East region for optimal latency and data residency compliance.

### Key Benefits of Azure Hosting

| Benefit | Description |
|---------|-------------|
| **Data Residency** | Keep data within Middle East regions for compliance |
| **Enterprise Integration** | Native Azure AD, M365, and Teams integration |
| **Scalability** | Auto-scaling with Azure Functions and App Services |
| **AI Services** | Azure OpenAI Service with enterprise SLAs |
| **Security** | Advanced threat protection and compliance certifications |

---

## Architecture Overview

### Target Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AZURE MIDDLE EAST DEPLOYMENT                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐     ┌─────────────────────────────────────────────────┐    │
│  │   Users     │────▶│  Azure Front Door (Global CDN + WAF)            │    │
│  └─────────────┘     └─────────────────────────────────────────────────┘    │
│                                        │                                     │
│                                        ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    UAE NORTH REGION                                  │    │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │    │
│  │  │ Azure Static    │    │ Azure API       │    │ Azure Functions │  │    │
│  │  │ Web Apps        │────│ Management      │────│ (Serverless)    │  │    │
│  │  │ (React Frontend)│    │ (Gateway)       │    │ (Backend Logic) │  │    │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘  │    │
│  │                                                        │             │    │
│  │  ┌─────────────────┐    ┌─────────────────┐           │             │    │
│  │  │ Azure Key Vault │    │ Azure Cache     │           │             │    │
│  │  │ (Secrets)       │    │ for Redis       │◀──────────┘             │    │
│  │  └─────────────────┘    └─────────────────┘                         │    │
│  │                                                                      │    │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │    │
│  │  │ Azure Database  │    │ Azure Blob      │    │ Azure AD B2C    │  │    │
│  │  │ for PostgreSQL  │    │ Storage         │    │ (Authentication)│  │    │
│  │  │ Flexible Server │    │ (Files/Assets)  │    │                 │  │    │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    SWEDEN CENTRAL (AI Services)                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  Azure OpenAI Service (GPT-4, GPT-4 Turbo, Embeddings)      │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Mapping: Lovable Cloud → Azure

| Current (Lovable Cloud) | Target (Azure) | Region |
|------------------------|----------------|--------|
| Vite/React Frontend | Azure Static Web Apps | UAE North |
| Supabase Edge Functions | Azure Functions | UAE North |
| PostgreSQL Database | Azure Database for PostgreSQL | UAE North |
| Supabase Storage | Azure Blob Storage | UAE North |
| Supabase Auth | Azure AD B2C | Global |
| Lovable AI Gateway | Azure OpenAI Service | Sweden Central |
| — | Azure Front Door + WAF | Global |
| — | Azure Key Vault | UAE North |
| — | Azure API Management | UAE North |

---

## Prerequisites

### 1. Azure Subscription Requirements

- [ ] Active Azure subscription with Owner/Contributor access
- [ ] Azure AD tenant configured
- [ ] Billing account set up for Middle East regions
- [ ] Resource provider registrations:
  - Microsoft.Web
  - Microsoft.DBforPostgreSQL
  - Microsoft.Storage
  - Microsoft.CognitiveServices
  - Microsoft.KeyVault
  - Microsoft.Cdn

### 2. Azure OpenAI Access

- [ ] Apply for Azure OpenAI access at https://aka.ms/oai/access
- [ ] Wait for approval (typically 1-5 business days)
- [ ] Create Azure OpenAI resource in Sweden Central

### 3. Development Tools

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Install Azure Functions Core Tools
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Login to Azure
az login
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### 4. Export Current Data

```bash
# Export database from Lovable Cloud
# Navigate to Cloud > Database > Tables > Export

# Download storage assets
# Navigate to Cloud > Storage > Download files
```

---

## Step-by-Step Migration

### Phase 1: Infrastructure Setup (Day 1-2)

#### Step 1.1: Create Resource Group

```bash
# Create resource group in UAE North
az group create \
  --name rg-nexus-prod-uaenorth \
  --location uaenorth \
  --tags Environment=Production Application=NexusOS
```

#### Step 1.2: Create Azure Key Vault

```bash
# Create Key Vault for secrets management
az keyvault create \
  --name kv-nexus-prod \
  --resource-group rg-nexus-prod-uaenorth \
  --location uaenorth \
  --enable-rbac-authorization true

# Add secrets
az keyvault secret set --vault-name kv-nexus-prod --name "AZURE-OPENAI-KEY" --value "<your-key>"
az keyvault secret set --vault-name kv-nexus-prod --name "AZURE-OPENAI-ENDPOINT" --value "<your-endpoint>"
az keyvault secret set --vault-name kv-nexus-prod --name "DB-CONNECTION-STRING" --value "<connection-string>"
```

#### Step 1.3: Create PostgreSQL Flexible Server

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group rg-nexus-prod-uaenorth \
  --name psql-nexus-prod \
  --location uaenorth \
  --admin-user nexusadmin \
  --admin-password "<secure-password>" \
  --sku-name Standard_D2s_v3 \
  --tier GeneralPurpose \
  --storage-size 128 \
  --version 15 \
  --high-availability ZoneRedundant

# Create database
az postgres flexible-server db create \
  --resource-group rg-nexus-prod-uaenorth \
  --server-name psql-nexus-prod \
  --database-name nexus_db

# Configure firewall (allow Azure services)
az postgres flexible-server firewall-rule create \
  --resource-group rg-nexus-prod-uaenorth \
  --name psql-nexus-prod \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### Step 1.4: Create Storage Account

```bash
# Create storage account
az storage account create \
  --name stnexusprod \
  --resource-group rg-nexus-prod-uaenorth \
  --location uaenorth \
  --sku Standard_ZRS \
  --kind StorageV2 \
  --access-tier Hot

# Create blob containers
az storage container create --name avatars --account-name stnexusprod --public-access blob
az storage container create --name documents --account-name stnexusprod --public-access off
```

### Phase 2: Backend Migration (Day 3-5)

#### Step 2.1: Create Azure Functions App

```bash
# Create Function App
az functionapp create \
  --resource-group rg-nexus-prod-uaenorth \
  --consumption-plan-location uaenorth \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name func-nexus-prod \
  --storage-account stnexusprod

# Configure app settings
az functionapp config appsettings set \
  --name func-nexus-prod \
  --resource-group rg-nexus-prod-uaenorth \
  --settings \
    "AZURE_OPENAI_ENDPOINT=@Microsoft.KeyVault(VaultName=kv-nexus-prod;SecretName=AZURE-OPENAI-ENDPOINT)" \
    "AZURE_OPENAI_KEY=@Microsoft.KeyVault(VaultName=kv-nexus-prod;SecretName=AZURE-OPENAI-KEY)" \
    "DATABASE_URL=@Microsoft.KeyVault(VaultName=kv-nexus-prod;SecretName=DB-CONNECTION-STRING)"
```

#### Step 2.2: Convert Edge Functions to Azure Functions

**Example: ai-chat Function**

```typescript
// azure-functions/ai-chat/index.ts
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
  const apiKey = process.env.AZURE_OPENAI_KEY!;
  const deploymentName = "gpt-4"; // Your deployment name

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

  try {
    const { messages, stream } = req.body;

    if (stream) {
      // Streaming response
      const events = await client.streamChatCompletions(deploymentName, messages);
      
      context.res = {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
        body: events,
        isRaw: true,
      };
    } else {
      // Non-streaming response
      const result = await client.getChatCompletions(deploymentName, messages);
      
      context.res = {
        status: 200,
        body: {
          choices: result.choices,
          usage: result.usage,
        },
      };
    }
  } catch (error) {
    context.log.error("AI Chat error:", error);
    context.res = {
      status: 500,
      body: { error: "Failed to process AI request" },
    };
  }
};

export default httpTrigger;
```

**function.json:**

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "ai-chat"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### Phase 3: Frontend Deployment (Day 6-7)

#### Step 3.1: Create Static Web App

```bash
# Create Static Web App
az staticwebapp create \
  --name swa-nexus-prod \
  --resource-group rg-nexus-prod-uaenorth \
  --location "Central US" \
  --sku Standard \
  --source https://github.com/your-org/nexus-os \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

#### Step 3.2: Update Environment Variables

Create `.env.production`:

```env
VITE_AZURE_FUNCTIONS_URL=https://func-nexus-prod.azurewebsites.net/api
VITE_STORAGE_URL=https://stnexusprod.blob.core.windows.net
VITE_APP_INSIGHTS_KEY=<your-app-insights-key>
```

#### Step 3.3: Update API Calls

```typescript
// src/lib/azure-client.ts
const FUNCTIONS_URL = import.meta.env.VITE_AZURE_FUNCTIONS_URL;

export async function callAzureFunction(
  functionName: string,
  body: any,
  options?: { stream?: boolean }
) {
  const response = await fetch(`${FUNCTIONS_URL}/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": await getFunctionKey(),
    },
    body: JSON.stringify(body),
  });

  if (options?.stream) {
    return response;
  }

  return response.json();
}
```

### Phase 4: Database Migration (Day 8-9)

#### Step 4.1: Export from Supabase

```sql
-- Export schema
pg_dump --schema-only -h <supabase-host> -U postgres -d postgres > schema.sql

-- Export data
pg_dump --data-only -h <supabase-host> -U postgres -d postgres > data.sql
```

#### Step 4.2: Import to Azure PostgreSQL

```bash
# Connect to Azure PostgreSQL
psql "host=psql-nexus-prod.postgres.database.azure.com \
      port=5432 \
      dbname=nexus_db \
      user=nexusadmin \
      sslmode=require"

# Import schema and data
\i schema.sql
\i data.sql
```

#### Step 4.3: Configure Row Level Security

```sql
-- Enable RLS on tables
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Create policies (example)
CREATE POLICY "Users can view own decisions"
  ON public.decisions FOR SELECT
  USING (auth.uid() = user_id);
```

### Phase 5: Authentication Setup (Day 10-11)

#### Step 5.1: Create Azure AD B2C Tenant

1. Navigate to Azure Portal → Azure AD B2C
2. Create new B2C tenant
3. Configure user flows:
   - Sign up and sign in
   - Password reset
   - Profile editing

#### Step 5.2: Configure MSAL in Frontend

```typescript
// src/lib/auth-config.ts
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "<your-client-id>",
    authority: "https://<your-tenant>.b2clogin.com/<your-tenant>.onmicrosoft.com/<policy-name>",
    knownAuthorities: ["<your-tenant>.b2clogin.com"],
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
```

### Phase 6: DNS & CDN Configuration (Day 12)

#### Step 6.1: Configure Azure Front Door

```bash
# Create Front Door profile
az afd profile create \
  --profile-name fd-nexus-prod \
  --resource-group rg-nexus-prod-uaenorth \
  --sku Premium_AzureFrontDoor

# Add custom domain
az afd custom-domain create \
  --resource-group rg-nexus-prod-uaenorth \
  --profile-name fd-nexus-prod \
  --custom-domain-name nexus-os-com \
  --host-name nexus-os.com \
  --certificate-type ManagedCertificate
```

#### Step 6.2: Configure DNS

Add the following DNS records:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | fd-nexus-prod.azurefd.net |
| A | @ | Front Door IP |
| TXT | _dnsauth | Verification token |

---

## Security & Compliance

### Saudi Arabia Data Residency

| Data Type | Storage Location | Compliance |
|-----------|-----------------|------------|
| User Data | UAE North | ✅ Middle East |
| Documents | UAE North | ✅ Middle East |
| AI Processing | Sweden Central | ⚠️ EU (required for Azure OpenAI) |
| Logs | UAE North | ✅ Middle East |

### Security Checklist

- [ ] Enable Azure Defender for all resources
- [ ] Configure Network Security Groups
- [ ] Enable Azure DDoS Protection
- [ ] Set up Azure Sentinel for SIEM
- [ ] Configure backup and disaster recovery
- [ ] Enable audit logging
- [ ] Implement managed identities for service-to-service auth

---

## Cost Estimation

### Monthly Cost Breakdown (USD)

| Service | SKU | Estimated Cost |
|---------|-----|----------------|
| Azure Static Web Apps | Standard | $9/month |
| Azure Functions | Consumption | $50-200/month |
| Azure PostgreSQL | D2s_v3 | $150/month |
| Azure Blob Storage | Standard ZRS | $25/month |
| Azure Front Door | Premium | $35/month |
| Azure Key Vault | Standard | $5/month |
| Azure OpenAI | Pay-as-you-go | $100-500/month |
| Azure AD B2C | 50K MAU free | $0-50/month |
| **Total Estimated** | | **$374-974/month** |

### Cost Optimization Tips

1. Use Azure Reserved Instances for 1-3 year commitments (up to 65% savings)
2. Enable auto-scaling for Functions
3. Use lifecycle policies for Blob Storage
4. Monitor and right-size PostgreSQL

---

## Post-Migration Checklist

### Functional Testing

- [ ] User authentication flows
- [ ] AI chat functionality
- [ ] Report generation
- [ ] File upload/download
- [ ] Real-time features
- [ ] All CRUD operations

### Performance Testing

- [ ] Load testing (minimum 100 concurrent users)
- [ ] Latency testing from Saudi Arabia
- [ ] Database query performance
- [ ] CDN cache hit rates

### Security Validation

- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] RLS policy verification
- [ ] API authentication testing

### Monitoring Setup

- [ ] Azure Application Insights
- [ ] Azure Monitor alerts
- [ ] Log Analytics workspace
- [ ] Custom dashboards

---

## Support & Resources

- **Azure Documentation**: https://docs.microsoft.com/azure
- **Azure OpenAI Documentation**: https://learn.microsoft.com/azure/ai-services/openai
- **Azure Support**: https://azure.microsoft.com/support

---

*Document Version: 1.0*  
*Last Updated: December 2024*  
*Author: Nexus AI OS Team*
