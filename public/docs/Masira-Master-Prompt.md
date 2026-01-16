# Master Prompt: Masira Project OS

> **Version:** 1.0  
> **Last Updated:** January 2026  
> **Classification:** Technical Reference Document

---

## 1. Executive Identity & Positioning

### Application Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Masira (formerly Nexus Project OS) |
| **Type** | Enterprise PMO Intelligence Layer |
| **Architecture** | React SPA + Lovable Cloud (Supabase) |
| **Production URL** | https://nexusaios.lovable.app |

### Core Philosophy

Masira is designed as a **PMO Intelligence Layer** that:

1. **OBSERVES** existing delivery systems (Jira, Microsoft Project, Azure DevOps, ServiceNow)
2. **CONVERTS** meetings and delivery signals into structured intelligence
3. **SUPPORTS** PMO and executive decision-making with AI assistance
4. **ENFORCES** human accountability - AI assists, humans decide

### Explicit Non-Goals

Masira will **NOT**:
- ❌ Replace task systems (Jira, Asana, Monday)
- ❌ Replace email systems
- ❌ Score or rank individuals
- ❌ Perform autonomous task assignment
- ❌ Predict employee performance
- ❌ Act as a system of record

### Target Users

| User Persona | Primary Use Case |
|--------------|------------------|
| **Executive** | Portfolio visibility, strategic decisions |
| **PMO** | Organizational oversight, governance |
| **Program Manager** | Multi-project coordination |
| **Senior Project Manager** | Team oversight, escalation handling |
| **Project Manager** | Day-to-day project operations |

---

## 2. Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI Framework |
| Vite | ^5.4.19 | Build Tool & Dev Server |
| TypeScript | ^5.8.3 | Type Safety |
| Tailwind CSS | ^3.4.17 | Utility-First Styling |
| React Router DOM | ^6.30.1 | Client-Side Routing |
| TanStack React Query | ^5.83.0 | Server State Management |
| Recharts | ^2.15.4 | Data Visualization |
| Lucide React | ^0.462.0 | Icon Library |
| Framer Motion | (via animations) | Animations |
| shadcn/ui | 49 components | UI Component Library |

### Backend Technologies (Lovable Cloud)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | PostgreSQL 15+ | Primary Data Store |
| Security | Row-Level Security (RLS) | Data Access Control |
| Functions | Edge Functions (Deno) | Serverless Backend Logic |
| Authentication | Supabase Auth | Email/Password Auth |
| Realtime | Supabase Realtime | Live Subscriptions |
| AI Gateway | Lovable AI | AI Model Access |

### AI Models Available

| Model | Best For |
|-------|----------|
| `google/gemini-3-flash-preview` | Fast, balanced (default) |
| `google/gemini-2.5-pro` | Complex reasoning, multimodal |
| `google/gemini-2.5-flash` | Cost-effective, good quality |
| `openai/gpt-5` | Highest accuracy |
| `openai/gpt-5-mini` | Balance of cost/performance |

---

## 3. Feature Architecture

### Layer 1: Core Intelligence (Primary Value)

> These features define product-market fit and differentiate Masira.

| Feature | Description | Key Components |
|---------|-------------|----------------|
| **Meeting Intelligence Hub** | AI-powered meeting transcript analysis | Minutes, decisions, action items extraction |
| **Executive Dashboard** | Real-time portfolio intelligence | KPI cards, health charts, velocity metrics |
| **Decision Log** | Executive decision tracking | Full audit trail, status workflow |
| **Strategy View** | Strategic alignment visualization | ROI tracking, pillar alignment |
| **Auto-Generated Reports** | AI-powered status reports | Weekly, monthly, stakeholder formats |

### Layer 2: Operational Support (Secondary Value)

> These features support users but don't define market positioning.

| Feature | Description | Constraints |
|---------|-------------|-------------|
| **Task Board** | Kanban task visualization | Read-focused, not system of record |
| **Documents & Templates** | Reference artifact management | Templates for reports, emails |
| **Stakeholder Management** | Engagement planning | Influence mapping, communication plans |
| **Calendar View** | Meeting scheduling | Integration-ready |
| **Team Management** | Resource visibility | Workload, skills matrix |

### Layer 3: Experience & Signal (Governed Use)

> These features require strict controls and transparency.

| Feature | Description | Governance |
|---------|-------------|------------|
| **Smart Inbox** | Email intelligence | Aggregate signals only, feature toggle |
| **Risk Prediction** | Evidence-based risk assessment | From meetings/delivery data only |
| **Enterprise Signals (SESE)** | Synthetic signal monitoring | Role-restricted access |
| **AI Chat** | Conversational assistant | Full transparency, audit logged |
| **Weekly Digest** | Automated summaries | Human review required |

---

## 4. Database Schema

### Table Overview (18 Tables)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER & AUTH                               │
├─────────────────────────────────────────────────────────────────┤
│  profiles          │ User profile data (display_name, avatar)   │
│  user_roles        │ Role assignments (app_role enum)           │
│  role_definitions  │ Role metadata and permissions JSON         │
│  role_requests     │ Role upgrade workflow                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      GOVERNANCE                                  │
├─────────────────────────────────────────────────────────────────┤
│  decisions             │ Executive decision tracking            │
│  decision_audit_logs   │ Full decision audit trail              │
│  ai_output_audit_logs  │ AI output governance                   │
│  user_activities       │ User activity tracking                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CONTENT                                     │
├─────────────────────────────────────────────────────────────────┤
│  documents          │ Knowledge base (full-text search)         │
│  document_templates │ Reusable document templates               │
│  email_templates    │ Email templates                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      INTEGRATIONS                                │
├─────────────────────────────────────────────────────────────────┤
│  projects_sync          │ External project data                 │
│  tasks_sync             │ External task data                    │
│  kpis_sync              │ KPI metrics from external sources     │
│  integration_configs    │ Integration settings                  │
│  integration_sync_logs  │ Sync history and status               │
│  file_imports           │ File upload tracking                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      SIGNALS                                     │
├─────────────────────────────────────────────────────────────────┤
│  enterprise_signals │ SESE signal data                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CONFIGURATION                               │
├─────────────────────────────────────────────────────────────────┤
│  company_branding  │ White-label settings                       │
│  tenant_settings   │ Multi-tenant configuration                 │
└─────────────────────────────────────────────────────────────────┘
```

### Custom Enum Types

```sql
-- User roles with hierarchy
CREATE TYPE app_role AS ENUM (
  'user',
  'project_manager',
  'senior_project_manager',
  'program_manager',
  'executive',
  'pmo',
  'tenant_admin',
  'admin'
);

-- Signal categories
CREATE TYPE signal_category AS ENUM (
  'project',
  'communication', 
  'governance'
);

-- Signal severity levels
CREATE TYPE signal_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);
```

### Key Table Schemas

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### enterprise_signals
```sql
CREATE TABLE enterprise_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  signal_type TEXT NOT NULL,
  signal_category signal_category NOT NULL,
  severity signal_severity DEFAULT 'medium',
  source TEXT DEFAULT 'synthetic',
  project_name TEXT,
  stakeholder TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### decisions
```sql
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  decision_type TEXT DEFAULT 'strategic',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  project_name TEXT,
  stakeholders TEXT[],
  impact TEXT,
  rationale TEXT,
  amount TEXT,
  decided_by TEXT,
  decided_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Role-Based Access Control (RBAC)

### Role Hierarchy

```typescript
const ROLE_HIERARCHY: Record<string, number> = {
  user: 1,
  project_manager: 2,
  senior_project_manager: 3,
  program_manager: 4,
  executive: 5,
  pmo: 6,
  tenant_admin: 8,
  admin: 10,
};
```

### Feature Access Matrix

| Feature | Admin | PMO | Executive | Program Mgr | Senior PM | PM | User |
|---------|-------|-----|-----------|-------------|-----------|-----|------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inbox | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tasks | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Calendar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Documents | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Projects | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Meetings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Stakeholders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Team | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Risk Prediction | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Weekly Digest | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Strategy | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Activity | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Signals | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Knowledge Base | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Branding | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Admin Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Permission Helper Function

```typescript
export function hasFeatureAccess(
  userRole: string | null,
  feature: FeatureKey
): boolean {
  if (!userRole) return false;
  const requiredRole = FEATURE_ROLE_REQUIREMENTS[feature];
  if (!requiredRole) return true;
  return hasMinimumRole(userRole, requiredRole);
}
```

---

## 6. Edge Functions

### Function Inventory (17 Functions)

| Function | Purpose | Auth Method |
|----------|---------|-------------|
| `ai-chat` | Conversational AI assistant | JWT |
| `generate-report` | AI-powered report generation | JWT |
| `suggest-tasks` | Task extraction from text | JWT |
| `generate-ai-explanation` | AI explainability/transparency | JWT |
| `generate-ai-reply` | Email draft generation | JWT |
| `generate-risk-mitigation` | Risk analysis and mitigation | JWT |
| `generate-weekly-digest` | Automated weekly summaries | JWT |
| `generate-signals` | SESE signal generation | JWT |
| `rag-query` | Knowledge base RAG queries | JWT |
| `sync-project-data` | External data webhook receiver | Webhook Secret |
| `parse-file` | File parsing (Excel, PDF, etc.) | JWT |
| `import-file-data` | Parsed data import | JWT |
| `jira-connector` | Jira Cloud integration | JWT |
| `azuredevops-connector` | Azure DevOps integration | JWT |
| `microsoft-graph-connector` | Microsoft 365 integration | JWT |
| `servicenow-connector` | ServiceNow integration | JWT |
| `create-test-users` | Development utility | JWT |

### Edge Function Template

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Function logic here

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Lovable AI Gateway Usage

```typescript
const response = await fetch("https://api.lovable.dev/api/v1/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
  },
  body: JSON.stringify({
    model: "google/gemini-3-flash-preview",
    messages: [
      { role: "system", content: "System prompt here" },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
  }),
});
```

---

## 7. AI Operating Principles (Trustworthy AI)

### Five Core Principles

1. **AI Assists Only**
   - AI prepares analysis and recommendations
   - Humans make all final decisions
   - No autonomous actions

2. **State Lifecycle**
   ```
   Draft → Reviewed → Approved → Published
   ```
   - Executives see only Approved/Published content
   - All transitions logged with user attribution

3. **Full Transparency**
   - Every AI output shows:
     - Source data (meeting, Jira item, etc.)
     - Reasoning/rationale
     - Confidence indicator (percentage)
     - Approval status

4. **Configurable Scope**
   - Tenant Admin/PMO controls AI visibility
   - Can include/exclude specific:
     - Projects
     - Meetings
     - Data systems

5. **Complete Audit Trail**
   - All AI actions logged to `ai_output_audit_logs`
   - Includes user ID, timestamp, action details
   - Non-deletable records

### UI Components for Trustworthy AI

| Component | Purpose | Location |
|-----------|---------|----------|
| `AIOutputStatus` | Shows Draft/Reviewed/Approved/Published | Reports View |
| `AIExplainability` | Displays AI reasoning and sources | AI-generated content |
| `WhyAmISeeingThis` | Contextual visibility explanation | Throughout app |
| `AIScopeVisualizer` | Shows AI data access scope | Settings |
| `TrustIndicator` | Confidence percentage badge | AI outputs |

---

## 8. Design System

### Brand Identity

| Attribute | Value |
|-----------|-------|
| **Primary Brand** | Masira |
| **Logo** | `src/assets/masira-logo.ico` |
| **Favicon** | `public/favicon.ico` |
| **CSS Prefix** | `.masira-*` |

### Color Palette (HSL Format)

```css
:root {
  /* Primary - Teal/Cyan */
  --primary: 174 84% 40%;
  --primary-foreground: 0 0% 100%;
  
  /* Secondary */
  --secondary: 180 10% 15%;
  --secondary-foreground: 0 0% 90%;
  
  /* Accent */
  --accent: 174 60% 30%;
  --accent-foreground: 0 0% 100%;
  
  /* Background */
  --background: 180 15% 8%;
  --foreground: 0 0% 95%;
  
  /* Muted */
  --muted: 180 10% 15%;
  --muted-foreground: 0 0% 65%;
  
  /* Cards */
  --card: 180 12% 12%;
  --card-foreground: 0 0% 95%;
  
  /* Borders */
  --border: 180 10% 20%;
  
  /* Destructive */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  
  /* Custom Masira Tokens */
  --masira-sidebar: 180 20% 10%;
  --masira-sidebar-border: 180 15% 18%;
  --masira-kpi-positive: 160 84% 39%;
  --masira-kpi-negative: 346 77% 50%;
  --masira-kpi-neutral: 45 93% 47%;
}
```

### Typography

| Context | Font Family | Fallback |
|---------|-------------|----------|
| English (LTR) | Lato, Inter | system-ui, sans-serif |
| Arabic (RTL) | Cairo | system-ui, sans-serif |
| Headings | Lato | system-ui, sans-serif |
| Body | Inter | system-ui, sans-serif |
| Monospace | JetBrains Mono | monospace |

### Component Classes

```css
/* Cards */
.masira-card {
  @apply bg-card border border-border rounded-lg;
}

/* Glassmorphism */
.masira-glass {
  @apply bg-background/80 backdrop-blur-sm;
}

/* Gradient Text */
.masira-gradient-text {
  @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
}

/* Sidebar Items */
.masira-sidebar-item {
  @apply flex items-center gap-3 px-3 py-2 rounded-lg 
         text-muted-foreground hover:bg-muted hover:text-foreground 
         transition-colors;
}

/* KPI Cards */
.masira-kpi-card {
  @apply bg-card border border-border rounded-xl p-4;
}
```

### Layout Constants

| Element | Value |
|---------|-------|
| Sidebar Width | 280px |
| Header Height | 64px |
| Content Max Width | 1400px |
| Card Border Radius | 8px (rounded-lg) |
| Mobile Breakpoint | 768px |

---

## 9. Integration Patterns

### Synthetic Enterprise Signal Engine (SESE)

The SESE is a **pull-based simulation system** that generates synthetic enterprise signals for demonstration and testing.

#### Signal Categories

| Category | Examples |
|----------|----------|
| **Project** | Budget drift, timeline delay, resource conflict |
| **Communication** | Escalation email, stakeholder sentiment shift |
| **Governance** | SLA breach, compliance gap, approval pending |

#### Signal Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Generate   │────▶│ enterprise_signals│────▶│  UI Components  │
│  Function   │     │     (table)       │     │   (realtime)    │
└─────────────┘     └──────────────────┘     └─────────────────┘
       │                     │                        │
       │                     │                        ▼
       │                     │              ┌─────────────────┐
       │                     └─────────────▶│  SignalWidget   │
       │                                    │  SignalStats    │
       │                                    │  SignalFilters  │
       ▼                                    └─────────────────┘
┌─────────────┐
│  Templates  │
│  (dynamic)  │
└─────────────┘
```

#### Usage in Components

```typescript
import { useEnterpriseSignals } from '@/hooks/useEnterpriseSignals';

function MyComponent() {
  const { signals, stats, generateSignals, isLoading } = useEnterpriseSignals();
  
  // Filter by project
  const projectSignals = signals?.filter(s => s.project_name === 'Alpha');
  
  // Stats are never null
  console.log(stats.unresolved, stats.bySeverity.critical);
}
```

### External Data Sync Pattern

#### Supported Platforms

| Platform | Connector Function | Data Synced |
|----------|-------------------|-------------|
| Jira Cloud | `jira-connector` | Projects, Issues |
| Azure DevOps | `azuredevops-connector` | Projects, Work Items |
| Microsoft 365 | `microsoft-graph-connector` | Calendar, Planner |
| ServiceNow | `servicenow-connector` | Incidents, Changes |

#### Sync Tables

```sql
-- Projects from external systems
projects_sync (
  external_id,   -- Original system ID
  name, description, health, progress,
  budget, spent, priority, category,
  start_date, end_date,
  source,        -- 'jira', 'azuredevops', etc.
  raw_data       -- Original JSON payload
)

-- Tasks from external systems
tasks_sync (
  external_id,
  project_external_id,
  title, description, status, priority,
  assignee, due_date, tags,
  source,
  raw_data
)

-- KPIs from external systems
kpis_sync (
  title, value, change, trend,
  source, icon,
  raw_data
)
```

#### Status Mapping

| External Status | Internal Status |
|-----------------|-----------------|
| Completed, Done, Closed | `done` |
| In Progress, Active | `in-progress` |
| Pending, To Do, New | `todo` |
| Blocked, On Hold | `review` |

---

## 10. Environment Configuration

### Frontend Variables (Auto-Provided)

```bash
# Automatically set by Lovable Cloud
VITE_SUPABASE_URL=https://ixkknbhlbafeucgmafpk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=ixkknbhlbafeucgmafpk
```

### Edge Function Variables

```bash
# Auto-provided
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Required for AI
LOVABLE_API_KEY          # Lovable AI Gateway access

# Optional for integrations
SYNC_WEBHOOK_SECRET      # External webhook auth
JIRA_API_TOKEN           # Jira integration
AZURE_DEVOPS_PAT         # Azure DevOps integration
MS_GRAPH_CLIENT_SECRET   # Microsoft Graph integration
```

### Secrets Management

Secrets are managed through Lovable Cloud UI:
1. Navigate to Settings → Secrets
2. Add key-value pairs
3. Available in Edge Functions via `Deno.env.get()`

---

## 11. Project Structure

```
masira-project-os/
├── public/
│   ├── docs/                    # Documentation
│   │   ├── Masira-Master-Prompt.md
│   │   ├── Masira-Project-Blueprint.md
│   │   └── Nexus-Project-OS-Product-Details.md
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── assets/                  # Static assets
│   │   ├── masira-logo.ico
│   │   ├── inbox/               # Inbox avatars
│   │   ├── projects/            # Project avatars
│   │   ├── stakeholders/        # Stakeholder avatars
│   │   └── team/                # Team avatars
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components (49)
│   │   ├── layout/              # Header, Sidebar
│   │   ├── dashboard/           # Dashboard components
│   │   ├── signals/             # SESE components
│   │   ├── ai/                  # Trustworthy AI components
│   │   ├── admin/               # Admin components
│   │   └── [feature]/           # Feature-specific components
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx          # Authentication
│   │   ├── useUserRole.tsx      # Role management
│   │   ├── useEnterpriseSignals.tsx  # SESE hook
│   │   ├── useTenantSettings.tsx     # Tenant config
│   │   └── [feature].tsx        # Feature-specific hooks
│   │
│   ├── pages/
│   │   ├── Index.tsx            # Main app shell
│   │   ├── Landing.tsx          # Public landing
│   │   ├── Auth.tsx             # Authentication
│   │   ├── Settings.tsx         # User settings
│   │   └── [feature].tsx        # Feature pages
│   │
│   ├── lib/
│   │   ├── utils.ts             # Utilities
│   │   └── permissions.ts       # RBAC logic
│   │
│   ├── integrations/supabase/
│   │   ├── client.ts            # Supabase client (auto-generated)
│   │   └── types.ts             # Database types (auto-generated)
│   │
│   ├── data/
│   │   └── mockData.ts          # Demo/mock data
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles & tokens
│
├── supabase/
│   ├── config.toml              # Supabase config (auto-managed)
│   ├── migrations/              # Database migrations
│   └── functions/               # Edge functions
│       ├── ai-chat/
│       ├── generate-report/
│       ├── generate-signals/
│       └── [function-name]/
│
├── infrastructure/azure/        # Azure migration files
│   ├── main.bicep
│   ├── modules/
│   └── database/migrations/
│
└── .github/workflows/           # CI/CD pipelines
```

---

## 12. Test Accounts

### Demo User Credentials

| Email | Role | Password |
|-------|------|----------|
| `pm@nexusaios.com` | Project Manager | `Jan@2026*` |
| `spm@nexusaios.com` | Senior Project Manager | `Jan@2026*` |
| `pgm@nexusaios.com` | Program Manager | `Jan@2026*` |
| `pmo@nexusaios.com` | PMO | `Jan@2026*` |
| `exc@nexusaios.com` | Executive | `Jan@2026*` |
| `admin@nexusaios.com` | Admin | `Jan@2026*` |

### Testing Workflow

1. Login with role-appropriate account
2. Navigate through role-restricted features
3. Verify RBAC enforcement
4. Test AI features with transparency components
5. Generate and review signals via SESE

---

## 13. Development Guidelines

### Code Style

```typescript
// Component naming: PascalCase
export function SignalWidget({ projectName }: SignalWidgetProps) {}

// Hook naming: camelCase with 'use' prefix
export function useEnterpriseSignals() {}

// File naming: PascalCase for components, camelCase for hooks
// SignalWidget.tsx, useEnterpriseSignals.tsx

// Always use semantic design tokens
className="bg-card text-foreground border-border"  // ✅
className="bg-gray-800 text-white border-gray-700" // ❌
```

### Component Patterns

```typescript
// Use optional chaining for potentially null data
const count = stats?.unresolved ?? 0;

// Provide fallbacks for arrays
const items = (signals || []).filter(...);

// Use TypeScript strictly
interface Props {
  projectName?: string;  // Optional props explicit
  onClose: () => void;   // Callbacks typed
}
```

### Database Queries

```typescript
// Always use typed queries
const { data, error } = await supabase
  .from('enterprise_signals')
  .select('*')
  .eq('is_resolved', false)
  .order('created_at', { ascending: false });

// Handle errors appropriately
if (error) throw error;
```

---

## 14. Deployment

### Lovable Cloud (Primary)

- Automatic deployment on git push
- Edge functions deploy automatically
- Database migrations via Lovable tools
- Preview URLs for testing

### Azure Migration (Future)

- Bicep templates in `/infrastructure/azure/`
- Database migrations in `/infrastructure/azure/database/`
- Deployment scripts for PowerShell and Bash
- Target regions: UAE North, Saudi Arabia

---

## 15. Support & Resources

### Documentation

| Document | Location |
|----------|----------|
| Master Prompt | `public/docs/Masira-Master-Prompt.md` |
| Project Blueprint | `public/docs/Masira-Project-Blueprint.md` |
| Product Details | `public/docs/Nexus-Project-OS-Product-Details.md` |
| Azure Migration | `public/docs/Azure-Migration-Guide.md` |

### Quick Links

- **Production:** https://nexusaios.lovable.app
- **Preview:** https://id-preview--5fcedf8c-a439-4cd9-988b-dba1641e3258.lovable.app

---

*This document serves as the authoritative reference for the Masira Project OS. All development decisions should align with the principles and patterns documented here.*
