#!/bin/bash
# ============================================================================
# AWS RDS PostgreSQL Database Migration Script
# Usage: ./migrate-db.sh <environment>
# Example: ./migrate-db.sh dev
# ============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
PROJECT_NAME="masira"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
MIGRATIONS_DIR="$ROOT_DIR/database/migrations"

# Validate arguments
if [ $# -lt 1 ]; then
    echo -e "${RED}Error: Environment argument required${NC}"
    echo "Usage: $0 <environment>"
    exit 1
fi

ENVIRONMENT=$1
STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Running Database Migrations${NC}"
echo -e "${GREEN}Environment: $ENVIRONMENT${NC}"
echo -e "${GREEN}========================================${NC}"

# Check for psql
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql not found. Install PostgreSQL client.${NC}"
    exit 1
fi

# Get database endpoint from CloudFormation
echo -e "\n${YELLOW}Retrieving database connection info...${NC}"

DB_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
    --output text)

SECRET_ARN=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='DatabaseSecretArn'].OutputValue" \
    --output text)

if [ -z "$DB_ENDPOINT" ] || [ -z "$SECRET_ARN" ]; then
    echo -e "${RED}Error: Could not retrieve database info from stack${NC}"
    exit 1
fi

# Get credentials from Secrets Manager
echo -e "${YELLOW}Retrieving database credentials...${NC}"
SECRET_JSON=$(aws secretsmanager get-secret-value \
    --secret-id "$SECRET_ARN" \
    --query SecretString \
    --output text)

DB_USER=$(echo "$SECRET_JSON" | jq -r '.username')
DB_PASS=$(echo "$SECRET_JSON" | jq -r '.password')
DB_NAME="${PROJECT_NAME}_${ENVIRONMENT}"

echo -e "${GREEN}Database: $DB_NAME @ $DB_ENDPOINT${NC}"

# Export password for psql
export PGPASSWORD="$DB_PASS"

# Create database if not exists
echo -e "\n${YELLOW}Ensuring database exists...${NC}"
psql -h "$DB_ENDPOINT" -U "$DB_USER" -d postgres -c "
SELECT 'CREATE DATABASE ${DB_NAME}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
" 2>/dev/null || true

# Run migrations
echo -e "\n${YELLOW}Running migrations...${NC}"

if [ -d "$MIGRATIONS_DIR" ]; then
    for migration in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
        echo -e "${YELLOW}Applying: $(basename "$migration")${NC}"
        psql -h "$DB_ENDPOINT" -U "$DB_USER" -d "$DB_NAME" \
            --single-transaction \
            -f "$migration"
        echo -e "${GREEN}✓ Applied: $(basename "$migration")${NC}"
    done
else
    echo -e "${YELLOW}No migrations directory found. Using Azure migrations...${NC}"
    AZURE_MIGRATIONS_DIR="$ROOT_DIR/../azure/database/migrations"
    
    if [ -d "$AZURE_MIGRATIONS_DIR" ]; then
        for migration in $(ls "$AZURE_MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
            echo -e "${YELLOW}Applying: $(basename "$migration")${NC}"
            psql -h "$DB_ENDPOINT" -U "$DB_USER" -d "$DB_NAME" \
                --single-transaction \
                -f "$migration"
            echo -e "${GREEN}✓ Applied: $(basename "$migration")${NC}"
        done
    else
        echo -e "${RED}No migration files found${NC}"
        exit 1
    fi
fi

# Verify migration
echo -e "\n${YELLOW}Verifying migration...${NC}"
TABLES=$(psql -h "$DB_ENDPOINT" -U "$DB_USER" -d "$DB_NAME" -t -c "
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
")

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Migration Complete!${NC}"
echo -e "${GREEN}Tables created: $(echo $TABLES | tr -d ' ')${NC}"
echo -e "${GREEN}========================================${NC}"

# Cleanup
unset PGPASSWORD
