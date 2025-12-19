import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { ArrowLeft, Users, Activity, TrendingUp, Clock, Shield, BarChart3, UserCog, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import UserManagement from '@/components/admin/UserManagement';

interface ActivityData {
  action_type: string;
  action_details: Record<string, unknown>;
  page_path: string;
  created_at: string;
  user_id: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/app');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('user_activities' as any)
          .select('*')
          .gte('created_at', subDays(new Date(), 30).toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;
        setActivities((data as unknown as ActivityData[]) || []);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Set up realtime subscription
    const channel = supabase
      .channel('admin-activity-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activities',
        },
        (payload) => {
          console.log('New activity received:', payload);
          setActivities((prev) => [payload.new as unknown as ActivityData, ...prev]);
          setIsLive(true);
          // Reset live indicator after 2 seconds
          setTimeout(() => setIsLive(false), 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Calculate metrics
  const uniqueUsers = new Set(activities.map(a => a.user_id)).size;
  const totalActions = activities.length;
  const pageVisits = activities.filter(a => a.action_type === 'page_visit').length;
  const featureUsage = activities.filter(a => a.action_type === 'feature_usage').length;

  // Feature usage by view
  const featureData = activities
    .filter(a => a.action_type === 'feature_usage' && a.action_details?.view)
    .reduce((acc, a) => {
      const view = a.action_details.view as string;
      acc[view] = (acc[view] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const featureChartData = Object.entries(featureData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Page visits by path
  const pageData = activities
    .filter(a => a.action_type === 'page_visit')
    .reduce((acc, a) => {
      const path = a.page_path || 'unknown';
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const pageChartData = Object.entries(pageData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Daily activity trend (last 7 days)
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const dayActivities = activities.filter(a => {
      const actDate = new Date(a.created_at);
      return actDate >= dayStart && actDate <= dayEnd;
    });
    return {
      date: format(date, 'MMM dd'),
      actions: dayActivities.length,
      users: new Set(dayActivities.map(a => a.user_id)).size,
    };
  });

  // Action type distribution
  const actionTypeData = activities.reduce((acc, a) => {
    acc[a.action_type] = (acc[a.action_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const actionPieData = Object.entries(actionTypeData).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/app')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Admin Analytics</h1>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`gap-1.5 transition-colors ${isLive ? 'border-green-500 text-green-500' : 'border-muted-foreground/30 text-muted-foreground'}`}
          >
            <Radio className={`h-3 w-3 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'Live Update' : 'Live'}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <UserCog className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueUsers}</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalActions}</div>
                  <p className="text-xs text-muted-foreground">All tracked activities</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Page Visits</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pageVisits}</div>
                  <p className="text-xs text-muted-foreground">Page navigation events</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Feature Usage</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{featureUsage}</div>
                  <p className="text-xs text-muted-foreground">Feature interactions</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Activity Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity (Last 7 Days)</CardTitle>
                  <CardDescription>Actions and unique users per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="actions" stroke="hsl(var(--primary))" strokeWidth={2} name="Actions" />
                      <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Unique Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Action Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Action Types</CardTitle>
                  <CardDescription>Distribution of activity types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={actionPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {actionPieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Feature & Page Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feature Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Used Features</CardTitle>
                  <CardDescription>Feature navigation breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={featureChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Page Visits */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pageChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement currentUserId={user?.id || ''} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminAnalytics;
