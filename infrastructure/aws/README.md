# AWS Infrastructure for Masira/Nexus AI OS

## Overview

This directory contains Infrastructure-as-Code (IaC) templates for deploying Masira on AWS using:
- **AWS Amplify** - Managed full-stack hosting for React frontend
- **Amazon RDS PostgreSQL** - Managed PostgreSQL database
- **AWS Lambda** - Serverless functions (replacing Supabase Edge Functions)
- **Amazon Cognito** - Authentication (replacing Supabase Auth)
- **Amazon S3** - File storage
- **Amazon CloudFront** - CDN (optional, Amplify includes CDN)
- **AWS Secrets Manager** - Secure secrets storage

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              AWS Cloud                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   Route 53   │───▶│  CloudFront  │───▶│ AWS Amplify  │              │
│  │    (DNS)     │    │    (CDN)     │    │  (Frontend)  │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│                                                 │                        │
│                                                 ▼                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        API Gateway                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                        │
│                                ▼                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   Lambda     │    │   Lambda     │    │   Lambda     │              │
│  │  (ai-chat)   │    │  (signals)   │    │  (connectors)│              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                   │                   │                        │
│         └───────────────────┼───────────────────┘                        │
│                             ▼                                            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │  RDS         │    │   S3         │    │   Cognito    │              │
│  │ PostgreSQL   │    │  (Storage)   │    │   (Auth)     │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────┐    ┌──────────────┐                                  │
│  │   Secrets    │    │  CloudWatch  │                                  │
│  │   Manager    │    │   (Logs)     │                                  │
│  └──────────────┘    └──────────────┘                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
infrastructure/aws/
├── README.md                    # This file
├── cloudformation/
│   ├── main.yaml               # Main stack template
│   ├── amplify.yaml            # Amplify app configuration
│   ├── database.yaml           # RDS PostgreSQL
│   ├── lambda.yaml             # Lambda functions
│   ├── cognito.yaml            # Authentication
│   ├── storage.yaml            # S3 buckets
│   └── api-gateway.yaml        # API Gateway
├── database/
│   ├── migrations/             # SQL migration files
│   └── scripts/                # Migration scripts
├── lambda/
│   └── functions/              # Lambda function code
├── parameters/
│   ├── dev.json                # Development parameters
│   ├── staging.json            # Staging parameters
│   └── prod.json               # Production parameters
└── scripts/
    ├── deploy.sh               # Deployment script
    └── migrate-db.sh           # Database migration script
```

## Prerequisites

1. **AWS CLI** installed and configured
2. **AWS Account** with appropriate permissions
3. **Node.js 18+** for Lambda functions
4. **PostgreSQL client** for database migrations

## Quick Start

### 1. Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and preferred region
```

### 2. Set Environment Parameters
```bash
# Copy and customize parameters
cp parameters/dev.json.example parameters/dev.json
```

### 3. Deploy Infrastructure
```bash
# Deploy to development
./scripts/deploy.sh dev

# Deploy to production
./scripts/deploy.sh prod
```

### 4. Run Database Migrations
```bash
./scripts/migrate-db.sh dev
```

## Service Mapping

| Lovable Cloud (Supabase) | AWS Equivalent |
|--------------------------|----------------|
| Supabase Auth | Amazon Cognito |
| Supabase Database | Amazon RDS PostgreSQL |
| Edge Functions | AWS Lambda + API Gateway |
| Supabase Storage | Amazon S3 |
| Supabase Realtime | AWS AppSync / WebSocket API |
| Row Level Security | Lambda authorizers + DB policies |

## Cost Estimation (Monthly)

### Development Environment
| Service | Configuration | Est. Cost |
|---------|---------------|-----------|
| Amplify | Build minutes (1000) | $0.01/min = ~$10 |
| RDS PostgreSQL | db.t3.micro | ~$15 |
| Lambda | 1M requests | ~$0.20 |
| S3 | 10GB storage | ~$0.23 |
| Cognito | 10K MAU (free tier) | $0 |
| **Total** | | **~$25/month** |

### Production Environment
| Service | Configuration | Est. Cost |
|---------|---------------|-----------|
| Amplify | Build + hosting | ~$50 |
| RDS PostgreSQL | db.r6g.large + Multi-AZ | ~$300 |
| Lambda | 10M requests | ~$2 |
| S3 | 100GB + CloudFront | ~$25 |
| Cognito | 100K MAU | ~$550 |
| API Gateway | 10M requests | ~$35 |
| **Total** | | **~$950/month** |

## Regional Considerations

For optimal latency in your target regions:

| Region | Use Case |
|--------|----------|
| me-south-1 (Bahrain) | Middle East users |
| eu-west-1 (Ireland) | European users |
| us-east-1 (N. Virginia) | Global default, most services |
| ap-south-1 (Mumbai) | South Asian users |

## Migration Steps

### Phase 1: Infrastructure Setup (Week 1)
1. Deploy CloudFormation stacks
2. Configure Cognito user pool
3. Set up RDS instance with security groups
4. Create S3 buckets with policies

### Phase 2: Database Migration (Week 2)
1. Export data from Supabase
2. Transform RLS policies to Lambda authorizers
3. Run migrations on RDS
4. Verify data integrity

### Phase 3: Authentication Migration (Week 2-3)
1. Export user data from Supabase Auth
2. Import users to Cognito (with password reset flow)
3. Update frontend to use Amplify Auth

### Phase 4: Function Migration (Week 3-4)
1. Convert Edge Functions to Lambda
2. Set up API Gateway routes
3. Configure environment variables in Secrets Manager

### Phase 5: Frontend Deployment (Week 4)
1. Update environment variables
2. Deploy to Amplify
3. Configure custom domain
4. Set up CI/CD in Amplify Console

### Phase 6: Testing & Cutover (Week 5)
1. End-to-end testing
2. Performance benchmarking
3. DNS cutover
4. Monitor and optimize

## Security Considerations

- **VPC**: RDS deployed in private subnets
- **Security Groups**: Least-privilege access rules
- **IAM**: Role-based access for Lambda functions
- **Secrets Manager**: No hardcoded credentials
- **WAF**: Optional web application firewall for API Gateway
- **Encryption**: At-rest (KMS) and in-transit (TLS)

## Support

For issues with AWS migration, consult:
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amazon RDS User Guide](https://docs.aws.amazon.com/rds/)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
