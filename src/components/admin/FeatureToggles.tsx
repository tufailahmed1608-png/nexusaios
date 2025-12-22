import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ToggleLeft, Loader2, Save, RotateCcw, Shield } from 'lucide-react';
import { AppRole, FEATURE_PERMISSIONS, getRoleDisplayName, ROLE_HIERARCHY } from '@/lib/permissions';

interface FeaturePermission {
  [feature: string]: boolean;
}

interface RolePermissions {
  [role: string]: FeaturePermission;
}

// All available features
const ALL_FEATURES = Object.keys(FEATURE_PERMISSIONS);

// All roles except 'user' (basic) - admin manages these
const MANAGEABLE_ROLES: AppRole[] = [
  'user',
  'project_manager',
  'senior_project_manager',
  'program_manager',
  'executive',
  'pmo',
];

const FeatureToggles = () => {
  const [permissions, setPermissions] = useState<RolePermissions>({});
  const [originalPermissions, setOriginalPermissions] = useState<RolePermissions>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    // Check if there are unsaved changes
    const changed = JSON.stringify(permissions) !== JSON.stringify(originalPermissions);
    setHasChanges(changed);
  }, [permissions, originalPermissions]);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('role_definitions')
        .select('role, permissions');

      if (error) throw error;

      // Build permissions map from database or use defaults
      const permMap: RolePermissions = {};
      
      // Initialize with default permissions for all roles
      MANAGEABLE_ROLES.forEach(role => {
        permMap[role] = {};
        ALL_FEATURES.forEach(feature => {
          // Default: use the hardcoded FEATURE_PERMISSIONS
          permMap[role][feature] = FEATURE_PERMISSIONS[feature]?.includes(role) || false;
        });
      });

      // Override with database values if they exist
      (data || []).forEach((roleDef: any) => {
        const role = roleDef.role as AppRole;
        if (MANAGEABLE_ROLES.includes(role) && roleDef.permissions) {
          // Permissions is stored as an array of enabled features
          const enabledFeatures = Array.isArray(roleDef.permissions) 
            ? roleDef.permissions 
            : [];
          
          // If we have stored permissions, use them (otherwise keep defaults)
          if (enabledFeatures.length > 0 || roleDef.permissions !== null) {
            ALL_FEATURES.forEach(feature => {
              permMap[role][feature] = enabledFeatures.includes(feature);
            });
          }
        }
      });

      setPermissions(permMap);
      setOriginalPermissions(JSON.parse(JSON.stringify(permMap)));
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      toast.error('Failed to load feature permissions');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (role: AppRole, feature: string) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [feature]: !prev[role][feature],
      },
    }));
  };

  const toggleAllFeaturesForRole = (role: AppRole, enabled: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [role]: ALL_FEATURES.reduce((acc, feature) => {
        acc[feature] = enabled;
        return acc;
      }, {} as FeaturePermission),
    }));
  };

  const resetToDefaults = () => {
    const defaultPermissions: RolePermissions = {};
    MANAGEABLE_ROLES.forEach(role => {
      defaultPermissions[role] = {};
      ALL_FEATURES.forEach(feature => {
        defaultPermissions[role][feature] = FEATURE_PERMISSIONS[feature]?.includes(role) || false;
      });
    });
    setPermissions(defaultPermissions);
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      // For each role, upsert the permissions
      for (const role of MANAGEABLE_ROLES) {
        const enabledFeatures = ALL_FEATURES.filter(f => permissions[role][f]);
        
        // Check if role definition exists
        const { data: existing } = await supabase
          .from('role_definitions')
          .select('id')
          .eq('role', role)
          .maybeSingle();

        if (existing) {
          // Update existing
          const { error } = await supabase
            .from('role_definitions')
            .update({ 
              permissions: enabledFeatures,
              updated_at: new Date().toISOString()
            })
            .eq('role', role);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('role_definitions')
            .insert({
              role,
              display_name: getRoleDisplayName(role),
              description: `${getRoleDisplayName(role)} role with configured permissions`,
              hierarchy_level: ROLE_HIERARCHY[role],
              permissions: enabledFeatures,
            });

          if (error) throw error;
        }
      }

      setOriginalPermissions(JSON.parse(JSON.stringify(permissions)));
      toast.success('Feature permissions saved successfully');
    } catch (error) {
      console.error('Failed to save permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    setPermissions(JSON.parse(JSON.stringify(originalPermissions)));
  };

  const getFeatureDisplayName = (feature: string) => {
    const names: Record<string, string> = {
      dashboard: 'Dashboard',
      meetings: 'Meeting Hub',
      tasks: 'Task Board',
      inbox: 'Smart Inbox',
      calendar: 'Calendar',
      documents: 'Documents',
      projects: 'Projects',
      team: 'Team',
      reports: 'Reports',
      riskPrediction: 'Risk Prediction',
      weeklyDigest: 'Weekly Digest',
      strategy: 'Strategy View',
      stakeholders: 'Stakeholders',
      activity: 'Activity/Audit',
      decisions: 'Decision Log',
      knowledge: 'Knowledge Base',
      branding: 'Branding',
      feedback: 'Feedback Widget',
      adminDashboard: 'Admin Dashboard',
    };
    return names[feature] || feature;
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'pmo':
        return 'bg-purple-500/10 text-purple-500';
      case 'executive':
        return 'bg-amber-500/10 text-amber-500';
      case 'program_manager':
        return 'bg-blue-500/10 text-blue-500';
      case 'senior_project_manager':
        return 'bg-cyan-500/10 text-cyan-500';
      case 'project_manager':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEnabledCount = (role: AppRole) => {
    if (!permissions[role]) return 0;
    return Object.values(permissions[role]).filter(Boolean).length;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ToggleLeft className="h-5 w-5 text-primary" />
              <CardTitle>Feature Toggles</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={discardChanges}
                    disabled={saving}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={savePermissions}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefaults}
                disabled={saving}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </Button>
            </div>
          </div>
          <CardDescription>
            Enable or disable features for each role. Admin role always has full access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground sticky left-0 bg-card min-w-[160px]">
                    Feature
                  </th>
                  {MANAGEABLE_ROLES.map(role => (
                    <th key={role} className="text-center py-3 px-2 min-w-[120px]">
                      <div className="flex flex-col items-center gap-1">
                        <Badge className={getRoleBadgeVariant(role)}>
                          {getRoleDisplayName(role)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {getEnabledCount(role)}/{ALL_FEATURES.length}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-3 px-2 min-w-[100px]">
                    <div className="flex flex-col items-center gap-1">
                      <Badge className="bg-red-500/10 text-red-500">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                      <span className="text-xs text-muted-foreground">Full Access</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((feature, index) => (
                  <tr 
                    key={feature} 
                    className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? 'bg-muted/10' : ''
                    }`}
                  >
                    <td className="py-3 px-2 font-medium sticky left-0 bg-inherit">
                      {getFeatureDisplayName(feature)}
                    </td>
                    {MANAGEABLE_ROLES.map(role => (
                      <td key={role} className="text-center py-3 px-2">
                        <Switch
                          checked={permissions[role]?.[feature] || false}
                          onCheckedChange={() => toggleFeature(role, feature)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </td>
                    ))}
                    <td className="text-center py-3 px-2">
                      <Switch checked disabled className="data-[state=checked]:bg-red-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="py-3 px-2 font-medium text-muted-foreground sticky left-0 bg-card">
                    Enable/Disable All
                  </td>
                  {MANAGEABLE_ROLES.map(role => (
                    <td key={role} className="text-center py-3 px-2">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => toggleAllFeaturesForRole(role, true)}
                        >
                          All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => toggleAllFeaturesForRole(role, false)}
                        >
                          None
                        </Button>
                      </div>
                    </td>
                  ))}
                  <td className="text-center py-3 px-2 text-xs text-muted-foreground">
                    Always On
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-lg border-primary/20">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <span className="text-sm font-medium">You have unsaved changes</span>
              <Button size="sm" variant="outline" onClick={discardChanges}>
                Discard
              </Button>
              <Button size="sm" onClick={savePermissions} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FeatureToggles;
