import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTenantSettings } from '@/hooks/useTenantSettings';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  Mail,
  AlertTriangle,
  Brain,
  FlaskConical,
  Settings,
  Info,
  Loader2,
} from 'lucide-react';

const TenantSettings = () => {
  const { settings, updateSetting, isLoading } = useTenantSettings();
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleToggle = async (key: string, newValue: boolean) => {
    setUpdating(key);
    const success = await updateSetting(key, newValue);
    if (success) {
      toast({
        title: 'Setting Updated',
        description: `${key.replace(/_/g, ' ')} has been ${newValue ? 'enabled' : 'disabled'}.`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update setting. Please try again.',
        variant: 'destructive',
      });
    }
    setUpdating(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="nexus-fade-in">
        <h2 className="text-2xl font-bold text-foreground">Tenant Settings</h2>
        <p className="text-muted-foreground">Manage feature toggles, governance controls, and AI scope</p>
      </div>

      <Alert className="border-primary/30 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertDescription>
          These settings apply to all users in your organization. Changes take effect immediately.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList>
          <TabsTrigger value="features" className="gap-2">
            <Settings className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="governance" className="gap-2">
            <Shield className="w-4 h-4" />
            Governance
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Brain className="w-4 h-4" />
            AI Controls
          </TabsTrigger>
          <TabsTrigger value="pilot" className="gap-2">
            <FlaskConical className="w-4 h-4" />
            Pilot Mode
          </TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Smart Inbox / Communication Signals
              </CardTitle>
              <CardDescription>
                Control the communication intelligence feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smart_inbox_enabled">Enable Smart Inbox</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to view aggregated communication signals
                  </p>
                </div>
                <Switch
                  id="smart_inbox_enabled"
                  checked={settings.smartInboxEnabled}
                  onCheckedChange={(checked) => handleToggle('smart_inbox_enabled', checked)}
                  disabled={updating === 'smart_inbox_enabled'}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smart_inbox_aggregate_only">Aggregate Signals Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Show only aggregate sentiment trends, not individual scores
                  </p>
                </div>
                <Switch
                  id="smart_inbox_aggregate_only"
                  checked={settings.smartInboxAggregateOnly}
                  onCheckedChange={(checked) => handleToggle('smart_inbox_aggregate_only', checked)}
                  disabled={updating === 'smart_inbox_aggregate_only'}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data Usage Governance
              </CardTitle>
              <CardDescription>
                Control how data is used and protected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="smart_inbox_no_hr_usage">No HR/Performance Usage</Label>
                    <Badge variant="outline" className="text-xs">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prevent inbox data from being used for HR or performance evaluation
                  </p>
                </div>
                <Switch
                  id="smart_inbox_no_hr_usage"
                  checked={settings.smartInboxNoHrUsage}
                  onCheckedChange={(checked) => handleToggle('smart_inbox_no_hr_usage', checked)}
                  disabled={updating === 'smart_inbox_no_hr_usage'}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="risk_signals_no_people_analytics">No People Analytics</Label>
                    <Badge variant="outline" className="text-xs">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Disable predictive analytics on individual performance
                  </p>
                </div>
                <Switch
                  id="risk_signals_no_people_analytics"
                  checked={settings.riskSignalsNoPeopleAnalytics}
                  onCheckedChange={(checked) => handleToggle('risk_signals_no_people_analytics', checked)}
                  disabled={updating === 'risk_signals_no_people_analytics'}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Signal Controls
              </CardTitle>
              <CardDescription>
                Configure how risk signals are generated and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="risk_signals_evidence_based">Evidence-Based Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Show only risk indicators derived from meetings and delivery data
                  </p>
                </div>
                <Switch
                  id="risk_signals_evidence_based"
                  checked={settings.riskSignalsEvidenceBased}
                  onCheckedChange={(checked) => handleToggle('risk_signals_evidence_based', checked)}
                  disabled={updating === 'risk_signals_evidence_based'}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Controls Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Operating Principles
              </CardTitle>
              <CardDescription>
                Configure AI behavior and approval requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ai_human_approval_required">Human Approval Required</Label>
                    <Badge variant="outline" className="text-xs">Enforced</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require human approval for all AI-generated outputs before publishing
                  </p>
                </div>
                <Switch
                  id="ai_human_approval_required"
                  checked={settings.aiHumanApprovalRequired}
                  onCheckedChange={(checked) => handleToggle('ai_human_approval_required', checked)}
                  disabled={updating === 'ai_human_approval_required'}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>AI Operating Principles:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AI assists preparation and analysis</li>
                    <li>Humans approve, decide, and remain accountable</li>
                    <li>No autonomous decision-making</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pilot Mode Tab */}
        <TabsContent value="pilot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5" />
                Pilot Mode Configuration
              </CardTitle>
              <CardDescription>
                Enable pilot mode for evaluation with limited scope
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pilot_mode_enabled">Enable Pilot Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Activates watermarks, time-boxing, and limited project scope
                  </p>
                </div>
                <Switch
                  id="pilot_mode_enabled"
                  checked={settings.pilotModeEnabled}
                  onCheckedChange={(checked) => handleToggle('pilot_mode_enabled', checked)}
                  disabled={updating === 'pilot_mode_enabled'}
                />
              </div>

              {settings.pilotModeEnabled && (
                <Alert className="border-warning/30 bg-warning/5">
                  <FlaskConical className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-sm">
                    <strong>Pilot Mode Active:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>6-8 weeks duration</li>
                      <li>Limited projects and meetings</li>
                      <li>Read-only integrations</li>
                      <li>Draft-only reports unless approved</li>
                      <li>Pilot watermark across UI</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantSettings;
