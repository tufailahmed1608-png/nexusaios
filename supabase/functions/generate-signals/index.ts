import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enterprise signal templates for realistic data generation
const SIGNAL_TEMPLATES = {
  project: [
    {
      type: 'status_slip',
      titles: [
        '{project} slipped from Green to Amber status',
        '{project} milestone delayed by {days} days',
        '{project} phase completion pushed to next sprint',
      ],
      descriptions: [
        'Project health degraded due to resource constraints and scope changes.',
        'Critical path activities showing {days}-day delay, impacting downstream deliverables.',
        'Sprint velocity dropped 25%, causing timeline compression.',
      ],
      severities: ['medium', 'high'],
    },
    {
      type: 'dependency_delay',
      titles: [
        'Blocked: {project} waiting on {dependency}',
        'External dependency delay impacting {project}',
        'API integration blocked - {dependency} team unresponsive',
      ],
      descriptions: [
        'Upstream dependency from {dependency} delayed by {days} days, blocking integration testing.',
        'Third-party vendor deliverable overdue, critical path at risk.',
        'Cross-team coordination failure causing {days}-day slip.',
      ],
      severities: ['medium', 'high', 'critical'],
    },
    {
      type: 'budget_drift',
      titles: [
        '{project} budget variance at {percentage}%',
        'Cost overrun alert: {project}',
        'Budget reforecast required for {project}',
      ],
      descriptions: [
        'Actual spend exceeds forecast by ${amount}K due to extended timeline.',
        'Resource costs trending {percentage}% above baseline, CFO review requested.',
        'Scope additions driving budget variance, change control needed.',
      ],
      severities: ['medium', 'high'],
    },
    {
      type: 'risk_surfaced',
      titles: [
        'New risk identified: {project} data migration',
        'Technical risk escalated: {project} performance',
        'Vendor risk flagged for {project}',
      ],
      descriptions: [
        'Data quality issues discovered during UAT, potential rework required.',
        'Performance benchmarks failing under load, architecture review needed.',
        'Key vendor showing financial instability, contingency plan activated.',
      ],
      severities: ['medium', 'high', 'critical'],
    },
    {
      type: 'resource_conflict',
      titles: [
        'Resource contention: {stakeholder} over-allocated',
        '{project} losing key resource to higher priority',
        'Skill gap identified in {project} team',
      ],
      descriptions: [
        'Critical resource allocated at 150%, burnout risk and quality concerns.',
        'Senior developer reassigned to emergency project, knowledge transfer incomplete.',
        'Missing cloud architecture expertise, external contractor search initiated.',
      ],
      severities: ['medium', 'high'],
    },
  ],
  communication: [
    {
      type: 'escalation_email',
      titles: [
        'Executive escalation: {project} timeline concerns',
        'VP-level inquiry on {project} status',
        'Board preparation needed for {project} update',
      ],
      descriptions: [
        'CTO requesting immediate status update and recovery plan by EOD.',
        'VP of Operations raised concerns about go-live readiness.',
        'Quarterly board meeting requires {project} progress summary.',
      ],
      severities: ['high', 'critical'],
    },
    {
      type: 'late_approval',
      titles: [
        'Approval pending: {project} change request',
        'Sign-off delayed: {project} Phase {phase} gate',
        'Procurement approval overdue by {days} days',
      ],
      descriptions: [
        'Change request CR-{id} awaiting steering committee approval since {days} days.',
        'Gate review meeting rescheduled twice, blocking next phase start.',
        'Vendor contract pending legal review, impacting timeline.',
      ],
      severities: ['medium', 'high'],
    },
    {
      type: 'executive_nudge',
      titles: [
        'CEO visibility: {project} mentioned in all-hands',
        'Investor update includes {project} metrics',
        'Strategy alignment check: {project}',
      ],
      descriptions: [
        'Project featured in CEO quarterly update, heightened visibility.',
        'Board requested specific KPIs for next investor call.',
        'Strategic pillar review requires {project} alignment confirmation.',
      ],
      severities: ['medium', 'high'],
    },
    {
      type: 'vendor_pressure',
      titles: [
        'Vendor SLA breach: {dependency}',
        'Contract renegotiation requested by {dependency}',
        'Support escalation with {dependency}',
      ],
      descriptions: [
        'SLA response times exceeded for {days} consecutive days.',
        'Vendor requesting 15% cost increase, procurement engaged.',
        'Critical bug unresolved for {days} days, executive escalation initiated.',
      ],
      severities: ['medium', 'high', 'critical'],
    },
  ],
  governance: [
    {
      type: 'policy_violation',
      titles: [
        'Security policy violation detected in {project}',
        'Data governance breach: {project} data handling',
        'Compliance finding: {project} documentation gap',
      ],
      descriptions: [
        'Unauthorized access pattern detected, security review initiated.',
        'PII data found in non-compliant storage, immediate remediation required.',
        'SOX control evidence missing for Q{quarter} audit.',
      ],
      severities: ['high', 'critical'],
    },
    {
      type: 'missing_approval',
      titles: [
        'Architecture review pending: {project}',
        'Security sign-off required: {project} deployment',
        'Legal review incomplete: {project} data processing',
      ],
      descriptions: [
        'Enterprise architecture board review not completed, deployment blocked.',
        'Penetration test results awaiting CISO approval.',
        'GDPR Data Processing Agreement not executed with vendor.',
      ],
      severities: ['medium', 'high'],
    },
    {
      type: 'sla_breach',
      titles: [
        'SLA breach: {project} availability below target',
        'Performance SLA missed: {project} response times',
        'Support SLA violation: {project} incident resolution',
      ],
      descriptions: [
        'System availability at 98.5% vs 99.9% target, root cause analysis underway.',
        'P95 latency at 450ms exceeds 200ms SLA, optimization sprint planned.',
        'Average incident resolution time 8 hours vs 4 hour target.',
      ],
      severities: ['medium', 'high', 'critical'],
    },
    {
      type: 'audit_flag',
      titles: [
        'Internal audit finding: {project}',
        'External audit preparation: {project} controls',
        'Regulatory audit response required: {project}',
      ],
      descriptions: [
        'Control weakness identified in change management process.',
        'SOC 2 Type II evidence collection deadline in {days} days.',
        'OCC examination response due, compliance team engaged.',
      ],
      severities: ['medium', 'high', 'critical'],
    },
  ],
};

const PROJECTS = [
  'Cloud Migration Initiative',
  'Customer Portal Redesign',
  'ERP Modernization',
  'Data Analytics Platform',
  'Mobile App Launch',
  'Security Enhancement Program',
  'API Gateway Implementation',
  'DevOps Transformation',
  'AI/ML Integration',
  'Legacy System Decommission',
];

const STAKEHOLDERS = [
  'Sarah Mitchell (CTO)',
  'James Wilson (CFO)',
  'Emily Chen (VP Engineering)',
  'Michael Brown (Program Director)',
  'Lisa Thompson (PMO Lead)',
  'Robert Kim (Security Officer)',
  'Amanda Foster (Compliance Lead)',
  'David Park (Architecture Lead)',
];

const DEPENDENCIES = [
  'Platform Team',
  'Security Review Board',
  'Vendor Solutions Inc.',
  'Cloud Provider',
  'Data Governance Council',
  'Legal Department',
  'Procurement',
  'External Auditors',
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function interpolateTemplate(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

function generateSignal(category: 'project' | 'communication' | 'governance'): {
  signal_category: string;
  signal_type: string;
  severity: string;
  title: string;
  description: string;
  source: string;
  project_name: string;
  stakeholder: string;
  metadata: Record<string, unknown>;
} {
  const templates = SIGNAL_TEMPLATES[category];
  const template = randomChoice(templates);
  
  const vars = {
    project: randomChoice(PROJECTS),
    stakeholder: randomChoice(STAKEHOLDERS),
    dependency: randomChoice(DEPENDENCIES),
    days: randomInt(2, 14),
    percentage: randomInt(8, 35),
    amount: randomInt(50, 500),
    phase: randomInt(1, 4),
    id: randomInt(1000, 9999),
    quarter: randomInt(1, 4),
  };
  
  const title = interpolateTemplate(randomChoice(template.titles), vars);
  const description = interpolateTemplate(randomChoice(template.descriptions), vars);
  const severity = randomChoice(template.severities);
  
  return {
    signal_category: category,
    signal_type: template.type,
    severity,
    title,
    description,
    source: 'synthetic',
    project_name: vars.project,
    stakeholder: vars.stakeholder,
    metadata: {
      generated_at: new Date().toISOString(),
      template_type: template.type,
      variables: vars,
    },
  };
}

// Allowed roles for signal generation
const ALLOWED_ROLES = ['admin', 'pmo', 'executive'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ============ SECURITY: Require authentication with proper role ============
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has an allowed role (admin, pmo, or executive)
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData || !ALLOWED_ROLES.includes(roleData.role)) {
      console.error(`Unauthorized signal generation attempt by user ${user.id} with role ${roleData?.role}`);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin, PMO, or Executive role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // ============ END SECURITY CHECK ============

    const { action, count = 5, category } = await req.json();

    if (action === 'generate') {
      const signals = [];
      const categories: ('project' | 'communication' | 'governance')[] = 
        category ? [category] : ['project', 'communication', 'governance'];
      
      for (let i = 0; i < count; i++) {
        const cat = randomChoice(categories);
        signals.push(generateSignal(cat));
      }

      const { data, error } = await supabase
        .from('enterprise_signals')
        .insert(signals)
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw new Error(`Failed to insert signals: ${error.message}`);
      }

      console.log(`User ${user.id} (${roleData.role}) generated ${signals.length} signals`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Generated ${signals.length} signals`,
          signals: data 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'clear') {
      const { error } = await supabase
        .from('enterprise_signals')
        .delete()
        .eq('source', 'synthetic');

      if (error) {
        throw new Error(`Failed to clear signals: ${error.message}`);
      }

      console.log(`User ${user.id} (${roleData.role}) cleared synthetic signals`);

      return new Response(
        JSON.stringify({ success: true, message: 'Cleared all synthetic signals' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'stats') {
      const { data, error } = await supabase
        .from('enterprise_signals')
        .select('signal_category, severity, is_resolved');

      if (error) {
        throw new Error(`Failed to get stats: ${error.message}`);
      }

      const stats = {
        total: data?.length || 0,
        byCategory: {
          project: data?.filter(s => s.signal_category === 'project').length || 0,
          communication: data?.filter(s => s.signal_category === 'communication').length || 0,
          governance: data?.filter(s => s.signal_category === 'governance').length || 0,
        },
        bySeverity: {
          low: data?.filter(s => s.severity === 'low').length || 0,
          medium: data?.filter(s => s.severity === 'medium').length || 0,
          high: data?.filter(s => s.severity === 'high').length || 0,
          critical: data?.filter(s => s.severity === 'critical').length || 0,
        },
        unresolved: data?.filter(s => !s.is_resolved).length || 0,
      };

      return new Response(
        JSON.stringify({ success: true, stats }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use: generate, clear, or stats' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-signals:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
