export interface KPI {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  sentiment: {
    label: 'positive' | 'neutral' | 'negative';
    score: number;
    confidence: number;
  };
  escalationLevel: 'L1' | 'L2' | 'L3' | 'L4';
  extractedTasks: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string;
  project: string;
  tags: string[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  attendees: string[];
  transcript: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Project {
  id: string;
  name: string;
  health: 'on-track' | 'at-risk' | 'critical';
  progress: number;
  budget: number;
  spent: number;
  team: string[];
}

export interface ChartData {
  name: string;
  value?: number;
  budget?: number;
  actual?: number;
}

export const kpis: KPI[] = [
  { id: '1', title: 'Active Projects', value: '24', change: 12, trend: 'up', icon: 'folder' },
  { id: '2', title: 'Tasks Completed', value: '156', change: 8, trend: 'up', icon: 'check-circle' },
  { id: '3', title: 'Team Velocity', value: '94%', change: -2, trend: 'down', icon: 'zap' },
  { id: '4', title: 'Budget Utilization', value: '78%', change: 5, trend: 'up', icon: 'dollar-sign' },
];

export const emails: Email[] = [
  {
    id: '1',
    from: 'Sarah Chen',
    fromEmail: 'sarah.chen@client.com',
    subject: 'Urgent: Q4 Deliverables Review',
    preview: 'We need to discuss the timeline adjustments for the Q4 deliverables...',
    body: `Hi Team,

I hope this email finds you well. We need to discuss the timeline adjustments for the Q4 deliverables as soon as possible.

After reviewing the current progress, I have some concerns about meeting the December 15th deadline. The following items need immediate attention:

1. Integration testing phase is running behind schedule
2. Client UAT feedback has not been fully addressed
3. Documentation updates are pending

Can we schedule a call this week to discuss mitigation strategies?

Best regards,
Sarah`,
    timestamp: '2024-01-15T09:30:00Z',
    isRead: false,
    isStarred: true,
    sentiment: { label: 'negative', score: 0.72, confidence: 0.89 },
    escalationLevel: 'L3',
    extractedTasks: [
      'Schedule call to discuss Q4 timeline',
      'Review integration testing status',
      'Address UAT feedback',
    ],
    priority: 'high',
  },
  {
    id: '2',
    from: 'Michael Torres',
    fromEmail: 'm.torres@partner.co',
    subject: 'Partnership Renewal - Great News!',
    preview: 'Excited to share that the board has approved our partnership renewal...',
    body: `Hello,

Excited to share that the board has approved our partnership renewal for another 3 years! This is fantastic news for both our organizations.

Key highlights:
- 20% increase in collaboration budget
- New joint venture opportunities
- Expanded geographic coverage

Let's celebrate this milestone and plan our roadmap for 2024.

Cheers,
Michael`,
    timestamp: '2024-01-15T08:15:00Z',
    isRead: true,
    isStarred: false,
    sentiment: { label: 'positive', score: 0.91, confidence: 0.95 },
    escalationLevel: 'L2',
    extractedTasks: ['Plan 2024 partnership roadmap', 'Schedule celebration meeting'],
    priority: 'medium',
  },
  {
    id: '3',
    from: 'Alex Kim',
    fromEmail: 'alex.kim@internal.com',
    subject: 'Weekly Status Update',
    preview: 'Here is the weekly status update for Project Phoenix...',
    body: `Team,

Here is the weekly status update for Project Phoenix:

Completed:
- API development (100%)
- Database migration (100%)
- Initial UI components (85%)

In Progress:
- User authentication module
- Performance optimization
- Security audit preparation

Blockers: None currently

Next Week:
- Complete authentication
- Begin load testing

Regards,
Alex`,
    timestamp: '2024-01-14T16:45:00Z',
    isRead: true,
    isStarred: false,
    sentiment: { label: 'neutral', score: 0.55, confidence: 0.82 },
    escalationLevel: 'L1',
    extractedTasks: ['Complete authentication module', 'Begin load testing'],
    priority: 'low',
  },
  {
    id: '4',
    from: 'Emily Watson',
    fromEmail: 'e.watson@vendor.io',
    subject: 'CRITICAL: System Outage Report',
    preview: 'We experienced a critical system outage affecting production...',
    body: `URGENT

We experienced a critical system outage affecting production environments at 14:32 UTC.

Impact:
- 45 minutes of downtime
- Approximately 2,000 users affected
- Revenue impact estimated at $15,000

Root Cause: Database connection pool exhaustion

Immediate Actions Taken:
1. Failover to backup systems
2. Increased connection pool limits
3. Implemented additional monitoring

A full post-mortem will be scheduled for tomorrow.

Emily Watson
VP of Engineering`,
    timestamp: '2024-01-14T15:00:00Z',
    isRead: false,
    isStarred: true,
    sentiment: { label: 'negative', score: 0.85, confidence: 0.93 },
    escalationLevel: 'L4',
    extractedTasks: ['Attend post-mortem meeting', 'Review monitoring alerts', 'Update incident response plan'],
    priority: 'critical',
  },
];

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Design system documentation',
    description: 'Complete the design system documentation for the new brand guidelines',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Sarah Chen',
    dueDate: '2024-01-20',
    project: 'Brand Refresh',
    tags: ['design', 'documentation'],
  },
  {
    id: '2',
    title: 'API endpoint optimization',
    description: 'Optimize slow API endpoints identified in performance audit',
    status: 'todo',
    priority: 'critical',
    assignee: 'Michael Torres',
    dueDate: '2024-01-18',
    project: 'Platform v2.0',
    tags: ['backend', 'performance'],
  },
  {
    id: '3',
    title: 'User research interviews',
    description: 'Conduct 10 user interviews for the new feature discovery phase',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Emily Watson',
    dueDate: '2024-01-25',
    project: 'Discovery Phase',
    tags: ['research', 'user-feedback'],
  },
  {
    id: '4',
    title: 'Security audit preparation',
    description: 'Prepare documentation and access for annual security audit',
    status: 'review',
    priority: 'high',
    assignee: 'Alex Kim',
    dueDate: '2024-01-22',
    project: 'Compliance',
    tags: ['security', 'audit'],
  },
  {
    id: '5',
    title: 'Mobile app release',
    description: 'Submit v3.2.0 to app stores with new features',
    status: 'done',
    priority: 'high',
    assignee: 'Sarah Chen',
    dueDate: '2024-01-15',
    project: 'Mobile App',
    tags: ['mobile', 'release'],
  },
  {
    id: '6',
    title: 'Dashboard analytics integration',
    description: 'Integrate new analytics provider into the main dashboard',
    status: 'backlog',
    priority: 'low',
    assignee: 'Michael Torres',
    dueDate: '2024-02-01',
    project: 'Analytics',
    tags: ['frontend', 'analytics'],
  },
  {
    id: '7',
    title: 'Customer onboarding flow',
    description: 'Redesign the customer onboarding experience',
    status: 'todo',
    priority: 'medium',
    assignee: 'Emily Watson',
    dueDate: '2024-01-28',
    project: 'Growth',
    tags: ['ux', 'onboarding'],
  },
];

export const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Q4 Planning Session',
    date: '2024-01-15T10:00:00Z',
    duration: '2h',
    attendees: ['Sarah Chen', 'Michael Torres', 'Alex Kim', 'Emily Watson'],
    transcript: `Sarah: Good morning everyone. Let's kick off our Q4 planning session. 

Michael: Thanks Sarah. I'd like to start with the technical roadmap updates.

Alex: Before that, can we discuss the resource allocation? We're seeing some bottlenecks.

Emily: I agree with Alex. The design team is stretched thin on the brand refresh project.

Sarah: Valid points. Let's prioritize our initiatives first, then allocate resources accordingly.

Michael: I propose we focus on three key areas: platform stability, new feature development, and technical debt reduction.

Alex: Platform stability should be our top priority given the recent incidents.

Emily: From a user perspective, the new feature requests from enterprise clients are critical for retention.

Sarah: Let's allocate 40% to stability, 35% to new features, and 25% to tech debt. Thoughts?

Michael: That's a balanced approach. I can work with that.

Alex: Agreed. We should also set up weekly check-ins to monitor progress.

Sarah: Perfect. Let's document these decisions and share with the broader team.`,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Weekly Standup',
    date: '2024-01-16T09:00:00Z',
    duration: '30m',
    attendees: ['Sarah Chen', 'Alex Kim'],
    transcript: '',
    status: 'scheduled',
  },
];

export const projects: Project[] = [
  { id: '1', name: 'Platform v2.0', health: 'on-track', progress: 72, budget: 500000, spent: 340000, team: ['Alex Kim', 'Michael Torres'] },
  { id: '2', name: 'Brand Refresh', health: 'at-risk', progress: 45, budget: 150000, spent: 98000, team: ['Sarah Chen', 'Emily Watson'] },
  { id: '3', name: 'Mobile App', health: 'on-track', progress: 89, budget: 300000, spent: 267000, team: ['Alex Kim', 'Sarah Chen'] },
  { id: '4', name: 'Analytics Dashboard', health: 'critical', progress: 23, budget: 200000, spent: 180000, team: ['Michael Torres'] },
];

export const portfolioHealthData: ChartData[] = [
  { name: 'On Track', value: 12 },
  { name: 'At Risk', value: 8 },
  { name: 'Critical', value: 4 },
];

export const budgetData: ChartData[] = [
  { name: 'Jan', budget: 100000, actual: 95000 },
  { name: 'Feb', budget: 120000, actual: 118000 },
  { name: 'Mar', budget: 110000, actual: 125000 },
  { name: 'Apr', budget: 130000, actual: 122000 },
  { name: 'May', budget: 140000, actual: 138000 },
  { name: 'Jun', budget: 150000, actual: 145000 },
];

export const velocityData: ChartData[] = [
  { name: 'Week 1', value: 45 },
  { name: 'Week 2', value: 52 },
  { name: 'Week 3', value: 48 },
  { name: 'Week 4', value: 61 },
  { name: 'Week 5', value: 55 },
  { name: 'Week 6', value: 67 },
];
