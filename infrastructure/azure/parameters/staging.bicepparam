// ============================================================================
// Staging Environment Parameters
// ============================================================================

using '../main.bicep'

param environment = 'staging'
param primaryLocation = 'uaenorth'
param openAILocation = 'swedencentral'
param projectName = 'nexus-os'

// These will be prompted during deployment
param postgresAdminLogin = ''
param postgresAdminPassword = ''

param tags = {
  Project: 'Nexus-OS'
  Environment: 'staging'
  ManagedBy: 'Bicep'
  Region: 'Saudi-Arabia-UAE'
  CostCenter: 'Staging'
}
