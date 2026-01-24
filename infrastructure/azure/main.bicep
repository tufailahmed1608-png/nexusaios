// ============================================================================
// Nexus OS - Azure Infrastructure Main Template
// Region: UAE North (closest to Saudi Arabia with full services)
// ============================================================================

targetScope = 'subscription'

@description('Environment name')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'prod'

@description('Primary Azure region')
param primaryLocation string = 'uaenorth'

@description('Azure OpenAI region (Sweden Central for availability)')
param openAILocation string = 'swedencentral'

@description('Static Web App region (limited availability - using West Europe)')
param staticWebAppLocation string = 'westeurope'

@description('Project name prefix')
param projectName string = 'nexus-os'

@description('PostgreSQL administrator login')
@secure()
param postgresAdminLogin string

@description('PostgreSQL administrator password')
@secure()
param postgresAdminPassword string

@description('Tags for all resources')
param tags object = {
  Project: 'Nexus-OS'
  Environment: environment
  ManagedBy: 'Bicep'
  Region: 'Saudi-Arabia-UAE'
}

// Resource naming
var resourceGroupName = 'rg-${projectName}-${environment}'
var uniqueSuffix = uniqueString(subscription().subscriptionId, projectName, environment)

// ============================================================================
// Resource Group
// ============================================================================

resource resourceGroup 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: resourceGroupName
  location: primaryLocation
  tags: tags
}

// ============================================================================
// Core Infrastructure Module
// ============================================================================

module coreInfrastructure 'modules/core-infrastructure.bicep' = {
  name: 'core-infrastructure'
  scope: resourceGroup
  params: {
    location: primaryLocation
    projectName: projectName
    environment: environment
    uniqueSuffix: uniqueSuffix
    tags: tags
  }
}

// ============================================================================
// Database Module
// ============================================================================

module database 'modules/database.bicep' = {
  name: 'database'
  scope: resourceGroup
  params: {
    location: primaryLocation
    projectName: projectName
    environment: environment
    uniqueSuffix: uniqueSuffix
    adminLogin: postgresAdminLogin
    adminPassword: postgresAdminPassword
    keyVaultName: coreInfrastructure.outputs.keyVaultName
    logAnalyticsWorkspaceId: coreInfrastructure.outputs.logAnalyticsWorkspaceId
    tags: tags
  }
}

// ============================================================================
// Storage Module
// ============================================================================

module storage 'modules/storage.bicep' = {
  name: 'storage'
  scope: resourceGroup
  params: {
    location: primaryLocation
    projectName: projectName
    environment: environment
    uniqueSuffix: uniqueSuffix
    keyVaultName: coreInfrastructure.outputs.keyVaultName
    tags: tags
  }
}

// ============================================================================
// Azure Functions Module
// ============================================================================

module functions 'modules/functions.bicep' = {
  name: 'functions'
  scope: resourceGroup
  params: {
    location: primaryLocation
    projectName: projectName
    environment: environment
    uniqueSuffix: uniqueSuffix
    storageAccountName: storage.outputs.storageAccountName
    keyVaultName: coreInfrastructure.outputs.keyVaultName
    logAnalyticsWorkspaceId: coreInfrastructure.outputs.logAnalyticsWorkspaceId
    tags: tags
  }
}

// ============================================================================
// Static Web App Module
// ============================================================================

module staticWebApp 'modules/static-web-app.bicep' = {
  name: 'static-web-app'
  scope: resourceGroup
  params: {
    location: staticWebAppLocation // Static Web Apps not available in uaenorth
    projectName: projectName
    environment: environment
    functionsHostname: functions.outputs.functionAppHostname
    tags: tags
  }
}

// ============================================================================
// Azure OpenAI Module
// ============================================================================

module openAI 'modules/openai.bicep' = {
  name: 'openai'
  scope: resourceGroup
  params: {
    location: openAILocation
    projectName: projectName
    environment: environment
    uniqueSuffix: uniqueSuffix
    keyVaultName: coreInfrastructure.outputs.keyVaultName
    tags: tags
  }
}

// ============================================================================
// CDN and Front Door Module
// ============================================================================

module cdn 'modules/cdn.bicep' = {
  name: 'cdn'
  scope: resourceGroup
  params: {
    projectName: projectName
    environment: environment
    staticWebAppHostname: staticWebApp.outputs.hostname
    storageAccountHostname: storage.outputs.blobEndpoint
    tags: tags
  }
}

// ============================================================================
// Outputs
// ============================================================================

output resourceGroupName string = resourceGroup.name
output staticWebAppUrl string = staticWebApp.outputs.url
output functionAppUrl string = functions.outputs.functionAppUrl
output cdnEndpoint string = cdn.outputs.cdnEndpoint
output storageAccountName string = storage.outputs.storageAccountName
output postgresServerName string = database.outputs.serverName
output keyVaultName string = coreInfrastructure.outputs.keyVaultName
