import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield, UserCog, Loader2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { getRoleDisplayName, AppRole } from '@/lib/permissions';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

interface UserWithRole extends UserProfile {
  role: AppRole;
}

interface RoleAssignmentProps {
  currentUserId: string;
}

const AVAILABLE_ROLES: AppRole[] = [
  'user',
  'project_manager',
  'senior_project_manager',
  'program_manager',
  'pmo',
  'admin'
];

const RoleAssignment = ({ currentUserId }: RoleAssignmentProps) => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const roleMap = new Map<string, AppRole>();
      (roles || []).forEach((r: UserRole) => {
        roleMap.set(r.user_id, r.role as AppRole);
      });

      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
        ...profile,
        role: roleMap.get(profile.user_id) || 'user',
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    if (userId === currentUserId) {
      toast.error("You cannot modify your own role");
      return;
    }

    setUpdating(userId);

    try {
      // First, check if user has an existing role
      const { data: existingRole, error: fetchError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });

        if (error) throw error;
      }

      toast.success(`Role updated to ${getRoleDisplayName(newRole)}`);

      // Update local state
      setUsers(prev =>
        prev.map(u =>
          u.user_id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'pmo':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'program_manager':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'senior_project_manager':
        return 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20';
      case 'project_manager':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Role Assignment</CardTitle>
        </div>
        <CardDescription>Assign roles to team members to control feature access</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead className="text-right">Assign Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {user.display_name || 'Unnamed User'}
                        {user.user_id === currentUserId && (
                          <span className="text-muted-foreground ml-1">(you)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {user.user_id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(user.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeVariant(user.role)}>
                    {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {updating === user.user_id ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  ) : (
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.user_id, value as AppRole)}
                      disabled={user.user_id === currentUserId}
                    >
                      <SelectTrigger className="w-[180px] ml-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_ROLES.map(role => (
                          <SelectItem key={role} value={role}>
                            {getRoleDisplayName(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RoleAssignment;
