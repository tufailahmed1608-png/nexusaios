#!/bin/bash
# ============================================================================
# Nexus OS - Database Migration Script
# Description: Run all migrations against Azure Database for PostgreSQL
# ============================================================================

set -e

# Configuration
DB_HOST="${PGHOST:-localhost}"
DB_PORT="${PGPORT:-5432}"
DB_NAME="${PGDATABASE:-nexus_os}"
DB_USER="${PGUSER:-postgres}"
DB_PASSWORD="${PGPASSWORD}"
MIGRATIONS_DIR="$(dirname "$0")/../migrations"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check for required environment variables
if [ -z "$DB_PASSWORD" ]; then
    print_error "PGPASSWORD environment variable is required"
    exit 1
fi

# Create connection string
export PGPASSWORD="$DB_PASSWORD"

echo "=============================================="
echo "Nexus OS - Database Migration"
echo "=============================================="
echo ""
echo "Target Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo "User: $DB_USER"
echo ""

# Test connection
print_status "Testing database connection..."
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
    print_error "Failed to connect to database"
    exit 1
fi
print_status "Connection successful"

# Create migrations tracking table if it doesn't exist
print_status "Ensuring migrations tracking table exists..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<EOF
CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
EOF

# Get list of migration files
MIGRATION_FILES=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort)

if [ -z "$MIGRATION_FILES" ]; then
    print_warning "No migration files found in $MIGRATIONS_DIR"
    exit 0
fi

# Run migrations
echo ""
echo "Running migrations..."
echo ""

for migration_file in $MIGRATION_FILES; do
    filename=$(basename "$migration_file")
    
    # Check if migration has already been run
    already_run=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM _migrations WHERE filename = '$filename'" | tr -d ' ')
    
    if [ "$already_run" -gt 0 ]; then
        print_warning "Skipping $filename (already executed)"
        continue
    fi
    
    # Run the migration
    print_status "Running $filename..."
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration_file" > /dev/null 2>&1; then
        # Record successful migration
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "INSERT INTO _migrations (filename) VALUES ('$filename')" > /dev/null 2>&1
        print_status "Completed $filename"
    else
        print_error "Failed to run $filename"
        exit 1
    fi
done

echo ""
echo "=============================================="
print_status "All migrations completed successfully!"
echo "=============================================="
