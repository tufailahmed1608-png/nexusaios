-- ============================================================================
-- AWS RDS PostgreSQL Extensions
-- Run first to enable required extensions
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable text search (for document search)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable case-insensitive text
CREATE EXTENSION IF NOT EXISTS "citext";

-- Note: pgvector for AI embeddings requires RDS with pgvector support
-- CREATE EXTENSION IF NOT EXISTS "vector";
