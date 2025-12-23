using '../main.bicep'

param environment = 'staging'
param location = 'swedencentral'
param projectName = 'nexus'

// Database configuration
param administratorLogin = 'nexusadmin'
// administratorLoginPassword is passed via CI/CD secrets

// Scaling - Staging mirrors production for testing
param databaseSkuName = 'Standard_B2s'
param databaseStorageSizeGB = 64

// Feature flags
param enableOpenAI = true
param openAIModelDeployments = [
  {
    name: 'gpt-4'
    model: 'gpt-4'
    version: '0613'
    capacity: 20
  }
  {
    name: 'text-embedding-ada-002'
    model: 'text-embedding-ada-002'
    version: '2'
    capacity: 30
  }
]
