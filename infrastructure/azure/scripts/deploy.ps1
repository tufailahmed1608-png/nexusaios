# ============================================================================
# Nexus OS - Azure Deployment Script (PowerShell)
# ============================================================================

param(
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment = "dev",
    
    [string]$Location = "uaenorth",
    
    [string]$ProjectName = "nexus-os"
)

$ErrorActionPreference = "Stop"

# Print banner
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║           Nexus OS - Azure Infrastructure Deployment          ║" -ForegroundColor Blue
Write-Host "║                   Saudi Arabia / UAE Region                    ║" -ForegroundColor Blue
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

Write-Host "Deployment Configuration:" -ForegroundColor Yellow
Write-Host "  Environment: $Environment"
Write-Host "  Location: $Location"
Write-Host "  Project Name: $ProjectName"
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Blue

$azInstalled = Get-Command az -ErrorAction SilentlyContinue
if (-not $azInstalled) {
    Write-Host "Azure CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

try {
    $account = az account show | ConvertFrom-Json
}
catch {
    Write-Host "Not logged in to Azure. Running az login..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}

Write-Host "✓ Prerequisites check passed" -ForegroundColor Green
Write-Host ""

Write-Host "Using subscription: $($account.name) ($($account.id))" -ForegroundColor Blue
Write-Host ""

# Prompt for PostgreSQL credentials
Write-Host "Enter PostgreSQL administrator credentials:" -ForegroundColor Yellow
$postgresAdminLogin = Read-Host "Admin username"
$postgresAdminPassword = Read-Host "Admin password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($postgresAdminPassword)
$postgresAdminPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
Write-Host ""

# Validate password
if ($postgresAdminPasswordPlain.Length -lt 8) {
    Write-Host "Password must be at least 8 characters long" -ForegroundColor Red
    exit 1
}

# Create deployment name
$deploymentName = "nexus-os-$Environment-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

Write-Host "Starting deployment: $deploymentName" -ForegroundColor Blue
Write-Host ""

# Run the deployment
try {
    az deployment sub create `
        --name $deploymentName `
        --location $Location `
        --template-file ./main.bicep `
        --parameters "./parameters/$Environment.bicepparam" `
        --parameters postgresAdminLogin=$postgresAdminLogin `
        --parameters postgresAdminPassword=$postgresAdminPasswordPlain `
        --verbose
    
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              Deployment Completed Successfully!               ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    # Get outputs
    Write-Host "Deployment Outputs:" -ForegroundColor Blue
    az deployment sub show `
        --name $deploymentName `
        --query properties.outputs `
        -o table
    
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Configure custom domain DNS records"
    Write-Host "2. Deploy application code to Static Web App"
    Write-Host "3. Deploy Azure Functions code"
    Write-Host "4. Run database migrations"
    Write-Host "5. Configure Azure AD B2C (if using)"
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "Deployment failed: $_" -ForegroundColor Red
    exit 1
}
