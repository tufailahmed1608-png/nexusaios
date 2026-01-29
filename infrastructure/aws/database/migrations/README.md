# AWS RDS PostgreSQL Migrations

This directory contains database migration scripts for AWS RDS PostgreSQL.

## Migration Strategy

The AWS migrations reuse the Azure PostgreSQL migration files since both use standard PostgreSQL. The key differences are:

### 1. Authentication Changes

Replace Supabase `auth.uid()` with AWS Cognito session variable:

```sql
-- Supabase (before)
USING (auth.uid() = user_id)

-- AWS/Cognito (after)  
USING (current_setting('app.current_user_id', true)::uuid = user_id)
```

### 2. Setting User Context in Lambda

In your Lambda functions, set the user context before queries:

```javascript
// Set user context from Cognito JWT
await client.query(`SET app.current_user_id = '${cognitoUserId}'`);
```

### 3. RLS Policy Adjustments

Create a helper function for AWS:

```sql
CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid
$$;
```

## Files

| File | Description |
|------|-------------|
| 001_aws_extensions.sql | AWS-specific PostgreSQL extensions |
| 002_app_functions.sql | User context helper functions |

## Running Migrations

```bash
# From infrastructure/aws/scripts
./migrate-db.sh dev
./migrate-db.sh staging
./migrate-db.sh prod
```

## Notes

- Migrations run in a single transaction for atomicity
- The script automatically falls back to Azure migrations if AWS-specific ones don't exist
- Always test migrations in dev/staging before production
