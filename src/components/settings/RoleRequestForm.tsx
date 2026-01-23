import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Shield, Clock, CheckCircle, XCircle, Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { getRoleDisplayName, AppRole } from '@/lib/permissions';

interface RoleRequest {
  id: string;
  requested_role: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

interface RoleRequestFormProps {
  userId: string;
  currentRole: AppRole | null;
}

const REQUESTABLE_ROLES: AppRole[] = [
  'project_manager',
  'senior_project_manager',
  'program_manager',
  'pmo'
];

const RoleRequestForm = ({ userId, currentRole }: RoleRequestFormProps) => {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('role_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Failed to fetch role requests:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRequests();
  }, [userId, fetchRequests]);

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    // Check if there's already a pending request for this role
    const existingPending = requests.find(
      r => r.status === 'pending' && r.requested_role === selectedRole
    );

    if (existingPending) {
      toast.error('You already have a pending request for this role');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('role_requests')
        .insert({
          user_id: userId,
          requested_role: selectedRole
        });

      if (error) throw error;

      toast.success('Role request submitted! An admin will review your request.');
      setSelectedRole('');
      fetchRequests();
    } catch (error) {
      console.error('Failed to submit role request:', error);
      toast.error('Failed to submit role request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const hasPendingRequest = requests.some(r => r.status === 'pending');

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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Request Role Assignment</CardTitle>
        </div>
        <CardDescription>
          {currentRole ? (
            <>Your current role is <Badge variant="secondary">{getRoleDisplayName(currentRole)}</Badge></>
          ) : (
            'Request a role to access more features'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Request Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role to Request</label>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                {REQUESTABLE_ROLES.map(role => (
                  <SelectItem 
                    key={role} 
                    value={role}
                    disabled={currentRole === role}
                  >
                    {getRoleDisplayName(role)}
                    {currentRole === role && ' (current)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={submitting || !selectedRole}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit Request
          </Button>
        </div>

        {/* Request History */}
        {requests.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Request History</h4>
            <div className="space-y-2">
              {requests.map(request => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {getRoleDisplayName(request.requested_role as AppRole)}
                      </span>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requested {format(new Date(request.created_at), 'MMM dd, yyyy')}
                      {request.reviewed_at && (
                        <> • Reviewed {format(new Date(request.reviewed_at), 'MMM dd, yyyy')}</>
                      )}
                    </p>
                    {request.admin_notes && (
                      <p className="text-xs text-muted-foreground italic mt-1">
                        Admin note: {request.admin_notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            You haven't made any role requests yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleRequestForm;
