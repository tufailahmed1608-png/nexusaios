// Role hierarchy levels (higher = more access)
export const ROLE_HIERARCHY = {
  user: 1,
  project_manager: 2,
  senior_project_manager: 3,
  program_manager: 4,
  executive: 5,
  pmo: 6,
  tenant_admin: 8,
  admin: 10,
} as const;

export type AppRole = keyof typeof ROLE_HIERARCHY;

// Feature permissions mapping with primary (⭐) and secondary (◽) value per role
// Primary = core value proposition, Secondary = oversight/limited access
export const FEATURE_PERMISSIONS: Record<string, AppRole[]> = {
  // ========== USER (Pilot/Evaluator) ==========
  // ⭐ Primary: Meeting Hub, Dashboard (pilot-scoped), Feedback Widget
  // ◽ Secondary: Reports (draft only)
  // 🚫 Hidden: Admin/AI Controls
  
  // ========== PROJECT MANAGER ==========
  // ⭐ Primary: Task Board, Smart Inbox, Calendar, Meeting Hub
  // ◽ Secondary: Dashboard, Documents, Reports (view), Notifications
  // 🚫 Hidden: Stakeholder Map, Admin/AI, Branding
  
  // ========== SENIOR PROJECT MANAGER = PROJECT MANAGER ==========
  
  // ========== PROGRAM MANAGER ==========
  // ⭐ Primary: Dashboard, Reports, Risk Prediction, Stakeholder Map
  // ◽ Secondary: Meeting Hub, Tasks (oversight), Inbox
  // 🚫 Hidden: Admin/AI, Branding
  
  // ========== EXECUTIVE (Trust Consumer) ==========
  // ⭐ Primary: Executive Dashboard, Approved Reports, Decision Log, Strategy View
  // 🚫 Hidden: Meeting Hub, Tasks/Inbox (Zero operational detail)
  
  // ========== PMO ==========
  // ⭐ Primary: Executive Dashboard, Reports, Meeting Hub, Strategy, Stakeholder Mgmt, Audit
  // ◽ Secondary: Task Board (oversight)
  // 🚫 Hidden: Smart Inbox
  
  // ========== ADMIN ==========
  // Full access to all features
  
  // Dashboard - Primary for: User (pilot-scoped), Program Manager, Executive, PMO | Secondary for: PM
  dashboard: ['user', 'project_manager', 'senior_project_manager', 'program_manager', 'executive', 'pmo', 'admin'],
  
  // Meeting Hub - Primary for: User, PM, PMO | Secondary for: Program Manager | Hidden for: Executive
  meetings: ['user', 'project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Task Board - Primary for: PM | Secondary for: PMO (oversight) | Hidden for: Executive
  tasks: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Smart Inbox - Primary for: PM | Secondary for: Program Manager | Hidden for: PMO, User, Executive
  inbox: ['project_manager', 'senior_project_manager', 'program_manager', 'admin'],
  
  // Calendar - Primary for: PM | Hidden for: Executive
  calendar: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Documents - Secondary for: PM | Hidden for: Executive
  documents: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Projects - Hidden for: Executive
  projects: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Team - Hidden for: Executive
  team: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Reports - Primary for: Program Manager, Executive (approved only), PMO | Secondary for: PM (view), User (draft only)
  reports: ['user', 'project_manager', 'senior_project_manager', 'program_manager', 'executive', 'pmo', 'admin'],
  
  // Risk Prediction - Primary for: Program Manager | Hidden for: Executive
  riskPrediction: ['program_manager', 'pmo', 'admin'],
  
  // Weekly Digest - Hidden for: Executive
  weeklyDigest: ['program_manager', 'pmo', 'admin'],
  
  // Strategy View - Primary for: Executive, PMO
  strategy: ['executive', 'pmo', 'admin'],
  
  // Stakeholder Management - Primary for: Program Manager, PMO | Hidden for: PM, Executive
  stakeholders: ['program_manager', 'pmo', 'admin'],
  
  // Activity/Audit - Primary for: Executive, PMO
  activity: ['executive', 'pmo', 'admin'],
  
  // Decision Log - Primary for: Executive, PMO (Accountability)
  decisions: ['executive', 'pmo', 'admin'],
  
  // Knowledge Base - PMO and Admin only
  knowledge: ['pmo', 'admin'],
  
  // Branding - PMO and Admin only | Hidden for: PM, Program Manager, Executive
  branding: ['pmo', 'admin'],
  
  // Feedback Widget - Primary for: User
  feedback: ['user', 'project_manager', 'senior_project_manager', 'program_manager', 'executive', 'pmo', 'tenant_admin', 'admin'],

  // AI Controls - PMO and Admin for governance, Executive for transparency
  aiControls: ['executive', 'pmo', 'tenant_admin', 'admin'],

  // Tenant Settings - Tenant Admin and Admin only
  tenantSettings: ['tenant_admin', 'admin'],
  
  // Admin Dashboard - Admin only | Hidden for: User, PM, Program Manager, Executive
  adminDashboard: ['tenant_admin', 'admin'],
};

// Check if a role has access to a feature
export function hasFeatureAccess(userRole: AppRole | null, feature: string): boolean {
  if (!userRole) return false;
  const allowedRoles = FEATURE_PERMISSIONS[feature];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

// Check if a role has minimum level access
export function hasMinimumRole(userRole: AppRole | null, minimumRole: AppRole): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

// Get role display name
export function getRoleDisplayName(role: AppRole): string {
  const displayNames: Record<AppRole, string> = {
    user: 'User',
    project_manager: 'Project Manager',
    senior_project_manager: 'Senior Project Manager',
    program_manager: 'Program Manager',
    executive: 'Executive',
    pmo: 'PMO',
    tenant_admin: 'Tenant Administrator',
    admin: 'Administrator',
  };
  return displayNames[role] || role;
}
