// ============================================================================
// Azure OpenAI Module
// AI services deployment (Sweden Central for availability)
// ============================================================================

@description('Azure region (Sweden Central recommended for OpenAI)')
param location string

@description('Project name')
param projectName string

@description('Environment')
param environment string

@description('Unique suffix for naming')
param uniqueSuffix string

@description('Key Vault name')
param keyVaultName string

@description('Resource tags')
param tags object

// ============================================================================
// Azure OpenAI Account
// ============================================================================

resource openAIAccount 'Microsoft.CognitiveServices/accounts@2023-10-01-preview' = {
  name: 'oai-${projectName}-${uniqueSuffix}'
  location: location
  tags: tags
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: 'oai-${projectName}-${uniqueSuffix}'
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
    }
  }
}

// ============================================================================
// GPT-4o Deployment
// ============================================================================

resource gpt4oDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = {
  parent: openAIAccount
  name: 'gpt-4o'
  sku: {
    name: 'Standard'
    capacity: environment == 'prod' ? 50 : 10
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o'
      version: '2024-05-13'
    }
    raiPolicyName: 'Microsoft.Default'
  }
}

// ============================================================================
// GPT-4o-mini Deployment (Cost-effective option)
// ============================================================================

resource gpt4oMiniDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = {
  parent: openAIAccount
  name: 'gpt-4o-mini'
  dependsOn: [gpt4oDeployment]
  sku: {
    name: 'Standard'
    capacity: environment == 'prod' ? 100 : 20
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o-mini'
      version: '2024-07-18'
    }
    raiPolicyName: 'Microsoft.Default'
  }
}

// ============================================================================
// Text Embedding Deployment
// ============================================================================

resource embeddingDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = {
  parent: openAIAccount
  name: 'text-embedding-3-large'
  dependsOn: [gpt4oMiniDeployment]
  sku: {
    name: 'Standard'
    capacity: environment == 'prod' ? 120 : 30
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'text-embedding-3-large'
      version: '1'
    }
  }
}

// ============================================================================
// Store Secrets in Key Vault
// ============================================================================

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

resource openAIEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-openai-endpoint'
  properties: {
    value: openAIAccount.properties.endpoint
  }
}

resource openAIKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-openai-key'
  properties: {
    value: openAIAccount.listKeys().key1
  }
}

// ============================================================================
// Outputs
// ============================================================================

output accountName string = openAIAccount.name
output endpoint string = openAIAccount.properties.endpoint
output gpt4oDeploymentName string = gpt4oDeployment.name
output gpt4oMiniDeploymentName string = gpt4oMiniDeployment.name
output embeddingDeploymentName string = embeddingDeployment.name
