# ============================================================================
# Nexus OS - Database Migration Script (PowerShell)
# Description: Run all migrations against Azure Database for PostgreSQL
# ============================================================================

param(
    [string]$DbHost = $env:PGHOST,
    [string]$DbPort = $env:PGPORT,
    [string]$DbName = $env:PGDATABASE,
    [string]$DbUser = $env:PGUSER,
    [string]$DbPassword = $env:PGPASSWORD
)

# Set defaults
if (-not $DbHost) { $DbHost = "localhost" }
if (-not $DbPort) { $DbPort = "5432" }
if (-not $DbName) { $DbName = "nexus_os" }
if (-not $DbUser) { $DbUser = "postgres" }

# Check for required parameters
if (-not $DbPassword) {
    Write-Host "[X] PGPASSWORD environment variable or -DbPassword parameter is required" -ForegroundColor Red
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$MigrationsDir = Join-Path $ScriptDir "..\migrations"

# Set environment variable for psql
$env:PGPASSWORD = $DbPassword

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Nexus OS - Database Migration" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target Database: ${DbHost}:${DbPort}/${DbName}"
Write-Host "User: $DbUser"
Write-Host ""

# Test connection
Write-Host "[*] Testing database connection..." -ForegroundColor Yellow
try {
    $result = psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -c "SELECT 1" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Connection failed"
    }
    Write-Host "[OK] Connection successful" -ForegroundColor Green
} catch {
    Write-Host "[X] Failed to connect to database" -ForegroundColor Red
    exit 1
}

# Create migrations tracking table
Write-Host "[*] Ensuring migrations tracking table exists..." -ForegroundColor Yellow
$createTableSql = @"
CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"@
psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -c $createTableSql 2>&1 | Out-Null

# Get migration files
$migrationFiles = Get-ChildItem -Path $MigrationsDir -Filter "*.sql" | Sort-Object Name

if ($migrationFiles.Count -eq 0) {
    Write-Host "[!] No migration files found in $MigrationsDir" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Running migrations..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $migrationFiles) {
    $filename = $file.Name
    
    # Check if already run
    $checkSql = "SELECT COUNT(*) FROM _migrations WHERE filename = '$filename'"
    $alreadyRun = (psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -t -c $checkSql 2>&1).Trim()
    
    if ($alreadyRun -gt 0) {
        Write-Host "[!] Skipping $filename (already executed)" -ForegroundColor Yellow
        continue
    }
    
    # Run migration
    Write-Host "[*] Running $filename..." -ForegroundColor Yellow
    
    try {
        psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $file.FullName 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            $insertSql = "INSERT INTO _migrations (filename) VALUES ('$filename')"
            psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -c $insertSql 2>&1 | Out-Null
            Write-Host "[OK] Completed $filename" -ForegroundColor Green
        } else {
            throw "Migration failed"
        }
    } catch {
        Write-Host "[X] Failed to run $filename" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "[OK] All migrations completed successfully!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
