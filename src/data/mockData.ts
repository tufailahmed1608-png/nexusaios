// Real project data from PM_MASTER.xlsx

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
  avatar?: string;
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

export interface Milestone {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  allocation: number; // percentage
}

export interface Project {
  id: string;
  name: string;
  description: string;
  health: 'on-track' | 'at-risk' | 'critical';
  progress: number;
  budget: number;
  spent: number;
  team: TeamMember[];
  milestones: Milestone[];
  startDate: string;
  endDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
}

export interface ChartData {
  name: string;
  value?: number;
  budget?: number;
  actual?: number;
}

// KPIs calculated from real PM_MASTER.xlsx data
export const kpis: KPI[] = [
  { id: '1', title: 'Active Projects', value: '5', change: 2, trend: 'up', icon: 'folder' },
  { id: '2', title: 'Tasks Completed', value: '8', change: 3, trend: 'up', icon: 'check-circle' },
  { id: '3', title: 'Team Velocity', value: '42', change: 8, trend: 'up', icon: 'zap' },
  { id: '4', title: 'Budget Utilization', value: '68%', change: 5, trend: 'up', icon: 'dollar-sign' },
];

// Emails with realistic project context from PM_MASTER.xlsx team
export const emails: Email[] = [
  {
    id: '1',
    from: 'Anya Sharma',
    fromEmail: 'anya.sharma@company.com',
    avatar: '/src/assets/inbox/sarah-chen-email.png',
    subject: 'ERP Integration - Phase 2 Status Update',
    preview: 'The Requirements Gathering phase is now 100% complete. Development phase started with vendor selection finalized...',
    body: `Hi Team,

The Requirements Gathering phase for ERP System Integration is now 100% complete. I'm pleased to share that we've finalized the vendor selection with SAP.

Key Updates:
1. Vendor Selection (TASK-001) - Completed
2. Requirements Documentation (TASK-002) - Completed  
3. System Architecture Design (TASK-003) - In Progress with Ravi

Development phase has officially started. Suresh is working on the Data Migration Plan.

Next Steps:
- Complete architecture design by Feb 1
- Begin integration development
- Schedule weekly progress reviews

Best regards,
Anya Sharma
Project Manager`,
    timestamp: '2025-01-20T10:30:00Z',
    isRead: false,
    isStarred: true,
    sentiment: { label: 'positive', score: 0.85, confidence: 0.92 },
    escalationLevel: 'L2',
    extractedTasks: [
      'Complete System Architecture Design',
      'Finalize Data Migration Plan',
      'Schedule weekly progress reviews',
    ],
    priority: 'high',
  },
  {
    id: '2',
    from: 'Ravi Mehta',
    fromEmail: 'ravi.mehta@company.com',
    avatar: '/src/assets/inbox/michael-torres.png',
    subject: 'CRM Upgrade - Technical Architecture Review Needed',
    preview: 'Need to discuss the API integration approach for the CRM upgrade. The current architecture may need revision...',
    body: `Team,

Need urgent input on the CRM System Upgrade API integration design.

Current Status:
- API Integration Design (TASK-006) is in progress
- Found potential compatibility issues with third-party APIs (RISK-003)

Concerns:
1. Third-party API response time is inconsistent
2. Data format mismatch requires additional transformation layer
3. Rate limiting may impact bulk operations

Proposed Solutions:
- Implement adapter pattern for API abstraction
- Add caching layer for frequently accessed data
- Build retry mechanism with exponential backoff

Can we schedule a technical review session this week?

Regards,
Ravi Mehta
Technical Lead`,
    timestamp: '2025-01-20T09:15:00Z',
    isRead: false,
    isStarred: false,
    sentiment: { label: 'neutral', score: 0.55, confidence: 0.88 },
    escalationLevel: 'L3',
    extractedTasks: [
      'Schedule API integration review session',
      'Implement adapter pattern design',
      'Review third-party API documentation',
    ],
    priority: 'high',
  },
  {
    id: '3',
    from: 'Priya Nair',
    fromEmail: 'priya.nair@company.com',
    avatar: '/src/assets/inbox/emily-watson.png',
    subject: 'Mobile App Pilot - User Story Mapping Complete',
    preview: 'User story mapping session completed. All requirements documented and ready for development sprint planning...',
    body: `Hi All,

Great news! The User Story Mapping (TASK-011) for Mobile App Pilot is now complete.

Deliverables:
- 45 user stories documented and prioritized
- UI/UX Design (TASK-009) - Completed
- Acceptance criteria defined for all features

Sprint Ready Stories:
1. User Authentication
2. Dashboard View
3. Notification System
4. Offline Data Sync

The team is ready to proceed with Backend API Development (TASK-010). Suresh has already started.

Action Items:
- Review story prioritization with stakeholders
- Finalize sprint backlog
- Prepare beta testing plan

Best,
Priya Nair
Business Analyst`,
    timestamp: '2025-01-19T14:00:00Z',
    isRead: true,
    isStarred: false,
    sentiment: { label: 'positive', score: 0.88, confidence: 0.91 },
    escalationLevel: 'L1',
    extractedTasks: [
      'Review story prioritization',
      'Finalize sprint backlog',
      'Prepare beta testing plan',
    ],
    priority: 'medium',
  },
  {
    id: '4',
    from: 'Suresh Kumar',
    fromEmail: 'suresh.kumar@company.com',
    avatar: '/src/assets/inbox/alex-kim.png',
    subject: 'URGENT: Cloud Migration - AWS Setup Blocked',
    preview: 'Facing issues with AWS configuration. Need admin access to proceed with the infrastructure setup...',
    body: `URGENT

AWS Environment Setup (TASK-014) is currently blocked.

Issue:
- Missing IAM permissions for VPC configuration
- Cannot create required security groups
- Need elevated access to AWS Organization

Impact:
- RISK-008: Service downtime risk increasing
- Cloud Migration Phase 1 timeline at risk
- Dependent tasks cannot proceed

Required Actions:
1. Request AWS admin console access
2. Review security configuration with Ravi
3. Update Disaster Recovery Plan timeline

This is blocking critical path activities. Please escalate.

Suresh Kumar
Senior Developer`,
    timestamp: '2025-01-19T11:30:00Z',
    isRead: false,
    isStarred: true,
    sentiment: { label: 'negative', score: 0.78, confidence: 0.93 },
    escalationLevel: 'L4',
    extractedTasks: [
      'Request AWS admin access',
      'Review security configuration',
      'Update DR Plan timeline',
      'Escalate to IT Operations',
    ],
    priority: 'critical',
  },
  {
    id: '5',
    from: 'Divya Iyer',
    fromEmail: 'divya.iyer@company.com',
    subject: 'BI Dashboard - Testing Strategy Ready for Review',
    preview: 'Attached the testing strategy for the BI Dashboard project. Please review and provide feedback by EOD...',
    body: `Team,

The Testing Strategy document for BI Dashboard Implementation is ready for review.

Coverage Areas:
1. Data Integration Testing - 15 test cases
2. Dashboard Functionality - 28 test cases
3. Performance Testing - 10 scenarios
4. User Acceptance Testing (TASK-020) - 20 test cases

Key Focus:
- Data accuracy validation (RISK-009)
- Report generation performance
- Cross-browser compatibility
- Mobile responsiveness

Timeline:
- Test case review: This week
- Test execution starts: Feb 5
- UAT completion: Feb 10

Please review and provide feedback by EOD tomorrow.

Thanks,
Divya Iyer
QA Lead`,
    timestamp: '2025-01-18T16:45:00Z',
    isRead: true,
    isStarred: false,
    sentiment: { label: 'neutral', score: 0.60, confidence: 0.85 },
    escalationLevel: 'L1',
    extractedTasks: [
      'Review testing strategy document',
      'Provide feedback on test coverage',
      'Confirm UAT schedule',
    ],
    priority: 'medium',
  },
];

// Tasks from PM_MASTER.xlsx
export const tasks: Task[] = [
  // ERP Integration Tasks
  {
    id: 'TASK-001',
    title: 'Vendor Selection',
    description: 'Evaluate and select ERP vendor from shortlisted candidates (SAP, Oracle, Microsoft Dynamics)',
    status: 'done',
    priority: 'high',
    assignee: 'Anya Sharma',
    dueDate: '2025-01-15',
    project: 'ERP System Integration',
    tags: ['procurement', 'vendor'],
  },
  {
    id: 'TASK-002',
    title: 'Requirements Documentation',
    description: 'Document all functional and non-functional requirements for ERP implementation',
    status: 'done',
    priority: 'high',
    assignee: 'Priya Nair',
    dueDate: '2025-01-20',
    project: 'ERP System Integration',
    tags: ['requirements', 'documentation'],
  },
  {
    id: 'TASK-003',
    title: 'System Architecture Design',
    description: 'Design the technical architecture for ERP integration with existing systems',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Ravi Mehta',
    dueDate: '2025-02-01',
    project: 'ERP System Integration',
    tags: ['architecture', 'technical'],
  },
  {
    id: 'TASK-004',
    title: 'Data Migration Plan',
    description: 'Create comprehensive data migration strategy and scripts',
    status: 'todo',
    priority: 'medium',
    assignee: 'Suresh Kumar',
    dueDate: '2025-02-10',
    project: 'ERP System Integration',
    tags: ['data', 'migration'],
  },
  // CRM Upgrade Tasks
  {
    id: 'TASK-005',
    title: 'Current System Audit',
    description: 'Audit existing CRM system for upgrade readiness assessment',
    status: 'done',
    priority: 'high',
    assignee: 'Priya Nair',
    dueDate: '2025-01-10',
    project: 'CRM System Upgrade',
    tags: ['audit', 'assessment'],
  },
  {
    id: 'TASK-006',
    title: 'API Integration Design',
    description: 'Design API integration layer for CRM with third-party systems',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Ravi Mehta',
    dueDate: '2025-01-25',
    project: 'CRM System Upgrade',
    tags: ['api', 'integration'],
  },
  {
    id: 'TASK-007',
    title: 'User Training Material',
    description: 'Prepare training documentation and videos for CRM users',
    status: 'todo',
    priority: 'medium',
    assignee: 'Anya Sharma',
    dueDate: '2025-02-15',
    project: 'CRM System Upgrade',
    tags: ['training', 'documentation'],
  },
  {
    id: 'TASK-008',
    title: 'Performance Testing',
    description: 'Execute performance and load testing for upgraded CRM',
    status: 'todo',
    priority: 'high',
    assignee: 'Divya Iyer',
    dueDate: '2025-02-20',
    project: 'CRM System Upgrade',
    tags: ['testing', 'performance'],
  },
  // Mobile App Pilot Tasks
  {
    id: 'TASK-009',
    title: 'UI/UX Design',
    description: 'Complete UI/UX design for mobile app including wireframes and prototypes',
    status: 'done',
    priority: 'high',
    assignee: 'Priya Nair',
    dueDate: '2025-01-12',
    project: 'Mobile App Pilot',
    tags: ['design', 'ux'],
  },
  {
    id: 'TASK-010',
    title: 'Backend API Development',
    description: 'Develop RESTful APIs for mobile app backend services',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Suresh Kumar',
    dueDate: '2025-01-30',
    project: 'Mobile App Pilot',
    tags: ['backend', 'api'],
  },
  {
    id: 'TASK-011',
    title: 'User Story Mapping',
    description: 'Map user stories and prioritize features for mobile app',
    status: 'done',
    priority: 'medium',
    assignee: 'Priya Nair',
    dueDate: '2025-01-08',
    project: 'Mobile App Pilot',
    tags: ['agile', 'planning'],
  },
  {
    id: 'TASK-012',
    title: 'App Store Submission',
    description: 'Prepare and submit app to iOS App Store and Google Play',
    status: 'todo',
    priority: 'low',
    assignee: 'Anya Sharma',
    dueDate: '2025-03-01',
    project: 'Mobile App Pilot',
    tags: ['release', 'mobile'],
  },
  // Cloud Migration Tasks
  {
    id: 'TASK-013',
    title: 'Infrastructure Assessment',
    description: 'Assess current infrastructure and identify cloud migration candidates',
    status: 'done',
    priority: 'high',
    assignee: 'Ravi Mehta',
    dueDate: '2025-01-05',
    project: 'Cloud Infrastructure Migration',
    tags: ['infrastructure', 'assessment'],
  },
  {
    id: 'TASK-014',
    title: 'AWS Environment Setup',
    description: 'Set up AWS environment including VPC, subnets, and security groups',
    status: 'review',
    priority: 'high',
    assignee: 'Suresh Kumar',
    dueDate: '2025-01-18',
    project: 'Cloud Infrastructure Migration',
    tags: ['aws', 'infrastructure'],
  },
  {
    id: 'TASK-015',
    title: 'Security Configuration',
    description: 'Configure security policies, IAM roles, and encryption settings',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Ravi Mehta',
    dueDate: '2025-01-28',
    project: 'Cloud Infrastructure Migration',
    tags: ['security', 'aws'],
  },
  {
    id: 'TASK-016',
    title: 'Disaster Recovery Plan',
    description: 'Create disaster recovery and business continuity plan for cloud',
    status: 'todo',
    priority: 'medium',
    assignee: 'Anya Sharma',
    dueDate: '2025-02-05',
    project: 'Cloud Infrastructure Migration',
    tags: ['dr', 'planning'],
  },
  // BI Dashboard Tasks
  {
    id: 'TASK-017',
    title: 'Data Source Integration',
    description: 'Integrate data sources from various systems into BI platform',
    status: 'done',
    priority: 'high',
    assignee: 'Suresh Kumar',
    dueDate: '2025-01-14',
    project: 'BI Dashboard Implementation',
    tags: ['data', 'integration'],
  },
  {
    id: 'TASK-018',
    title: 'Dashboard Design',
    description: 'Design executive dashboard with KPIs and visualizations',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Priya Nair',
    dueDate: '2025-01-22',
    project: 'BI Dashboard Implementation',
    tags: ['design', 'dashboard'],
  },
  {
    id: 'TASK-019',
    title: 'Report Template Creation',
    description: 'Create standard report templates for business reporting',
    status: 'todo',
    priority: 'medium',
    assignee: 'Priya Nair',
    dueDate: '2025-02-01',
    project: 'BI Dashboard Implementation',
    tags: ['reports', 'templates'],
  },
  {
    id: 'TASK-020',
    title: 'User Acceptance Testing',
    description: 'Execute UAT with business stakeholders for BI dashboard',
    status: 'todo',
    priority: 'high',
    assignee: 'Divya Iyer',
    dueDate: '2025-02-10',
    project: 'BI Dashboard Implementation',
    tags: ['testing', 'uat'],
  },
];

// Meetings from PM_MASTER.xlsx MOM sheet
export const meetings: Meeting[] = [
  {
    id: 'MOM-001',
    title: 'ERP System Integration - Kickoff Meeting',
    date: '2025-01-03T10:00:00Z',
    duration: '90 min',
    attendees: ['Anya Sharma', 'Ravi Mehta', 'Priya Nair', 'Suresh Kumar'],
    transcript: `Anya Sharma: Good morning everyone. Welcome to the ERP System Integration project kickoff. Let's begin with introductions and then review the project scope.

Ravi Mehta: Thanks Anya. I'll be handling the technical architecture. I've prepared an overview of the integration approach with our existing systems.

Priya Nair: I've completed the initial requirements gathering with stakeholders. We have 45 functional requirements and 12 non-functional requirements documented.

Suresh Kumar: From the development side, I've assessed the data migration complexity. We're looking at approximately 2.5 million records across 15 tables.

Anya Sharma: Great. Let's discuss the vendor evaluation. We shortlisted SAP, Oracle, and Microsoft Dynamics. Based on our criteria, SAP scored highest.

Ravi Mehta: SAP's integration capabilities align well with our architecture. The API documentation is comprehensive and they offer good support.

Priya Nair: Stakeholders prefer SAP based on user experience feedback from the demo.

DECISIONS MADE:
1. Selected SAP as primary ERP vendor
2. Approved phased implementation approach - Phase 1 covers Finance and HR
3. Established weekly status meetings every Tuesday at 10 AM
4. Budget approved at ₹45,00,000

ACTION ITEMS:
- Anya to complete vendor contract review by Jan 10
- Ravi to finalize technical architecture document by Jan 15
- Priya to set up project communication channels
- Suresh to prepare data migration scripts prototype`,
    status: 'completed',
  },
  {
    id: 'MOM-002',
    title: 'CRM Upgrade - Sprint Review',
    date: '2025-01-10T14:00:00Z',
    duration: '60 min',
    attendees: ['Anya Sharma', 'Ravi Mehta', 'Priya Nair', 'Divya Iyer'],
    transcript: `Anya Sharma: Let's review Sprint 1 deliverables for the CRM Upgrade project.

Ravi Mehta: I completed the current system audit. Found several legacy APIs that need refactoring. The API Integration Design is 60% complete.

Priya Nair: User stories for Phase 1 are all documented. Current system audit revealed 3 integration points that weren't in scope initially.

Divya Iyer: Test cases for the completed features are ready. Identified 2 critical bugs in the data sync module that need priority fixes.

Anya Sharma: What's the impact on timeline?

Ravi Mehta: The additional integration points may add 1 week to development. I recommend we address them in Phase 1 to avoid technical debt.

Priya Nair: Stakeholders are anxious about the training timeline. We need to start user training material preparation soon.

DECISIONS MADE:
1. API integration module approved - proceed with implementation
2. Bug fixes prioritized for Sprint 2
3. Extended testing phase by one week due to additional scope
4. Added 3 new integration points to Phase 1 scope

ACTION ITEMS:
- Ravi to fix critical bugs by end of week
- Divya to update test cases for new integration points
- Anya to prepare user training documentation draft
- Priya to communicate timeline update to stakeholders`,
    status: 'completed',
  },
  {
    id: 'MOM-003',
    title: 'Mobile App Pilot - Feature Demo',
    date: '2025-01-15T11:00:00Z',
    duration: '45 min',
    attendees: ['Anya Sharma', 'Priya Nair', 'Suresh Kumar', 'Divya Iyer'],
    transcript: `Suresh Kumar: Welcome to the Mobile App Pilot feature demo. I'll walk through the completed modules.

[Demo begins - User Authentication Module]

Suresh Kumar: The authentication supports biometric login, SSO integration, and offline pin access. Performance testing shows 2.3 second average load time.

Priya Nair: The UI looks great! Can we add a "Remember Me" option?

Suresh Kumar: Yes, we can add that. It's a minor change.

[Demo continues - Dashboard Module]

Divya Iyer: I tested the offline sync feature. Found an edge case where concurrent edits cause data conflicts.

Suresh Kumar: That's RISK-005 in our risk register. I've designed a conflict resolution dialog that shows both versions.

Anya Sharma: Good. Let's prioritize that fix for the beta release.

Priya Nair: User story mapping is complete. Beta testing plan is in progress.

DECISIONS MADE:
1. UI color scheme approved - proceed with current design
2. Performance benchmarks met - 2.3 second load time acceptable
3. Proceed with beta testing phase
4. Conflict resolution feature approved for implementation

ACTION ITEMS:
- Suresh to implement "Remember Me" feature
- Suresh to implement conflict resolution dialog
- Divya to prepare beta testing plan
- Priya to create user onboarding guide`,
    status: 'completed',
  },
  {
    id: 'MOM-004',
    title: 'Cloud Migration - Architecture Planning',
    date: '2025-01-08T09:00:00Z',
    duration: '120 min',
    attendees: ['Ravi Mehta', 'Suresh Kumar', 'Anya Sharma'],
    transcript: `Ravi Mehta: Today we'll finalize the cloud architecture for the infrastructure migration. I've prepared comparison analysis of AWS, Azure, and GCP.

[Presents cloud provider comparison]

Ravi Mehta: Based on our requirements - high availability, disaster recovery, and cost optimization - AWS scores highest. Azure is close second.

Suresh Kumar: I agree with AWS. Our team has more experience with AWS services. This reduces learning curve risk.

Anya Sharma: What's the cost difference?

Ravi Mehta: AWS Reserved Instances give us 40% savings compared to on-demand. Annual cost estimate is ₹80,00,000 including all services.

Suresh Kumar: I've completed the infrastructure assessment. We have 45 servers, 12 databases, and 8 applications to migrate.

Ravi Mehta: I recommend lift-and-shift for Phase 1 to minimize risk, then optimize in Phase 2.

Anya Sharma: Timeline for Phase 1?

Ravi Mehta: 4 months for migration, 1 month for stabilization. Total 5 months to production.

DECISIONS MADE:
1. AWS selected as cloud provider
2. Lift-and-shift approach for Phase 1
3. Reserved Instances for cost optimization
4. ₹80,00,000 budget approved for cloud services

ACTION ITEMS:
- Suresh to complete AWS account setup by Jan 15
- Ravi to create detailed migration runbook
- Anya to schedule downtime window with stakeholders
- Ravi to design disaster recovery architecture`,
    status: 'completed',
  },
  {
    id: 'MOM-005',
    title: 'BI Dashboard - Requirements Workshop',
    date: '2025-01-12T15:00:00Z',
    duration: '90 min',
    attendees: ['Priya Nair', 'Anya Sharma', 'Suresh Kumar', 'Divya Iyer'],
    transcript: `Priya Nair: Welcome to the BI Dashboard requirements workshop. Our goal is to finalize the KPIs and dashboard design.

[Requirements gathering session]

Priya Nair: Based on executive interviews, we've identified 15 key KPIs across 4 categories: Financial, Operational, Customer, and People.

Anya Sharma: Which KPIs are highest priority for Phase 1?

Priya Nair: Revenue, Budget Utilization, Project Health, and Team Velocity are the top 4. Executives want these on the main dashboard.

Suresh Kumar: For data sources, we need to integrate: ERP for financials, Project Management tool for metrics, and HR system for people data.

Priya Nair: The data integration is technically feasible. I've validated all data points are available.

Divya Iyer: For testing, we need to ensure data accuracy. Inconsistent data from multiple sources is a key risk.

Priya Nair: That's RISK-009. We're implementing data validation rules and establishing data governance process.

Anya Sharma: What visualization tool are we using?

Suresh Kumar: Power BI. It integrates well with our data sources and executives are familiar with it.

DECISIONS MADE:
1. 15 KPIs finalized for Phase 1
2. Power BI selected as visualization tool
3. Weekly automated reports approved
4. Data governance process to be established

ACTION ITEMS:
- Priya to create detailed KPI specifications
- Suresh to set up Power BI development environment
- Priya to design data warehouse schema
- Divya to create data validation test cases`,
    status: 'completed',
  },
  {
    id: 'MOM-006',
    title: 'Weekly Portfolio Review',
    date: '2025-01-22T09:00:00Z',
    duration: '60 min',
    attendees: ['Anya Sharma', 'Ravi Mehta', 'Priya Nair', 'Suresh Kumar', 'Divya Iyer'],
    transcript: '',
    status: 'scheduled',
  },
];

// Projects from PM_MASTER.xlsx with phases as milestones
export const projects: Project[] = [
  {
    id: 'PRJ-100',
    name: 'ERP System Integration',
    description: 'Enterprise Resource Planning system integration with SAP to streamline business operations across Finance, HR, and Supply Chain.',
    health: 'on-track',
    progress: 45,
    budget: 4500000,
    spent: 1800000,
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    priority: 'critical',
    category: 'Digital Transformation',
    team: [
      { id: 't1', name: 'Anya Sharma', role: 'Project Manager', avatar: 'AS', allocation: 80 },
      { id: 't2', name: 'Ravi Mehta', role: 'Technical Lead', avatar: 'RM', allocation: 60 },
      { id: 't3', name: 'Priya Nair', role: 'Business Analyst', avatar: 'PN', allocation: 40 },
      { id: 't4', name: 'Suresh Kumar', role: 'Senior Developer', avatar: 'SK', allocation: 50 },
    ],
    milestones: [
      { id: 'm1', name: 'Planning', startDate: '2025-01-01', endDate: '2025-01-15', progress: 100, status: 'completed' },
      { id: 'm2', name: 'Requirements Gathering', startDate: '2025-01-16', endDate: '2025-02-01', progress: 100, status: 'completed' },
      { id: 'm3', name: 'Development', startDate: '2025-02-02', endDate: '2025-04-01', progress: 35, status: 'in-progress' },
      { id: 'm4', name: 'Testing/QA', startDate: '2025-04-02', endDate: '2025-05-15', progress: 0, status: 'upcoming' },
      { id: 'm5', name: 'Go-Live', startDate: '2025-05-16', endDate: '2025-06-30', progress: 0, status: 'upcoming' },
    ],
  },
  {
    id: 'PRJ-101',
    name: 'CRM System Upgrade',
    description: 'Upgrade existing CRM system with enhanced API integrations, improved user experience, and third-party system connectivity.',
    health: 'at-risk',
    progress: 35,
    budget: 2000000,
    spent: 950000,
    startDate: '2025-01-01',
    endDate: '2025-04-30',
    priority: 'high',
    category: 'Customer Experience',
    team: [
      { id: 't1', name: 'Anya Sharma', role: 'Project Manager', avatar: 'AS', allocation: 50 },
      { id: 't2', name: 'Ravi Mehta', role: 'Technical Lead', avatar: 'RM', allocation: 70 },
      { id: 't3', name: 'Priya Nair', role: 'Business Analyst', avatar: 'PN', allocation: 60 },
      { id: 't5', name: 'Divya Iyer', role: 'QA Lead', avatar: 'DI', allocation: 40 },
    ],
    milestones: [
      { id: 'm6', name: 'Planning', startDate: '2025-01-01', endDate: '2025-01-10', progress: 100, status: 'completed' },
      { id: 'm7', name: 'Requirements Gathering', startDate: '2025-01-11', endDate: '2025-01-25', progress: 100, status: 'completed' },
      { id: 'm8', name: 'Development', startDate: '2025-01-26', endDate: '2025-03-01', progress: 40, status: 'delayed' },
      { id: 'm9', name: 'Testing/QA', startDate: '2025-03-02', endDate: '2025-04-01', progress: 0, status: 'upcoming' },
      { id: 'm10', name: 'Deployment', startDate: '2025-04-02', endDate: '2025-04-30', progress: 0, status: 'upcoming' },
    ],
  },
  {
    id: 'PRJ-102',
    name: 'Mobile App Pilot',
    description: 'Pilot mobile application for field operations with offline capabilities, biometric authentication, and real-time sync.',
    health: 'on-track',
    progress: 55,
    budget: 1500000,
    spent: 720000,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    priority: 'high',
    category: 'Digital Transformation',
    team: [
      { id: 't1', name: 'Anya Sharma', role: 'Project Manager', avatar: 'AS', allocation: 40 },
      { id: 't3', name: 'Priya Nair', role: 'Business Analyst', avatar: 'PN', allocation: 50 },
      { id: 't4', name: 'Suresh Kumar', role: 'Senior Developer', avatar: 'SK', allocation: 80 },
      { id: 't5', name: 'Divya Iyer', role: 'QA Lead', avatar: 'DI', allocation: 50 },
    ],
    milestones: [
      { id: 'm11', name: 'Planning', startDate: '2025-01-01', endDate: '2025-01-05', progress: 100, status: 'completed' },
      { id: 'm12', name: 'UI/UX Design', startDate: '2025-01-06', endDate: '2025-01-15', progress: 100, status: 'completed' },
      { id: 'm13', name: 'Development', startDate: '2025-01-16', endDate: '2025-02-15', progress: 70, status: 'in-progress' },
      { id: 'm14', name: 'Testing', startDate: '2025-02-16', endDate: '2025-03-10', progress: 0, status: 'upcoming' },
      { id: 'm15', name: 'Beta Launch', startDate: '2025-03-11', endDate: '2025-03-31', progress: 0, status: 'upcoming' },
    ],
  },
  {
    id: 'PRJ-103',
    name: 'Cloud Infrastructure Migration',
    description: 'Migration of on-premise infrastructure to AWS cloud with enhanced security, scalability, and disaster recovery capabilities.',
    health: 'at-risk',
    progress: 30,
    budget: 8000000,
    spent: 2500000,
    startDate: '2025-01-01',
    endDate: '2025-09-30',
    priority: 'critical',
    category: 'Infrastructure',
    team: [
      { id: 't2', name: 'Ravi Mehta', role: 'Technical Lead', avatar: 'RM', allocation: 90 },
      { id: 't4', name: 'Suresh Kumar', role: 'Senior Developer', avatar: 'SK', allocation: 70 },
      { id: 't1', name: 'Anya Sharma', role: 'Project Manager', avatar: 'AS', allocation: 30 },
    ],
    milestones: [
      { id: 'm16', name: 'Assessment', startDate: '2025-01-01', endDate: '2025-01-15', progress: 100, status: 'completed' },
      { id: 'm17', name: 'Architecture Design', startDate: '2025-01-16', endDate: '2025-02-15', progress: 60, status: 'in-progress' },
      { id: 'm18', name: 'Migration Phase 1', startDate: '2025-02-16', endDate: '2025-05-01', progress: 0, status: 'upcoming' },
      { id: 'm19', name: 'Migration Phase 2', startDate: '2025-05-02', endDate: '2025-07-15', progress: 0, status: 'upcoming' },
      { id: 'm20', name: 'Go-Live', startDate: '2025-07-16', endDate: '2025-09-30', progress: 0, status: 'upcoming' },
    ],
  },
  {
    id: 'PRJ-104',
    name: 'BI Dashboard Implementation',
    description: 'Business Intelligence dashboard using Power BI for executive decision making with real-time KPIs and automated reporting.',
    health: 'on-track',
    progress: 40,
    budget: 1200000,
    spent: 480000,
    startDate: '2025-01-01',
    endDate: '2025-03-15',
    priority: 'medium',
    category: 'Data & Analytics',
    team: [
      { id: 't3', name: 'Priya Nair', role: 'Business Analyst', avatar: 'PN', allocation: 70 },
      { id: 't4', name: 'Suresh Kumar', role: 'Senior Developer', avatar: 'SK', allocation: 50 },
      { id: 't5', name: 'Divya Iyer', role: 'QA Lead', avatar: 'DI', allocation: 30 },
      { id: 't1', name: 'Anya Sharma', role: 'Project Manager', avatar: 'AS', allocation: 20 },
    ],
    milestones: [
      { id: 'm21', name: 'Requirements', startDate: '2025-01-01', endDate: '2025-01-12', progress: 100, status: 'completed' },
      { id: 'm22', name: 'Data Integration', startDate: '2025-01-13', endDate: '2025-01-25', progress: 100, status: 'completed' },
      { id: 'm23', name: 'Dashboard Development', startDate: '2025-01-26', endDate: '2025-02-15', progress: 45, status: 'in-progress' },
      { id: 'm24', name: 'Testing', startDate: '2025-02-16', endDate: '2025-03-01', progress: 0, status: 'upcoming' },
      { id: 'm25', name: 'Launch', startDate: '2025-03-02', endDate: '2025-03-15', progress: 0, status: 'upcoming' },
    ],
  },
];

// Portfolio health data calculated from projects
export const portfolioHealthData: ChartData[] = [
  { name: 'On Track', value: 3 },
  { name: 'At Risk', value: 2 },
  { name: 'Critical', value: 0 },
];

// Budget data from PM_MASTER.xlsx projects
export const budgetData: ChartData[] = [
  { name: 'Jan', budget: 2500000, actual: 2100000 },
  { name: 'Feb', budget: 3000000, actual: 2800000 },
  { name: 'Mar', budget: 3500000, actual: 3200000 },
  { name: 'Apr', budget: 4000000, actual: 3600000 },
  { name: 'May', budget: 3500000, actual: 3300000 },
  { name: 'Jun', budget: 3000000, actual: 2850000 },
];

// Velocity data based on task completion
export const velocityData: ChartData[] = [
  { name: 'Sprint 1', value: 32 },
  { name: 'Sprint 2', value: 38 },
  { name: 'Sprint 3', value: 42 },
  { name: 'Sprint 4', value: 35 },
  { name: 'Sprint 5', value: 40 },
  { name: 'Sprint 6', value: 42 },
];

// Strategy View Data
export interface StrategicPillar {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  status: 'on-track' | 'at-risk' | 'critical';
  initiatives: number;
  completedInitiatives: number;
}

export interface ROIData {
  name: string;
  investment: number;
  returns: number;
  roi: number;
}

export interface BudgetForecast {
  month: string;
  planned: number;
  actual: number | null;
  forecast: number;
}

// Strategic pillars aligned with PM_MASTER.xlsx projects
export const strategicPillars: StrategicPillar[] = [
  {
    id: '1',
    name: 'Digital Transformation',
    description: 'Modernize systems with ERP Integration and Mobile App initiatives',
    progress: 50,
    target: 75,
    status: 'on-track',
    initiatives: 2,
    completedInitiatives: 0,
  },
  {
    id: '2',
    name: 'Customer Experience',
    description: 'Enhance customer touchpoints through CRM System Upgrade',
    progress: 35,
    target: 80,
    status: 'at-risk',
    initiatives: 1,
    completedInitiatives: 0,
  },
  {
    id: '3',
    name: 'Cloud & Infrastructure',
    description: 'Migrate to cloud for scalability and disaster recovery',
    progress: 30,
    target: 60,
    status: 'at-risk',
    initiatives: 1,
    completedInitiatives: 0,
  },
  {
    id: '4',
    name: 'Data-Driven Decisions',
    description: 'Enable executive insights with BI Dashboard implementation',
    progress: 40,
    target: 70,
    status: 'on-track',
    initiatives: 1,
    completedInitiatives: 0,
  },
];

// ROI data calculated from PM_MASTER.xlsx project investments
export const roiData: ROIData[] = [
  { name: 'ERP Integration', investment: 4500000, returns: 6750000, roi: 50 },
  { name: 'CRM Upgrade', investment: 2000000, returns: 3200000, roi: 60 },
  { name: 'Mobile App', investment: 1500000, returns: 2100000, roi: 40 },
  { name: 'Cloud Migration', investment: 8000000, returns: 11200000, roi: 40 },
  { name: 'BI Dashboard', investment: 1200000, returns: 2040000, roi: 70 },
];

// Budget forecast data based on PM_MASTER.xlsx
export const budgetForecastData: BudgetForecast[] = [
  { month: 'Jan', planned: 2500000, actual: 2100000, forecast: 2100000 },
  { month: 'Feb', planned: 3000000, actual: 2800000, forecast: 2800000 },
  { month: 'Mar', planned: 3500000, actual: null, forecast: 3200000 },
  { month: 'Apr', planned: 4000000, actual: null, forecast: 3800000 },
  { month: 'May', planned: 3500000, actual: null, forecast: 3400000 },
  { month: 'Jun', planned: 3000000, actual: null, forecast: 2900000 },
  { month: 'Jul', planned: 2500000, actual: null, forecast: 2400000 },
  { month: 'Aug', planned: 2000000, actual: null, forecast: 1950000 },
  { month: 'Sep', planned: 1500000, actual: null, forecast: 1450000 },
];

// Quarterly performance data
export const quarterlyPerformance = [
  { quarter: 'Q1 2024', revenue: 12500000, cost: 9500000, profit: 3000000 },
  { quarter: 'Q2 2024', revenue: 14200000, cost: 10800000, profit: 3400000 },
  { quarter: 'Q3 2024', revenue: 15800000, cost: 12000000, profit: 3800000 },
  { quarter: 'Q4 2024', revenue: 17200000, cost: 13100000, profit: 4100000 },
  { quarter: 'Q1 2025', revenue: 16500000, cost: 12400000, profit: 4100000 },
];

// Risk data from PM_MASTER.xlsx for RiskPredictionView
export interface RiskData {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  description: string;
  likelihood: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  riskScore: number;
  mitigation: string;
  owner: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

export const risks: RiskData[] = [
  {
    id: 'RISK-001',
    projectId: 'PRJ-100',
    projectName: 'ERP System Integration',
    category: 'Technical',
    description: 'Data migration complexity may cause delays due to legacy data format inconsistencies',
    likelihood: 'High',
    impact: 'High',
    riskScore: 90,
    mitigation: 'Conduct thorough data profiling and create detailed migration scripts with rollback procedures',
    owner: 'Ravi Mehta',
    status: 'Open',
  },
  {
    id: 'RISK-002',
    projectId: 'PRJ-100',
    projectName: 'ERP System Integration',
    category: 'Resource',
    description: 'Key resource availability during critical development phases',
    likelihood: 'Medium',
    impact: 'High',
    riskScore: 72,
    mitigation: 'Cross-train team members and maintain backup resource pool',
    owner: 'Anya Sharma',
    status: 'Open',
  },
  {
    id: 'RISK-003',
    projectId: 'PRJ-101',
    projectName: 'CRM System Upgrade',
    category: 'Integration',
    description: 'Third-party API compatibility issues with existing systems',
    likelihood: 'Medium',
    impact: 'Medium',
    riskScore: 56,
    mitigation: 'Early API testing and vendor coordination for compatibility assurance',
    owner: 'Ravi Mehta',
    status: 'Open',
  },
  {
    id: 'RISK-004',
    projectId: 'PRJ-101',
    projectName: 'CRM System Upgrade',
    category: 'Change Management',
    description: 'User adoption resistance to new CRM interface and workflows',
    likelihood: 'Medium',
    impact: 'Medium',
    riskScore: 56,
    mitigation: 'Comprehensive training program and change champions network',
    owner: 'Priya Nair',
    status: 'Open',
  },
  {
    id: 'RISK-005',
    projectId: 'PRJ-102',
    projectName: 'Mobile App Pilot',
    category: 'Technical',
    description: 'Offline sync conflicts when multiple users edit same records',
    likelihood: 'High',
    impact: 'Medium',
    riskScore: 72,
    mitigation: 'Implement conflict resolution logic with user notification and manual merge capability',
    owner: 'Suresh Kumar',
    status: 'Open',
  },
  {
    id: 'RISK-006',
    projectId: 'PRJ-102',
    projectName: 'Mobile App Pilot',
    category: 'Schedule',
    description: 'App store approval delays impacting launch timeline',
    likelihood: 'Low',
    impact: 'Medium',
    riskScore: 36,
    mitigation: 'Submit for review early and maintain compliance documentation ready',
    owner: 'Anya Sharma',
    status: 'Open',
  },
  {
    id: 'RISK-007',
    projectId: 'PRJ-103',
    projectName: 'Cloud Infrastructure Migration',
    category: 'Security',
    description: 'Data security vulnerabilities during migration process',
    likelihood: 'Medium',
    impact: 'High',
    riskScore: 72,
    mitigation: 'Encrypt all data in transit and at rest, conduct security audits before each phase',
    owner: 'Ravi Mehta',
    status: 'Open',
  },
  {
    id: 'RISK-008',
    projectId: 'PRJ-103',
    projectName: 'Cloud Infrastructure Migration',
    category: 'Operational',
    description: 'Service downtime during production migration affecting business operations',
    likelihood: 'High',
    impact: 'High',
    riskScore: 90,
    mitigation: 'Phased migration approach with rollback capability and off-hours execution',
    owner: 'Suresh Kumar',
    status: 'Open',
  },
  {
    id: 'RISK-009',
    projectId: 'PRJ-104',
    projectName: 'BI Dashboard Implementation',
    category: 'Data Quality',
    description: 'Inconsistent data from multiple source systems affecting report accuracy',
    likelihood: 'High',
    impact: 'Medium',
    riskScore: 72,
    mitigation: 'Implement data validation rules and establish data governance process',
    owner: 'Priya Nair',
    status: 'Open',
  },
  {
    id: 'RISK-010',
    projectId: 'PRJ-104',
    projectName: 'BI Dashboard Implementation',
    category: 'Performance',
    description: 'Dashboard performance degradation with large datasets',
    likelihood: 'Medium',
    impact: 'Low',
    riskScore: 28,
    mitigation: 'Implement data aggregation, caching strategies, and query optimization',
    owner: 'Suresh Kumar',
    status: 'Open',
  },
];

// Team member details for TeamView
export interface TeamMemberDetailed {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  department: string;
  skills: string[];
  projects: string[];
  utilization: number;
  availability: 'Available' | 'Busy' | 'Overloaded';
}

export const teamMembersDetailed: TeamMemberDetailed[] = [
  {
    id: '1',
    name: 'Anya Sharma',
    role: 'Project Manager',
    email: 'anya.sharma@company.com',
    avatar: 'AS',
    department: 'PMO',
    skills: ['Project Management', 'Stakeholder Management', 'Agile', 'Risk Management', 'PMP Certified'],
    projects: ['PRJ-100', 'PRJ-101', 'PRJ-102', 'PRJ-103', 'PRJ-104'],
    utilization: 75,
    availability: 'Available',
  },
  {
    id: '2',
    name: 'Ravi Mehta',
    role: 'Technical Lead',
    email: 'ravi.mehta@company.com',
    avatar: 'RM',
    department: 'Engineering',
    skills: ['System Architecture', 'Cloud Computing', 'API Design', 'Security', 'AWS Certified'],
    projects: ['PRJ-100', 'PRJ-101', 'PRJ-103'],
    utilization: 90,
    availability: 'Busy',
  },
  {
    id: '3',
    name: 'Priya Nair',
    role: 'Business Analyst',
    email: 'priya.nair@company.com',
    avatar: 'PN',
    department: 'Business Analysis',
    skills: ['Requirements Analysis', 'Process Mapping', 'User Stories', 'Data Analysis', 'CBAP Certified'],
    projects: ['PRJ-100', 'PRJ-101', 'PRJ-102', 'PRJ-104'],
    utilization: 85,
    availability: 'Available',
  },
  {
    id: '4',
    name: 'Suresh Kumar',
    role: 'Senior Developer',
    email: 'suresh.kumar@company.com',
    avatar: 'SK',
    department: 'Engineering',
    skills: ['Full Stack Development', 'Database Design', 'Mobile Development', 'DevOps', 'React Native'],
    projects: ['PRJ-100', 'PRJ-102', 'PRJ-103', 'PRJ-104'],
    utilization: 95,
    availability: 'Overloaded',
  },
  {
    id: '5',
    name: 'Divya Iyer',
    role: 'QA Lead',
    email: 'divya.iyer@company.com',
    avatar: 'DI',
    department: 'Quality Assurance',
    skills: ['Test Strategy', 'Automation Testing', 'Performance Testing', 'UAT', 'ISTQB Certified'],
    projects: ['PRJ-101', 'PRJ-102', 'PRJ-104'],
    utilization: 70,
    availability: 'Available',
  },
];
