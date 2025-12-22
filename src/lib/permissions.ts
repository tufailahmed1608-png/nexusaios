// Role hierarchy levels (higher = more access)
export const ROLE_HIERARCHY = {
  user: 1,
  project_manager: 2,
  senior_project_manager: 3,
  program_manager: 4,
  pmo: 5,
  admin: 10,
} as const;

export type AppRole = keyof typeof ROLE_HIERARCHY;

// Feature permissions mapping
export const FEATURE_PERMISSIONS: Record<string, AppRole[]> = {
  // Basic user - only dashboard and inbox
  dashboard: ['user', 'project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  inbox: ['user', 'project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Project management features - PM and above
  tasks: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  calendar: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  documents: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  projects: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  meetings: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  stakeholders: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  team: ['project_manager', 'senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Advanced features - Senior PM and above
  reports: ['senior_project_manager', 'program_manager', 'pmo', 'admin'],
  riskPrediction: ['senior_project_manager', 'program_manager', 'pmo', 'admin'],
  weeklyDigest: ['senior_project_manager', 'program_manager', 'pmo', 'admin'],
  
  // Strategic features - Program Manager and above
  strategy: ['program_manager', 'pmo', 'admin'],
  activity: ['program_manager', 'pmo', 'admin'],
  
  // PMO/Admin features
  knowledge: ['pmo', 'admin'],
  branding: ['pmo', 'admin'],
  adminDashboard: ['admin'],
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
    pmo: 'PMO',
    admin: 'Administrator',
  };
  return displayNames[role] || role;
}
