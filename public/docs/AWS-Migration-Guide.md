# Masira AWS Migration Guide

## Executive Summary

This guide details the migration of Masira from Lovable Cloud (Supabase) to Amazon Web Services (AWS). The migration leverages AWS Amplify for frontend hosting, Amazon RDS PostgreSQL for database, AWS Lambda for serverless functions, and Amazon Cognito for authentication.

## Migration Rationale

Based on your stated requirements:
- **Cost Optimization**: AWS Reserved Instances and Savings Plans offer significant discounts
- **Regional Requirements**: AWS has more global regions than Azure/Supabase
- **Team Expertise**: Leveraging existing AWS knowledge reduces learning curve

## Architecture Comparison

| Component | Current (Lovable Cloud) | Target (AWS) |
|-----------|------------------------|--------------|
| Frontend Hosting | Lovable Cloud | AWS Amplify |
| Database | Supabase PostgreSQL | Amazon RDS PostgreSQL |
| Authentication | Supabase Auth | Amazon Cognito |
| Serverless Functions | Edge Functions | AWS Lambda |
| File Storage | Supabase Storage | Amazon S3 |
| Real-time | Supabase Realtime | AWS AppSync / WebSocket API |
| API Gateway | Built-in | Amazon API Gateway |

## Cost Analysis

### Monthly Cost Comparison

| Tier | Lovable Cloud | AWS (Estimated) | Savings |
|------|---------------|-----------------|---------|
| Development | ~$25/mo | ~$25/mo | 0% |
| Startup (10K users) | ~$200/mo | ~$180/mo | 10% |
| Growth (50K users) | ~$500/mo | ~$400/mo | 20% |
| Enterprise (100K+ users) | ~$1,500/mo | ~$950/mo | 37% |

*Note: AWS costs assume 1-year Reserved Instances for RDS and Compute Savings Plans*

## Migration Phases

### Phase 1: Infrastructure Setup (Week 1)

1. **Deploy CloudFormation Stack**
   ```bash
   cd infrastructure/aws/scripts
   ./deploy.sh dev
   ```

2. **Verify Resources Created**
   - VPC with public/private subnets
   - RDS PostgreSQL instance
   - Cognito User Pool
   - S3 buckets
   - API Gateway
   - Amplify app

### Phase 2: Database Migration (Week 2)

#### 2.1 Export Data from Supabase

```sql
-- Run in Supabase SQL Editor
\copy public.profiles TO '/tmp/profiles.csv' WITH CSV HEADER;
\copy public.user_roles TO '/tmp/user_roles.csv' WITH CSV HEADER;
\copy public.decisions TO '/tmp/decisions.csv' WITH CSV HEADER;
-- Repeat for all 18 tables
```

#### 2.2 Run Schema Migrations

```bash
./migrate-db.sh dev
```

#### 2.3 Import Data

```bash
# Import to RDS
psql -h <rds-endpoint> -U masira_admin -d masira_dev \
  -c "\copy public.profiles FROM '/tmp/profiles.csv' WITH CSV HEADER;"
```

### Phase 3: Authentication Migration (Week 2-3)

#### 3.1 Cognito User Import

Create a Lambda to import users:

```javascript
const { CognitoIdentityProviderClient, AdminCreateUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

async function importUser(email, metadata) {
  const command = new AdminCreateUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'custom:supabase_id', Value: metadata.id }
    ],
    MessageAction: 'SUPPRESS' // Don't send welcome email
  });
  
  await client.send(command);
}
```

#### 3.2 Update Frontend Auth

Replace Supabase client with Amplify:

```typescript
// Before (Supabase)
import { supabase } from '@/integrations/supabase/client';
await supabase.auth.signInWithPassword({ email, password });

// After (AWS Amplify)
import { signIn } from 'aws-amplify/auth';
await signIn({ username: email, password });
```

### Phase 4: Function Migration (Week 3-4)

#### 4.1 Convert Edge Functions to Lambda

Example conversion for `ai-chat`:

**Before (Deno/Supabase):**
```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { message } = await req.json();
  // Process with AI
  return new Response(JSON.stringify({ response }));
});
```

**After (Node.js/Lambda):**
```javascript
// infrastructure/aws/lambda/functions/ai-chat/index.js
exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);
  // Process with AI
  return {
    statusCode: 200,
    body: JSON.stringify({ response })
  };
};
```

#### 4.2 Environment Variables

| Supabase Secret | AWS Equivalent |
|-----------------|----------------|
| `SUPABASE_URL` | `DATABASE_URL` (RDS endpoint) |
| `SUPABASE_ANON_KEY` | N/A (use IAM) |
| `SUPABASE_SERVICE_ROLE_KEY` | AWS credentials |
| `LOVABLE_API_KEY` | Store in Secrets Manager |

### Phase 5: Frontend Updates (Week 4)

#### 5.1 Install AWS SDK

```bash
npm install aws-amplify @aws-amplify/ui-react
```

#### 5.2 Configure Amplify

```typescript
// src/aws-config.ts
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID
    }
  },
  API: {
    REST: {
      MasiraAPI: {
        endpoint: import.meta.env.VITE_API_URL
      }
    }
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_S3_BUCKET,
      region: import.meta.env.VITE_AWS_REGION
    }
  }
});
```

#### 5.3 Update API Calls

```typescript
// Before (Supabase)
const { data } = await supabase.from('projects').select('*');

// After (AWS)
const response = await fetch(`${API_URL}/projects`, {
  headers: { Authorization: `Bearer ${idToken}` }
});
const data = await response.json();
```

### Phase 6: Testing & Cutover (Week 5)

#### 6.1 Test Checklist

- [ ] User registration/login
- [ ] Password reset flow
- [ ] All CRUD operations
- [ ] File uploads
- [ ] Real-time features
- [ ] AI chat functionality
- [ ] Role-based access control
- [ ] Performance benchmarks

#### 6.2 DNS Cutover

1. Update DNS to point to Amplify domain
2. Set up CloudFront distribution (if needed)
3. Configure SSL certificate in ACM

## Rollback Plan

If issues arise:

1. DNS can be reverted to Lovable Cloud in < 5 minutes
2. Supabase data remains intact during migration
3. Keep Lovable Cloud active for 30 days post-migration

## Security Considerations

### RLS Migration

Supabase RLS policies use `auth.uid()`. For AWS, create equivalent using session variables:

```sql
-- AWS equivalent of Supabase RLS
CREATE POLICY "Users can view own data"
ON public.profiles
FOR SELECT
USING (app.current_user_id() = user_id);
```

### Lambda Authorization

Each Lambda sets user context from Cognito JWT:

```javascript
exports.handler = async (event) => {
  const userId = event.requestContext.authorizer.claims.sub;
  await pool.query(`SET app.current_user_id = '${userId}'`);
  // RLS policies now work
};
```

## Monitoring & Observability

| Aspect | AWS Service |
|--------|-------------|
| Application Logs | CloudWatch Logs |
| Metrics | CloudWatch Metrics |
| Tracing | AWS X-Ray |
| Alerts | CloudWatch Alarms + SNS |
| Cost Monitoring | AWS Cost Explorer |

## Support Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amazon RDS User Guide](https://docs.aws.amazon.com/rds/)
- [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)

## Timeline Summary

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | Infrastructure | CloudFormation deployed, resources created |
| 2 | Database | Schema migrated, data imported |
| 2-3 | Authentication | Cognito configured, users migrated |
| 3-4 | Functions | Lambdas deployed, API Gateway configured |
| 4 | Frontend | Amplify integration, testing |
| 5 | Cutover | DNS switch, monitoring, optimization |

## Appendix: Lambda Function List

| Edge Function | Lambda Name | API Route |
|---------------|-------------|-----------|
| ai-chat | masira-ai-chat | POST /ai/chat |
| generate-signals | masira-signals | POST /signals/generate |
| generate-report | masira-reports | POST /reports/generate |
| sync-project-data | masira-sync | POST /sync/projects |
| jira-connector | masira-jira | POST /integrations/jira |
| azuredevops-connector | masira-azuredevops | POST /integrations/azuredevops |
