#!/bin/bash

# ============================================================================
# Nexus OS - Azure Deployment Script
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="dev"
LOCATION="uaenorth"
PROJECT_NAME="nexus-os"

# Print banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           Nexus OS - Azure Infrastructure Deployment          ║"
echo "║                   Saudi Arabia / UAE Region                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -l|--location)
            LOCATION="$2"
            shift 2
            ;;
        -n|--name)
            PROJECT_NAME="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: ./deploy.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -e, --environment    Environment (dev, staging, prod). Default: dev"
            echo "  -l, --location       Azure region. Default: uaenorth"
            echo "  -n, --name           Project name. Default: nexus-os"
            echo "  -h, --help           Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${YELLOW}Deployment Configuration:${NC}"
echo "  Environment: $ENVIRONMENT"
echo "  Location: $LOCATION"
echo "  Project Name: $PROJECT_NAME"
echo ""

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Azure. Running az login...${NC}"
    az login
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Get current subscription
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo -e "${BLUE}Using subscription: ${SUBSCRIPTION_NAME} (${SUBSCRIPTION_ID})${NC}"
echo ""

# Prompt for PostgreSQL credentials
echo -e "${YELLOW}Enter PostgreSQL administrator credentials:${NC}"
read -p "Admin username: " POSTGRES_ADMIN_LOGIN
read -sp "Admin password: " POSTGRES_ADMIN_PASSWORD
echo ""
echo ""

# Validate password requirements
if [[ ${#POSTGRES_ADMIN_PASSWORD} -lt 8 ]]; then
    echo -e "${RED}Password must be at least 8 characters long${NC}"
    exit 1
fi

# Create deployment
DEPLOYMENT_NAME="nexus-os-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}Starting deployment: ${DEPLOYMENT_NAME}${NC}"
echo ""

# Run the deployment
az deployment sub create \
    --name "$DEPLOYMENT_NAME" \
    --location "$LOCATION" \
    --template-file ./main.bicep \
    --parameters "./parameters/${ENVIRONMENT}.bicepparam" \
    --parameters postgresAdminLogin="$POSTGRES_ADMIN_LOGIN" \
    --parameters postgresAdminPassword="$POSTGRES_ADMIN_PASSWORD" \
    --verbose

# Check deployment status
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              Deployment Completed Successfully!               ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Get outputs
    echo -e "${BLUE}Deployment Outputs:${NC}"
    az deployment sub show \
        --name "$DEPLOYMENT_NAME" \
        --query properties.outputs \
        -o table
    
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Configure custom domain DNS records"
    echo "2. Deploy application code to Static Web App"
    echo "3. Deploy Azure Functions code"
    echo "4. Run database migrations"
    echo "5. Configure Azure AD B2C (if using)"
    echo ""
else
    echo ""
    echo -e "${RED}Deployment failed. Check the error messages above.${NC}"
    exit 1
fi
