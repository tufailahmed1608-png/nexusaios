# Nexus OS - Database Migration Scripts

This directory contains PostgreSQL migration scripts for migrating from Supabase to Azure Database for PostgreSQL Flexible Server.

## Directory Structure

```
database/
├── migrations/          # Sequential SQL migration files
│   ├── 001_create_enums.sql
│   ├── 002_create_core_tables.sql
│   ├── 003_create_business_tables.sql
│   ├── 004_create_branding_tables.sql
│   ├── 005_create_audit_tables.sql
│   ├── 006_create_functions.sql
│   ├── 007_create_triggers.sql
│   ├── 008_create_row_level_security.sql
│   └── 009_seed_data.sql
├── scripts/             # Migration and data transfer scripts
│   ├── migrate.sh       # Bash migration runner
│   ├── migrate.ps1      # PowerShell migration runner
│   ├── export_supabase_data.sql
│   └── import_azure_data.sql
└── README.md
```

## Migration Order

Migrations are executed in numerical order:

| Order | File | Description |
|-------|------|-------------|
| 001 | create_enums.sql | Custom enum types (app_role) |
| 002 | create_core_tables.sql | User profiles, roles, settings |
| 003 | create_business_tables.sql | Decisions, documents, templates |
| 004 | create_branding_tables.sql | Company branding configuration |
| 005 | create_audit_tables.sql | Activity and audit logs |
| 006 | create_functions.sql | Database functions (has_role, etc.) |
| 007 | create_triggers.sql | Auto-update triggers |
| 008 | create_row_level_security.sql | RLS policies |
| 009 | seed_data.sql | Initial seed data |

## Prerequisites

1. **Azure Database for PostgreSQL Flexible Server** created
2. **PostgreSQL client tools** installed (`psql`)
3. **Network access** to the database (firewall rules configured)

## Running Migrations

### Using Bash (Linux/macOS/WSL)

```bash
# Set environment variables
export PGHOST="your-server.postgres.database.azure.com"
export PGPORT="5432"
export PGDATABASE="nexus_os"
export PGUSER="adminuser"
export PGPASSWORD="your-password"

# Run migrations
chmod +x scripts/migrate.sh
./scripts/migrate.sh
```

### Using PowerShell (Windows)

```powershell
# Set environment variables
$env:PGHOST = "your-server.postgres.database.azure.com"
$env:PGPORT = "5432"
$env:PGDATABASE = "nexus_os"
$env:PGUSER = "adminuser"
$env:PGPASSWORD = "your-password"

# Run migrations
.\scripts\migrate.ps1
```

### Using Azure CLI

```bash
# Connect using Azure CLI authentication
az postgres flexible-server connect \
  --name your-server-name \
  --admin-user adminuser \
  --admin-password your-password \
  --database-name nexus_os
```

## Data Migration

### Step 1: Export from Supabase

1. Connect to your Supabase database
2. Run the export script:

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres \
  -f scripts/export_supabase_data.sql
```

3. CSV files will be saved to `/tmp/nexus_export/`

### Step 2: Transfer Files to Azure

```bash
# Upload to Azure Blob Storage
az storage blob upload-batch \
  --destination your-container \
  --source /tmp/nexus_export/ \
  --account-name yourstorageaccount
```

### Step 3: Import to Azure PostgreSQL

1. Download files to Azure PostgreSQL accessible location
2. Update file paths in `import_azure_data.sql`
3. Run the import:

```bash
psql -h your-server.postgres.database.azure.com \
  -U adminuser -d nexus_os \
  -f scripts/import_azure_data.sql
```

## Key Differences from Supabase

### Row Level Security (RLS)

Azure PostgreSQL supports RLS, but unlike Supabase, there's no built-in `auth.uid()` function. Instead:

1. **Set user context** in your application before queries:
   ```sql
   SET LOCAL app.current_user_id = 'user-uuid-here';
   ```

2. **Use the helper function**:
   ```sql
   SELECT current_user_id();  -- Returns the set user ID
   ```

### Authentication

- Supabase Auth is replaced with **Azure AD B2C**
- User IDs are maintained as UUIDs for compatibility
- Authentication tokens should be validated server-side

### Storage

- Supabase Storage is replaced with **Azure Blob Storage**
- Update `avatar_url` and `logo_url` paths after migration

## Rollback

Each migration is tracked in the `_migrations` table. To rollback:

```sql
-- Check migration history
SELECT * FROM _migrations ORDER BY executed_at DESC;

-- Manual rollback (create corresponding rollback scripts)
-- Example: DROP TABLE decisions CASCADE;
-- Then remove from tracking:
DELETE FROM _migrations WHERE filename = '003_create_business_tables.sql';
```

## Troubleshooting

### Connection Issues

```bash
# Test connectivity
psql -h your-server.postgres.database.azure.com -U adminuser -d postgres -c "SELECT 1"

# Check firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group your-rg \
  --name your-server-name
```

### Permission Issues

```sql
-- Grant schema permissions
GRANT ALL ON SCHEMA public TO adminuser;
GRANT ALL ON ALL TABLES IN SCHEMA public TO adminuser;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO adminuser;
```

### SSL Connection

Azure PostgreSQL requires SSL. If you have issues:

```bash
# Force SSL in connection string
psql "host=your-server.postgres.database.azure.com port=5432 dbname=nexus_os user=adminuser password=your-password sslmode=require"
```

## Support

For issues related to:
- **Azure PostgreSQL**: [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/azure/postgresql/)
- **Migration**: Create an issue in the project repository
