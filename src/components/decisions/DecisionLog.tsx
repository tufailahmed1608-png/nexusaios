import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Gavel,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Users,
  DollarSign,
  Target,
  History,
  ArrowRight,
  Loader2,
  Filter,
  Search,
} from 'lucide-react';

interface Decision {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  decision_type: string;
  status: string;
  priority: string;
  project_name: string | null;
  amount: string | null;
  rationale: string | null;
  impact: string | null;
  stakeholders: string[] | null;
  due_date: string | null;
  decided_at: string | null;
  decided_by: string | null;
  created_at: string;
  updated_at: string;
}

interface AuditLog {
  id: string;
  decision_id: string;
  user_id: string;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-950', icon: Clock },
  approved: { label: 'Approved', color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-950', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-950', icon: XCircle },
  deferred: { label: 'Deferred', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950', icon: Clock },
  in_review: { label: 'In Review', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950', icon: FileText },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'text-red-600 bg-red-100 dark:bg-red-950' },
  high: { label: 'High', color: 'text-amber-600 bg-amber-100 dark:bg-amber-950' },
  medium: { label: 'Medium', color: 'text-blue-600 bg-blue-100 dark:bg-blue-950' },
  low: { label: 'Low', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
};

const typeConfig: Record<string, { label: string; icon: React.ElementType }> = {
  strategic: { label: 'Strategic', icon: Target },
  budget: { label: 'Budget', icon: DollarSign },
  resource: { label: 'Resource', icon: Users },
  operational: { label: 'Operational', icon: FileText },
};

const DecisionLog = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [saving, setSaving] = useState(false);

  // Form state for new decision
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    decision_type: 'strategic',
    priority: 'medium',
    project_name: '',
    amount: '',
    rationale: '',
    impact: '',
    due_date: '',
  });

  useEffect(() => {
    fetchDecisions();
  }, [user]);

  const fetchDecisions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDecisions((data as Decision[]) || []);
    } catch (error) {
      console.error('Failed to fetch decisions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load decisions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async (decisionId: string) => {
    try {
      const { data, error } = await supabase
        .from('decision_audit_logs')
        .select('*')
        .eq('decision_id', decisionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuditLogs((data as AuditLog[]) || []);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    }
  };

  const handleCreateDecision = async () => {
    if (!user || !formData.title.trim()) return;
    
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('decisions')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          decision_type: formData.decision_type,
          priority: formData.priority,
          project_name: formData.project_name || null,
          amount: formData.amount || null,
          rationale: formData.rationale || null,
          impact: formData.impact || null,
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      // Log the creation
      await supabase.from('decision_audit_logs').insert({
        decision_id: data.id,
        user_id: user.id,
        action: 'created',
        new_status: 'pending',
        notes: 'Decision created',
      });

      toast({ title: 'Decision Created', description: 'New decision has been logged.' });
      setIsCreateOpen(false);
      setFormData({
        title: '',
        description: '',
        decision_type: 'strategic',
        priority: 'medium',
        project_name: '',
        amount: '',
        rationale: '',
        impact: '',
        due_date: '',
      });
      fetchDecisions();
    } catch (error) {
      console.error('Failed to create decision:', error);
      toast({ title: 'Error', description: 'Failed to create decision', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (decision: Decision, newStatus: string, notes?: string) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      if (newStatus === 'approved' || newStatus === 'rejected') {
        updateData.decided_at = new Date().toISOString();
        updateData.decided_by = user.id;
      }

      const { error } = await supabase
        .from('decisions')
        .update(updateData)
        .eq('id', decision.id);

      if (error) throw error;

      // Log the status change
      await supabase.from('decision_audit_logs').insert({
        decision_id: decision.id,
        user_id: user.id,
        action: 'status_changed',
        previous_status: decision.status,
        new_status: newStatus,
        notes: notes || `Status changed to ${newStatus}`,
      });

      toast({ title: 'Status Updated', description: `Decision marked as ${newStatus}` });
      fetchDecisions();
      if (selectedDecision?.id === decision.id) {
        fetchAuditLogs(decision.id);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const openDetails = (decision: Decision) => {
    setSelectedDecision(decision);
    fetchAuditLogs(decision.id);
    setIsDetailsOpen(true);
  };

  const filteredDecisions = decisions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.project_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'pending' && d.status === 'pending') ||
      (activeTab === 'decided' && ['approved', 'rejected'].includes(d.status));
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={cn('gap-1', config.color, config.bgColor)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Gavel className="h-6 w-6 text-primary" />
            Decision Log
          </h2>
          <p className="text-muted-foreground">Track and record executive decisions with full audit trail</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Decision
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Log New Decision</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Decision title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.decision_type} onValueChange={(v) => setFormData({ ...formData, decision_type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeConfig).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Input
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    placeholder="Related project"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g., $500K"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Decision details..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Rationale</Label>
                <Textarea
                  value={formData.rationale}
                  onChange={(e) => setFormData({ ...formData, rationale: e.target.value })}
                  placeholder="Why this decision..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateDecision} disabled={saving || !formData.title.trim()}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Decision
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search decisions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({decisions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({decisions.filter(d => d.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="decided">Decided ({decisions.filter(d => ['approved', 'rejected'].includes(d.status)).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredDecisions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No Decisions Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try adjusting your search' : 'Create your first decision to get started'}
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Decision
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDecisions.map((decision) => {
                const typeInfo = typeConfig[decision.decision_type] || typeConfig.strategic;
                const TypeIcon = typeInfo.icon;
                const priorityInfo = priorityConfig[decision.priority] || priorityConfig.medium;

                return (
                  <Card 
                    key={decision.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openDetails(decision)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <TypeIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-medium text-foreground truncate">{decision.title}</h4>
                              <Badge variant="secondary" className={cn('text-xs', priorityInfo.color)}>
                                {priorityInfo.label}
                              </Badge>
                            </div>
                            {decision.project_name && (
                              <p className="text-sm text-muted-foreground mb-1">{decision.project_name}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(decision.created_at), 'MMM d, yyyy')}
                              </span>
                              {decision.amount && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {decision.amount}
                                </span>
                              )}
                              {decision.due_date && (
                                <span className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Due {format(new Date(decision.due_date), 'MMM d')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(decision.status)}
                          {decision.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-emerald-600 hover:bg-emerald-50"
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(decision, 'approved'); }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50"
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(decision, 'rejected'); }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Decision Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Decision Details
            </DialogTitle>
          </DialogHeader>
          {selectedDecision && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 pb-4">
                {/* Header Info */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedDecision.title}</h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {getStatusBadge(selectedDecision.status)}
                    <Badge variant="secondary">{typeConfig[selectedDecision.decision_type]?.label || 'Strategic'}</Badge>
                    <Badge variant="outline" className={priorityConfig[selectedDecision.priority]?.color}>
                      {priorityConfig[selectedDecision.priority]?.label || 'Medium'}
                    </Badge>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedDecision.project_name && (
                    <div>
                      <p className="text-muted-foreground">Project</p>
                      <p className="font-medium">{selectedDecision.project_name}</p>
                    </div>
                  )}
                  {selectedDecision.amount && (
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium">{selectedDecision.amount}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{format(new Date(selectedDecision.created_at), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                  {selectedDecision.due_date && (
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium">{format(new Date(selectedDecision.due_date), 'MMM d, yyyy')}</p>
                    </div>
                  )}
                  {selectedDecision.decided_at && (
                    <div>
                      <p className="text-muted-foreground">Decided</p>
                      <p className="font-medium">{format(new Date(selectedDecision.decided_at), 'MMM d, yyyy h:mm a')}</p>
                    </div>
                  )}
                </div>

                {selectedDecision.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{selectedDecision.description}</p>
                  </div>
                )}

                {selectedDecision.rationale && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rationale</p>
                    <p className="text-sm">{selectedDecision.rationale}</p>
                  </div>
                )}

                {selectedDecision.impact && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Impact</p>
                    <p className="text-sm">{selectedDecision.impact}</p>
                  </div>
                )}

                {/* Audit Trail */}
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <History className="h-4 w-4" />
                    Audit Trail
                  </h4>
                  {auditLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No audit logs available</p>
                  ) : (
                    <div className="space-y-2">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium capitalize">{log.action.replace('_', ' ')}</span>
                              {log.previous_status && log.new_status && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  {getStatusBadge(log.previous_status)}
                                  <ArrowRight className="h-3 w-3" />
                                  {getStatusBadge(log.new_status)}
                                </span>
                              )}
                            </div>
                            {log.notes && <p className="text-xs text-muted-foreground mt-1">{log.notes}</p>}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(log.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedDecision.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => { handleUpdateStatus(selectedDecision, 'approved'); setIsDetailsOpen(false); }}
                      disabled={saving}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 text-red-600 hover:bg-red-50"
                      onClick={() => { handleUpdateStatus(selectedDecision, 'rejected'); setIsDetailsOpen(false); }}
                      disabled={saving}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => { handleUpdateStatus(selectedDecision, 'deferred'); setIsDetailsOpen(false); }}
                      disabled={saving}
                    >
                      <Clock className="h-4 w-4" />
                      Defer
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DecisionLog;
