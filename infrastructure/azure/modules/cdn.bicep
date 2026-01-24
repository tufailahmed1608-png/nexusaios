// ============================================================================
// CDN and Front Door Module
// Global content delivery and edge optimization
// ============================================================================

@description('Project name')
param projectName string

@description('Environment')
param environment string

@description('Static Web App hostname')
param staticWebAppHostname string

@description('Storage account blob endpoint')
param storageAccountHostname string

@description('Resource tags')
param tags object

// ============================================================================
// Front Door Profile
// ============================================================================

resource frontDoorProfile 'Microsoft.Cdn/profiles@2023-05-01' = {
  name: 'afd-${projectName}-${environment}'
  location: 'global'
  tags: tags
  sku: {
    name: environment == 'prod' ? 'Premium_AzureFrontDoor' : 'Standard_AzureFrontDoor'
  }
  properties: {
    originResponseTimeoutSeconds: 60
  }
}

// ============================================================================
// Front Door Endpoint
// ============================================================================

resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2023-05-01' = {
  parent: frontDoorProfile
  name: 'ep-${projectName}-${environment}'
  location: 'global'
  tags: tags
  properties: {
    enabledState: 'Enabled'
  }
}

// ============================================================================
// Origin Group - Static Web App
// ============================================================================

resource staticWebAppOriginGroup 'Microsoft.Cdn/profiles/originGroups@2023-05-01' = {
  parent: frontDoorProfile
  name: 'og-static-webapp'
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
      additionalLatencyInMilliseconds: 50
    }
    healthProbeSettings: {
      probePath: '/'
      probeRequestType: 'HEAD'
      probeProtocol: 'Https'
      probeIntervalInSeconds: 100
    }
    sessionAffinityState: 'Disabled'
  }
}

resource staticWebAppOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2023-05-01' = {
  parent: staticWebAppOriginGroup
  name: 'origin-static-webapp'
  properties: {
    hostName: staticWebAppHostname
    httpPort: 80
    httpsPort: 443
    originHostHeader: staticWebAppHostname
    priority: 1
    weight: 1000
    enabledState: 'Enabled'
    enforceCertificateNameCheck: true
  }
}

// ============================================================================
// Origin Group - Storage (CDN for static assets)
// ============================================================================

resource storageOriginGroup 'Microsoft.Cdn/profiles/originGroups@2023-05-01' = {
  parent: frontDoorProfile
  name: 'og-storage'
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
      additionalLatencyInMilliseconds: 50
    }
    healthProbeSettings: {
      probePath: '/'
      probeRequestType: 'HEAD'
      probeProtocol: 'Https'
      probeIntervalInSeconds: 100
    }
    sessionAffinityState: 'Disabled'
  }
}

var storageHostname = replace(replace(storageAccountHostname, 'https://', ''), '/', '')

resource storageOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2023-05-01' = {
  parent: storageOriginGroup
  name: 'origin-storage'
  properties: {
    hostName: storageHostname
    httpPort: 80
    httpsPort: 443
    originHostHeader: storageHostname
    priority: 1
    weight: 1000
    enabledState: 'Enabled'
    enforceCertificateNameCheck: true
  }
}

// ============================================================================
// Routes
// ============================================================================

resource defaultRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2023-05-01' = {
  parent: frontDoorEndpoint
  name: 'route-default'
  dependsOn: [staticWebAppOrigin] // Ensure origin exists before route
  properties: {
    originGroup: {
      id: staticWebAppOriginGroup.id
    }
    supportedProtocols: ['Http', 'Https']
    patternsToMatch: ['/*']
    forwardingProtocol: 'HttpsOnly'
    linkToDefaultDomain: 'Enabled'
    httpsRedirect: 'Enabled'
    cacheConfiguration: {
      queryStringCachingBehavior: 'IgnoreQueryString'
      compressionSettings: {
        isCompressionEnabled: true
        contentTypesToCompress: [
          'text/html'
          'text/css'
          'text/javascript'
          'application/javascript'
          'application/json'
          'image/svg+xml'
        ]
      }
    }
  }
}

resource assetsRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2023-05-01' = {
  parent: frontDoorEndpoint
  name: 'route-assets'
  dependsOn: [defaultRoute, storageOrigin] // Ensure origin exists before route
  properties: {
    originGroup: {
      id: storageOriginGroup.id
    }
    supportedProtocols: ['Http', 'Https']
    patternsToMatch: ['/assets/*', '/public-assets/*', '/branding/*']
    forwardingProtocol: 'HttpsOnly'
    linkToDefaultDomain: 'Enabled'
    httpsRedirect: 'Enabled'
    cacheConfiguration: {
      queryStringCachingBehavior: 'IgnoreQueryString'
      compressionSettings: {
        isCompressionEnabled: true
        contentTypesToCompress: [
          'image/svg+xml'
          'image/png'
          'image/jpeg'
          'image/webp'
        ]
      }
    }
  }
}

// ============================================================================
// WAF Policy (Production only)
// ============================================================================

resource wafPolicy 'Microsoft.Network/FrontDoorWebApplicationFirewallPolicies@2022-05-01' = if (environment == 'prod') {
  name: 'waf${replace(projectName, '-', '')}${environment}'
  location: 'global'
  tags: tags
  sku: {
    name: 'Premium_AzureFrontDoor'
  }
  properties: {
    policySettings: {
      enabledState: 'Enabled'
      mode: 'Prevention'
      requestBodyCheck: 'Enabled'
    }
    managedRules: {
      managedRuleSets: [
        {
          ruleSetType: 'Microsoft_DefaultRuleSet'
          ruleSetVersion: '2.1'
          ruleSetAction: 'Block'
        }
        {
          ruleSetType: 'Microsoft_BotManagerRuleSet'
          ruleSetVersion: '1.0'
          ruleSetAction: 'Block'
        }
      ]
    }
  }
}

// ============================================================================
// Security Policy (Links WAF to Endpoint)
// ============================================================================

resource securityPolicy 'Microsoft.Cdn/profiles/securityPolicies@2023-05-01' = if (environment == 'prod') {
  parent: frontDoorProfile
  name: 'security-policy'
  properties: {
    parameters: {
      type: 'WebApplicationFirewall'
      wafPolicy: {
        id: wafPolicy.id
      }
      associations: [
        {
          domains: [
            {
              id: frontDoorEndpoint.id
            }
          ]
          patternsToMatch: ['/*']
        }
      ]
    }
  }
}

// ============================================================================
// Outputs
// ============================================================================

output frontDoorId string = frontDoorProfile.id
output frontDoorName string = frontDoorProfile.name
output cdnEndpoint string = frontDoorEndpoint.properties.hostName
output cdnUrl string = 'https://${frontDoorEndpoint.properties.hostName}'
