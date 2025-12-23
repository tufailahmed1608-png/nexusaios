// ============================================================================
// Development Environment Parameters
// ============================================================================

using '../main.bicep'

param environment = 'dev'
param primaryLocation = 'uaenorth'
param openAILocation = 'swedencentral'
param projectName = 'nexus-os'

// These will be prompted during deployment
param postgresAdminLogin = ''
param postgresAdminPassword = ''

param tags = {
  Project: 'Nexus-OS'
  Environment: 'dev'
  ManagedBy: 'Bicep'
  Region: 'Saudi-Arabia-UAE'
  CostCenter: 'Development'
}
