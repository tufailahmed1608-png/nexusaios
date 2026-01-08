import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  RefreshCw, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Presentation,
  Link2,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Trash2,
  Play,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

// Integration type definitions
const INTEGRATION_TYPES = {
  jira: { name: 'Jira', icon: '🔷', category: 'project_management', color: 'bg-blue-500' },
  azure_devops: { name: 'Azure DevOps', icon: '🔶', category: 'project_management', color: 'bg-sky-500' },
  servicenow: { name: 'ServiceNow PPM', icon: '🟢', category: 'project_management', color: 'bg-green-500' },
  sharepoint: { name: 'SharePoint', icon: '📁', category: 'microsoft_365', color: 'bg-teal-500' },
  teams: { name: 'Microsoft Teams', icon: '💬', category: 'microsoft_365', color: 'bg-purple-500' },
  outlook: { name: 'Outlook', icon: '📧', category: 'microsoft_365', color: 'bg-blue-600' },
  planner: { name: 'Microsoft Planner', icon: '📋', category: 'microsoft_365', color: 'bg-green-600' },
  microsoft_project: { name: 'Microsoft Project', icon: '📊', category: 'project_management', color: 'bg-emerald-500' }
};

type IntegrationType = keyof typeof INTEGRATION_TYPES;

interface Integration {
  id: string;
  integration_type: string;
  name: string;
  config: Record<string, unknown>;
  is_active: boolean;
  sync_frequency: string;
  last_sync_at: string | null;
  created_at: string;
}

interface SyncLog {
  id: string;
  integration_id: string;
  status: string;
  records_synced: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

interface FileImport {
  id: string;
  file_name: string;
  file_type: string;
  status: string;
  records_imported: number;
  created_at: string;
}

export default function Integrations() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('connections');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newIntegrationType, setNewIntegrationType] = useState<IntegrationType | ''>('');
  const [configForm, setConfigForm] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch integrations
  const { data: integrations = [], isLoading: loadingIntegrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integration_configs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Integration[];
    }
  });

  // Fetch sync logs
  const { data: syncLogs = [] } = useQuery({
    queryKey: ['sync-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integration_sync_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as SyncLog[];
    }
  });

  // Fetch file imports
  const { data: fileImports = [] } = useQuery({
    queryKey: ['file-imports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_imports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as FileImport[];
    }
  });

  // Create integration mutation
  const createIntegration = useMutation({
    mutationFn: async (integration: { integration_type: string; name: string; config: Record<string, unknown> }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('integration_configs')
        .insert([{
          user_id: user.id,
          integration_type: integration.integration_type,
          name: integration.name,
          config: integration.config
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setShowAddDialog(false);
      setNewIntegrationType('');
      setConfigForm({});
      toast({ title: 'Integration added', description: 'Connection configured successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Sync integration mutation
  const syncIntegration = useMutation({
    mutationFn: async (integrationId: string) => {
      const integration = integrations.find(i => i.id === integrationId);
      if (!integration) throw new Error('Integration not found');

      const connectorMap: Record<string, string> = {
        jira: 'jira-connector',
        azure_devops: 'azuredevops-connector',
        servicenow: 'servicenow-connector',
        sharepoint: 'microsoft-graph-connector',
        teams: 'microsoft-graph-connector',
        outlook: 'microsoft-graph-connector',
        planner: 'microsoft-graph-connector'
      };

      const functionName = connectorMap[integration.integration_type];
      if (!functionName) throw new Error('Unsupported integration type');

      const body: Record<string, unknown> = {
        action: 'sync_all',
        integrationId
      };

      // Add service parameter for Microsoft Graph connector
      if (['sharepoint', 'teams', 'outlook', 'planner'].includes(integration.integration_type)) {
        body.service = integration.integration_type;
      }

      const { data, error } = await supabase.functions.invoke(functionName, { body });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['sync-logs'] });
      toast({ 
        title: 'Sync complete', 
        description: `Synced ${data?.data?.recordsSynced || 0} records` 
      });
    },
    onError: (error) => {
      toast({ title: 'Sync failed', description: error.message, variant: 'destructive' });
    }
  });

  // Delete integration mutation
  const deleteIntegration = useMutation({
    mutationFn: async (integrationId: string) => {
      const { error } = await supabase
        .from('integration_configs')
        .delete()
        .eq('id', integrationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({ title: 'Integration removed' });
    }
  });

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv', 'docx', 'pptx'].includes(fileType || '')) {
      toast({ title: 'Unsupported file', description: 'Please upload Excel, CSV, Word, or PowerPoint files', variant: 'destructive' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('file-imports')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('file-imports')
        .getPublicUrl(filePath);

      // Create file import record
      const { data: importRecord, error: insertError } = await supabase
        .from('file_imports')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_type: fileType,
          file_url: urlData.publicUrl,
          status: 'uploaded'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Trigger parsing
      const { data: parseResult, error: parseError } = await supabase.functions.invoke('parse-file', {
        body: {
          fileUrl: urlData.publicUrl,
          fileType,
          fileImportId: importRecord.id
        }
      });

      if (parseError) throw parseError;

      queryClient.invalidateQueries({ queryKey: ['file-imports'] });
      toast({ 
        title: 'File uploaded', 
        description: `Parsed ${parseResult?.data?.totalRows || 0} rows from ${file.name}` 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      toast({ title: 'Upload failed', description: errorMessage, variant: 'destructive' });
    }
  };

  const getConfigFields = (type: IntegrationType): { key: string; label: string; type: string; placeholder: string }[] => {
    switch (type) {
      case 'jira':
        return [
          { key: 'domain', label: 'Jira Domain', type: 'text', placeholder: 'your-company (without .atlassian.net)' },
          { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
          { key: 'apiToken', label: 'API Token', type: 'password', placeholder: 'Your Jira API token' }
        ];
      case 'azure_devops':
        return [
          { key: 'organization', label: 'Organization', type: 'text', placeholder: 'your-org' },
          { key: 'pat', label: 'Personal Access Token', type: 'password', placeholder: 'Your PAT' },
          { key: 'project', label: 'Project (optional)', type: 'text', placeholder: 'Specific project name' }
        ];
      case 'servicenow':
        return [
          { key: 'instance', label: 'Instance', type: 'text', placeholder: 'your-instance (without .service-now.com)' },
          { key: 'username', label: 'Username', type: 'text', placeholder: 'admin' },
          { key: 'password', label: 'Password', type: 'password', placeholder: 'Your password' }
        ];
      case 'sharepoint':
      case 'teams':
      case 'outlook':
      case 'planner':
        return [
          { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Microsoft Graph access token' },
          { key: 'siteId', label: 'SharePoint Site ID (optional)', type: 'text', placeholder: 'For SharePoint list sync' }
        ];
      case 'microsoft_project':
        return [
          { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'Power Automate webhook URL' }
        ];
      default:
        return [];
    }
  };

  const handleAddIntegration = () => {
    if (!newIntegrationType) return;

    const typeInfo = INTEGRATION_TYPES[newIntegrationType];
    createIntegration.mutate({
      integration_type: newIntegrationType,
      name: configForm.name || typeInfo.name,
      config: configForm
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Data Integrations</h1>
                <p className="text-muted-foreground mt-1">
                  Connect external data sources and import files
                </p>
              </div>
              <div className="flex gap-2">
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.docx,.pptx"
                  onChange={handleFileUpload}
                />
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Connection
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Integration</DialogTitle>
                      <DialogDescription>
                        Connect to an external data source
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Integration Type</Label>
                        <Select value={newIntegrationType} onValueChange={(v) => setNewIntegrationType(v as IntegrationType)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select integration type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jira">🔷 Jira</SelectItem>
                            <SelectItem value="azure_devops">🔶 Azure DevOps</SelectItem>
                            <SelectItem value="servicenow">🟢 ServiceNow PPM</SelectItem>
                            <SelectItem value="sharepoint">📁 SharePoint</SelectItem>
                            <SelectItem value="teams">💬 Microsoft Teams</SelectItem>
                            <SelectItem value="outlook">📧 Outlook</SelectItem>
                            <SelectItem value="planner">📋 Microsoft Planner</SelectItem>
                            <SelectItem value="microsoft_project">📊 Microsoft Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newIntegrationType && (
                        <>
                          <div>
                            <Label>Connection Name</Label>
                            <Input
                              placeholder={`My ${INTEGRATION_TYPES[newIntegrationType].name}`}
                              value={configForm.name || ''}
                              onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                            />
                          </div>

                          {getConfigFields(newIntegrationType).map((field) => (
                            <div key={field.key}>
                              <Label>{field.label}</Label>
                              <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                value={configForm[field.key] || ''}
                                onChange={(e) => setConfigForm({ ...configForm, [field.key]: e.target.value })}
                              />
                            </div>
                          ))}

                          <Button 
                            className="w-full" 
                            onClick={handleAddIntegration}
                            disabled={createIntegration.isPending}
                          >
                            {createIntegration.isPending ? 'Adding...' : 'Add Integration'}
                          </Button>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="connections">Connections</TabsTrigger>
                <TabsTrigger value="files">File Imports</TabsTrigger>
                <TabsTrigger value="history">Sync History</TabsTrigger>
              </TabsList>

              <TabsContent value="connections" className="mt-6">
                {loadingIntegrations ? (
                  <div className="text-center py-12 text-muted-foreground">Loading integrations...</div>
                ) : integrations.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-2">No integrations configured</h3>
                      <p className="text-muted-foreground mb-4">
                        Connect to Jira, Azure DevOps, ServiceNow, or Microsoft 365 to sync project data
                      </p>
                      <Button onClick={() => setShowAddDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Integration
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {integrations.map((integration) => {
                      const typeInfo = INTEGRATION_TYPES[integration.integration_type as IntegrationType];
                      return (
                        <Card key={integration.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg ${typeInfo?.color || 'bg-gray-500'} flex items-center justify-center text-white text-lg`}>
                                  {typeInfo?.icon || '📦'}
                                </div>
                                <div>
                                  <CardTitle className="text-base">{integration.name}</CardTitle>
                                  <CardDescription>{typeInfo?.name || integration.integration_type}</CardDescription>
                                </div>
                              </div>
                              <Badge variant={integration.is_active ? 'default' : 'secondary'}>
                                {integration.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-muted-foreground mb-4">
                              {integration.last_sync_at ? (
                                <>Last synced: {format(new Date(integration.last_sync_at), 'MMM d, h:mm a')}</>
                              ) : (
                                'Never synced'
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => syncIntegration.mutate(integration.id)}
                                disabled={syncIntegration.isPending}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Sync Now
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteIntegration.mutate(integration.id)}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="files" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>File Imports</CardTitle>
                    <CardDescription>
                      Upload Excel, CSV, Word, or PowerPoint files to import project data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <Card className="border-dashed">
                        <CardContent className="py-6 text-center">
                          <FileSpreadsheet className="h-8 w-8 mx-auto text-green-500 mb-2" />
                          <p className="font-medium">Excel / CSV</p>
                          <p className="text-xs text-muted-foreground">.xlsx, .xls, .csv</p>
                        </CardContent>
                      </Card>
                      <Card className="border-dashed">
                        <CardContent className="py-6 text-center">
                          <FileText className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                          <p className="font-medium">Word</p>
                          <p className="text-xs text-muted-foreground">.docx</p>
                        </CardContent>
                      </Card>
                      <Card className="border-dashed">
                        <CardContent className="py-6 text-center">
                          <Presentation className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                          <p className="font-medium">PowerPoint</p>
                          <p className="text-xs text-muted-foreground">.pptx</p>
                        </CardContent>
                      </Card>
                    </div>

                    {fileImports.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No files imported yet. Upload a file to get started.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {fileImports.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {file.file_type === 'xlsx' || file.file_type === 'csv' ? (
                                <FileSpreadsheet className="h-5 w-5 text-green-500" />
                              ) : file.file_type === 'docx' ? (
                                <FileText className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Presentation className="h-5 w-5 text-orange-500" />
                              )}
                              <div>
                                <p className="font-medium text-sm">{file.file_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(file.created_at), 'MMM d, yyyy h:mm a')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(file.status)}
                              <Badge variant="outline">{file.status}</Badge>
                              {file.records_imported > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {file.records_imported} records
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sync History</CardTitle>
                    <CardDescription>Recent synchronization activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {syncLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No sync history yet. Sync an integration to see results here.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {syncLogs.map((log) => {
                          const integration = integrations.find(i => i.id === log.integration_id);
                          return (
                            <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(log.status)}
                                <div>
                                  <p className="font-medium text-sm">
                                    {integration?.name || 'Unknown Integration'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(log.started_at), 'MMM d, yyyy h:mm a')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={log.status === 'success' ? 'default' : log.status === 'failed' ? 'destructive' : 'secondary'}>
                                  {log.status}
                                </Badge>
                                {log.records_synced > 0 && (
                                  <span className="text-sm">{log.records_synced} records</span>
                                )}
                                {log.error_message && (
                                  <span className="text-xs text-destructive max-w-[200px] truncate">
                                    {log.error_message}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
