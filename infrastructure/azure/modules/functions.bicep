// ============================================================================
// Azure Functions Module
// Serverless compute for API endpoints
// ============================================================================

@description('Azure region')
param location string

@description('Project name')
param projectName string

@description('Environment')
param environment string

@description('Unique suffix for naming')
param uniqueSuffix string

@description('Storage account name')
param storageAccountName string

@description('Key Vault name')
param keyVaultName string

@description('Log Analytics Workspace ID')
param logAnalyticsWorkspaceId string

// Note: PostgreSQL connection string is retrieved from Key Vault via app settings

@description('Resource tags')
param tags object

// ============================================================================
// App Service Plan
// ============================================================================

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'asp-${projectName}-${environment}'
  location: location
  tags: tags
  sku: {
    name: environment == 'prod' ? 'EP1' : 'Y1'
    tier: environment == 'prod' ? 'ElasticPremium' : 'Dynamic'
  }
  kind: 'functionapp'
  properties: {
    reserved: true // Linux
  }
}

// ============================================================================
// Function App
// ============================================================================

resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: 'func-${projectName}-${uniqueSuffix}'
  location: location
  tags: tags
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      cors: {
        allowedOrigins: [
          'https://*.azurestaticapps.net'
          'https://*.azureedge.net'
          'http://localhost:5173'
          'http://localhost:3000'
        ]
        supportCredentials: true
      }
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: 'func-${projectName}-${uniqueSuffix}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'DATABASE_URL'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=postgres-connection-string)'
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=azure-openai-endpoint)'
        }
        {
          name: 'AZURE_OPENAI_KEY'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=azure-openai-key)'
        }
        {
          name: 'JWT_SECRET'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=jwt-secret)'
        }
        {
          name: 'STORAGE_CONNECTION_STRING'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=storage-connection-string)'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
      ]
    }
  }
}

// ============================================================================
// Reference existing storage account
// ============================================================================

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' existing = {
  name: storageAccountName
}

// ============================================================================
// Application Insights
// ============================================================================

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-func-${projectName}-${environment}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspaceId
  }
}

// ============================================================================
// Key Vault Access Policy
// ============================================================================

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-07-01' = {
  parent: keyVault
  name: 'add'
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: functionApp.identity.principalId
        permissions: {
          secrets: ['get', 'list']
        }
      }
    ]
  }
}

// ============================================================================
// Diagnostic Settings
// ============================================================================

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'func-diagnostics'
  scope: functionApp
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'FunctionAppLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

// ============================================================================
// Outputs
// ============================================================================

output functionAppName string = functionApp.name
output functionAppId string = functionApp.id
output functionAppHostname string = functionApp.properties.defaultHostName
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output principalId string = functionApp.identity.principalId
