import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  TrendingUp,
  Star,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface TeamMemberFull {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  workload: number;
  tasksCompleted: number;
  tasksInProgress: number;
  skills: { name: string; level: number }[];
  projects: string[];
  availability: 'available' | 'busy' | 'away' | 'offline';
  performance: number;
}

const teamMembers: TeamMemberFull[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '',
    role: 'Engineering Lead',
    department: 'Engineering',
    email: 'sarah.chen@nexus.io',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: '2022-03-15',
    workload: 85,
    tasksCompleted: 47,
    tasksInProgress: 8,
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Node.js', level: 85 },
      { name: 'System Design', level: 88 },
      { name: 'Leadership', level: 82 }
    ],
    projects: ['Platform Migration', 'API Gateway'],
    availability: 'available',
    performance: 94
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: '',
    role: 'Senior Designer',
    department: 'Design',
    email: 'marcus.j@nexus.io',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY',
    joinDate: '2021-08-22',
    workload: 72,
    tasksCompleted: 38,
    tasksInProgress: 5,
    skills: [
      { name: 'UI Design', level: 92 },
      { name: 'Figma', level: 95 },
      { name: 'Prototyping', level: 88 },
      { name: 'User Research', level: 78 },
      { name: 'Motion Design', level: 70 }
    ],
    projects: ['Brand Refresh', 'Mobile App'],
    availability: 'busy',
    performance: 91
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    avatar: '',
    role: 'Product Manager',
    department: 'Product',
    email: 'elena.r@nexus.io',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    joinDate: '2023-01-10',
    workload: 90,
    tasksCompleted: 52,
    tasksInProgress: 12,
    skills: [
      { name: 'Strategy', level: 90 },
      { name: 'Analytics', level: 85 },
      { name: 'Roadmapping', level: 92 },
      { name: 'Stakeholder Mgmt', level: 88 },
      { name: 'Agile', level: 86 }
    ],
    projects: ['Q4 Roadmap', 'Customer Portal'],
    availability: 'available',
    performance: 96
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: '',
    role: 'Backend Developer',
    department: 'Engineering',
    email: 'david.k@nexus.io',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    joinDate: '2022-11-05',
    workload: 65,
    tasksCompleted: 33,
    tasksInProgress: 4,
    skills: [
      { name: 'Python', level: 92 },
      { name: 'PostgreSQL', level: 88 },
      { name: 'AWS', level: 85 },
      { name: 'Docker', level: 80 },
      { name: 'GraphQL', level: 75 }
    ],
    projects: ['Data Pipeline', 'API Gateway'],
    availability: 'away',
    performance: 88
  },
  {
    id: '5',
    name: 'Aisha Patel',
    avatar: '',
    role: 'QA Engineer',
    department: 'Engineering',
    email: 'aisha.p@nexus.io',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    joinDate: '2023-04-18',
    workload: 78,
    tasksCompleted: 29,
    tasksInProgress: 6,
    skills: [
      { name: 'Test Automation', level: 90 },
      { name: 'Selenium', level: 88 },
      { name: 'API Testing', level: 85 },
      { name: 'Performance', level: 78 },
      { name: 'CI/CD', level: 72 }
    ],
    projects: ['Platform Migration', 'Mobile App'],
    availability: 'available',
    performance: 89
  },
  {
    id: '6',
    name: 'James Wilson',
    avatar: '',
    role: 'DevOps Engineer',
    department: 'Infrastructure',
    email: 'james.w@nexus.io',
    phone: '+1 (555) 678-9012',
    location: 'Denver, CO',
    joinDate: '2022-06-30',
    workload: 82,
    tasksCompleted: 41,
    tasksInProgress: 7,
    skills: [
      { name: 'Kubernetes', level: 94 },
      { name: 'Terraform', level: 90 },
      { name: 'AWS', level: 92 },
      { name: 'Monitoring', level: 85 },
      { name: 'Security', level: 80 }
    ],
    projects: ['Infrastructure Upgrade', 'Security Audit'],
    availability: 'busy',
    performance: 92
  }
];

const departmentData = [
  { name: 'Engineering', value: 3, color: 'hsl(var(--primary))' },
  { name: 'Design', value: 1, color: 'hsl(var(--chart-2))' },
  { name: 'Product', value: 1, color: 'hsl(var(--chart-3))' },
  { name: 'Infrastructure', value: 1, color: 'hsl(var(--chart-4))' }
];

const workloadDistribution = [
  { name: 'Sarah C.', workload: 85, capacity: 100 },
  { name: 'Marcus J.', workload: 72, capacity: 100 },
  { name: 'Elena R.', workload: 90, capacity: 100 },
  { name: 'David K.', workload: 65, capacity: 100 },
  { name: 'Aisha P.', workload: 78, capacity: 100 },
  { name: 'James W.', workload: 82, capacity: 100 }
];

const TeamView = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMemberFull | null>(null);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-emerald-500';
      case 'busy': return 'bg-amber-500';
      case 'away': return 'bg-orange-500';
      default: return 'bg-muted';
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'text-rose-500';
    if (workload >= 75) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const totalTasks = teamMembers.reduce((acc, m) => acc + m.tasksCompleted + m.tasksInProgress, 0);
  const avgWorkload = Math.round(teamMembers.reduce((acc, m) => acc + m.workload, 0) / teamMembers.length);
  const avgPerformance = Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / teamMembers.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground mt-1">Monitor team performance, workload, and capacity</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Users className="w-4 h-4 mr-2" />
          {teamMembers.length} Members
        </Badge>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold text-foreground">{teamMembers.reduce((a, m) => a + m.tasksCompleted, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <BarChart3 className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Workload</p>
                <p className="text-2xl font-bold text-foreground">{avgWorkload}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold text-foreground">{avgPerformance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card 
                key={member.id} 
                className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-border">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getAvailabilityColor(member.availability)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {member.department}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Workload</span>
                      <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                        {member.workload}%
                      </span>
                    </div>
                    <Progress value={member.workload} className="h-2" />

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-1 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-muted-foreground">{member.tasksCompleted}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-muted-foreground">{member.tasksInProgress}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{member.performance}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {departmentData.map((dept) => (
                    <div key={dept.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                      <span className="text-sm text-muted-foreground">{dept.name} ({dept.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Team Skills Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { skill: 'Frontend', value: 92 },
                      { skill: 'Backend', level: 88 },
                      { skill: 'Design', value: 90 },
                      { skill: 'DevOps', value: 92 },
                      { skill: 'Testing', value: 87 },
                      { skill: 'Leadership', value: 85 }
                    ]}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Radar name="Skills" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workloadDistribution} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="workload" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Load</span>
                      <span className={getWorkloadColor(member.workload)}>{member.workload}%</span>
                    </div>
                    <Progress value={member.workload} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                      <span>{member.tasksInProgress} tasks in progress</span>
                      <span>{100 - member.workload}% available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
          <Card className="w-full max-w-2xl mx-4 bg-card border-border" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20 border-2 border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-foreground">{selectedMember.name}</h2>
                    <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(selectedMember.availability)}`} />
                  </div>
                  <p className="text-muted-foreground">{selectedMember.role}</p>
                  <Badge variant="outline" className="mt-2">{selectedMember.department}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedMember.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedMember.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedMember.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Joined {new Date(selectedMember.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-3">Skills</h3>
                <div className="space-y-2">
                  {selectedMember.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-32">{skill.name}</span>
                      <Progress value={skill.level} className="flex-1 h-2" />
                      <span className="text-sm text-foreground w-10">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-3">Assigned Projects</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.projects.map((project) => (
                    <Badge key={project} variant="secondary">{project}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamView;
