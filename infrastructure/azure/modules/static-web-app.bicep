// ============================================================================
// Static Web App Module
// Azure Static Web Apps for React frontend
// ============================================================================

@description('Azure region')
param location string

@description('Project name')
param projectName string

@description('Environment')
param environment string

@description('Functions app hostname for API routing')
param functionsHostname string

@description('Resource tags')
param tags object

// ============================================================================
// Static Web App
// ============================================================================

resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: 'stapp-${projectName}-${environment}'
  location: location
  tags: tags
  sku: {
    name: environment == 'prod' ? 'Standard' : 'Free'
    tier: environment == 'prod' ? 'Standard' : 'Free'
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    buildProperties: {
      appLocation: '/'
      outputLocation: 'dist'
      appBuildCommand: 'npm run build'
    }
  }
}

// ============================================================================
// Static Web App Config
// ============================================================================

resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2023-01-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    VITE_API_URL: 'https://${functionsHostname}'
    VITE_ENVIRONMENT: environment
  }
}

// ============================================================================
// Custom Domain (placeholder - requires manual DNS setup)
// ============================================================================

// Note: Custom domain configuration requires manual DNS verification
// After deployment, configure your domain's DNS:
// 1. Add CNAME record pointing to the Static Web App hostname
// 2. Run: az staticwebapp hostname set --name <app-name> --hostname <your-domain>

// ============================================================================
// Outputs
// ============================================================================

output id string = staticWebApp.id
output name string = staticWebApp.name
output hostname string = staticWebApp.properties.defaultHostname
output url string = 'https://${staticWebApp.properties.defaultHostname}'
output apiKey string = staticWebApp.listSecrets().properties.apiKey
