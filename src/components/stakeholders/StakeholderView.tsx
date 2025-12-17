import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Crown,
  Users,
  UserCheck,
  Eye,
  MoreVertical,
  MessageSquare,
  Video,
  FileText,
  Bell,
  Calendar,
  Clock,
  Edit2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Import stakeholder avatars
import sarahMitchellAvatar from '@/assets/stakeholders/sarah-mitchell.png';
import jamesWilsonCfoAvatar from '@/assets/stakeholders/james-wilson-cfo.png';
import emilyChenAvatar from '@/assets/stakeholders/emily-chen.png';
import michaelBrownAvatar from '@/assets/stakeholders/michael-brown.png';
import lisaThompsonAvatar from '@/assets/stakeholders/lisa-thompson.png';
import davidParkAvatar from '@/assets/stakeholders/david-park.png';
import amandaFosterAvatar from '@/assets/stakeholders/amanda-foster.png';
import robertKimAvatar from '@/assets/stakeholders/robert-kim.png';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone: string;
  avatar?: string;
  influence: 'key-player' | 'keep-satisfied' | 'keep-informed' | 'monitor';
  interest: 'high' | 'medium' | 'low';
  power: 'high' | 'medium' | 'low';
  projects: string[];
  lastContact: string;
}

interface CommunicationPlan {
  influence: 'key-player' | 'keep-satisfied' | 'keep-informed' | 'monitor';
  frequency: string;
  channels: string[];
  messageTypes: string[];
  owner: string;
  nextScheduled: string;
}

const mockStakeholders: Stakeholder[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'CEO',
    organization: 'Acme Corp',
    email: 'sarah.m@acme.com',
    phone: '+1 555-0101',
    avatar: sarahMitchellAvatar,
    influence: 'key-player',
    interest: 'high',
    power: 'high',
    projects: ['Digital Transformation', 'Q4 Launch'],
    lastContact: '2 days ago',
  },
  {
    id: '2',
    name: 'James Wilson',
    role: 'CFO',
    organization: 'Acme Corp',
    email: 'james.w@acme.com',
    phone: '+1 555-0102',
    avatar: jamesWilsonCfoAvatar,
    influence: 'keep-satisfied',
    interest: 'medium',
    power: 'high',
    projects: ['Budget Review', 'Q4 Launch'],
    lastContact: '1 week ago',
  },
  {
    id: '3',
    name: 'Emily Chen',
    role: 'Product Manager',
    organization: 'TechStart Inc',
    email: 'emily.c@techstart.com',
    phone: '+1 555-0103',
    avatar: emilyChenAvatar,
    influence: 'key-player',
    interest: 'high',
    power: 'medium',
    projects: ['Mobile App Redesign'],
    lastContact: '3 days ago',
  },
  {
    id: '4',
    name: 'Michael Brown',
    role: 'IT Director',
    organization: 'Acme Corp',
    email: 'michael.b@acme.com',
    phone: '+1 555-0104',
    avatar: michaelBrownAvatar,
    influence: 'keep-informed',
    interest: 'high',
    power: 'low',
    projects: ['Digital Transformation', 'Security Audit'],
    lastContact: '5 days ago',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Marketing VP',
    organization: 'Global Media',
    email: 'lisa.t@globalmedia.com',
    phone: '+1 555-0105',
    avatar: lisaThompsonAvatar,
    influence: 'keep-satisfied',
    interest: 'low',
    power: 'high',
    projects: ['Brand Campaign'],
    lastContact: '2 weeks ago',
  },
  {
    id: '6',
    name: 'David Park',
    role: 'Developer Lead',
    organization: 'TechStart Inc',
    email: 'david.p@techstart.com',
    phone: '+1 555-0106',
    avatar: davidParkAvatar,
    influence: 'keep-informed',
    interest: 'high',
    power: 'medium',
    projects: ['Mobile App Redesign', 'API Integration'],
    lastContact: '1 day ago',
  },
  {
    id: '7',
    name: 'Amanda Foster',
    role: 'Legal Counsel',
    organization: 'Acme Corp',
    email: 'amanda.f@acme.com',
    phone: '+1 555-0107',
    avatar: amandaFosterAvatar,
    influence: 'monitor',
    interest: 'low',
    power: 'medium',
    projects: ['Compliance Review'],
    lastContact: '3 weeks ago',
  },
  {
    id: '8',
    name: 'Robert Kim',
    role: 'External Consultant',
    organization: 'Strategy Partners',
    email: 'robert.k@strategyp.com',
    phone: '+1 555-0108',
    avatar: robertKimAvatar,
    influence: 'monitor',
    interest: 'medium',
    power: 'low',
    projects: ['Process Optimization'],
    lastContact: '1 month ago',
  },
];

const mockCommunicationPlans: CommunicationPlan[] = [
  {
    influence: 'key-player',
    frequency: 'Weekly',
    channels: ['Email', 'Video Call', 'In-Person'],
    messageTypes: ['Status Report', 'Risk Alerts', 'Decision Requests'],
    owner: 'Project Manager',
    nextScheduled: 'Tomorrow, 10:00 AM',
  },
  {
    influence: 'keep-satisfied',
    frequency: 'Bi-Weekly',
    channels: ['Email', 'Video Call'],
    messageTypes: ['Executive Summary', 'Milestone Updates'],
    owner: 'Project Manager',
    nextScheduled: 'Dec 20, 2:00 PM',
  },
  {
    influence: 'keep-informed',
    frequency: 'Weekly',
    channels: ['Email', 'Slack'],
    messageTypes: ['Newsletter', 'Progress Updates', 'Meeting Notes'],
    owner: 'Team Lead',
    nextScheduled: 'Friday, 4:00 PM',
  },
  {
    influence: 'monitor',
    frequency: 'Monthly',
    channels: ['Email'],
    messageTypes: ['Monthly Summary', 'Major Announcements'],
    owner: 'Communications Lead',
    nextScheduled: 'Jan 1, 9:00 AM',
  },
];

const influenceConfig = {
  'key-player': {
    label: 'Key Players',
    description: 'High Power & High Interest - Manage Closely',
    icon: Crown,
    color: 'bg-primary/10 text-primary border-primary/20',
    badgeColor: 'bg-primary text-primary-foreground',
  },
  'keep-satisfied': {
    label: 'Keep Satisfied',
    description: 'High Power & Low Interest - Keep Satisfied',
    icon: UserCheck,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    badgeColor: 'bg-amber-500 text-white',
  },
  'keep-informed': {
    label: 'Keep Informed',
    description: 'Low Power & High Interest - Keep Informed',
    icon: Users,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    badgeColor: 'bg-emerald-500 text-white',
  },
  'monitor': {
    label: 'Monitor',
    description: 'Low Power & Low Interest - Monitor',
    icon: Eye,
    color: 'bg-muted text-muted-foreground border-border',
    badgeColor: 'bg-muted text-muted-foreground',
  },
};

const channelIcons: Record<string, React.ElementType> = {
  'Email': Mail,
  'Video Call': Video,
  'In-Person': Users,
  'Slack': MessageSquare,
};

const StakeholderCard = ({ stakeholder }: { stakeholder: Stakeholder }) => {
  const config = influenceConfig[stakeholder.influence];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={stakeholder.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {stakeholder.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground truncate">{stakeholder.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Send Email</DropdownMenuItem>
                  <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
            
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span>{stakeholder.organization}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              <Badge variant="outline" className={config.badgeColor}>
                {config.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Power: {stakeholder.power}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Interest: {stakeholder.interest}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{stakeholder.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{stakeholder.phone}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">Projects:</p>
              <div className="flex flex-wrap gap-1">
                {stakeholder.projects.map((project) => (
                  <Badge key={project} variant="secondary" className="text-xs">
                    {project}
                  </Badge>
                ))}
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              Last contact: {stakeholder.lastContact}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CommunicationPlanCard = ({ plan }: { plan: CommunicationPlan }) => {
  const config = influenceConfig[plan.influence];
  const Icon = config.icon;
  const stakeholderCount = mockStakeholders.filter(s => s.influence === plan.influence).length;

  return (
    <Card className={`border-2 ${config.color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="h-5 w-5" />
            {config.label}
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{stakeholderCount} stakeholder(s)</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Frequency */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="font-medium text-foreground">{plan.frequency}</p>
          </div>
        </div>

        {/* Channels */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Channels</p>
          <div className="flex flex-wrap gap-2">
            {plan.channels.map((channel) => {
              const ChannelIcon = channelIcons[channel] || Bell;
              return (
                <Badge key={channel} variant="secondary" className="gap-1">
                  <ChannelIcon className="h-3 w-3" />
                  {channel}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Message Types */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Message Types</p>
          <div className="flex flex-wrap gap-1">
            {plan.messageTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Owner & Next Scheduled */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Owner:</span>
            <span className="font-medium text-foreground">{plan.owner}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Next:
            </span>
            <span className="font-medium text-primary">{plan.nextScheduled}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full gap-2">
          <Mail className="h-4 w-4" />
          Send Communication
        </Button>
      </CardContent>
    </Card>
  );
};

const StakeholderView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filterStakeholders = (influence?: string) => {
    return mockStakeholders.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInfluence = !influence || influence === 'all' || s.influence === influence;
      return matchesSearch && matchesInfluence;
    });
  };

  const getStakeholdersByInfluence = (influence: keyof typeof influenceConfig) => {
    return filterStakeholders(influence);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stakeholders</h1>
          <p className="text-muted-foreground">Manage stakeholders by their influence on projects</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Stakeholder
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stakeholders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({filterStakeholders().length})</TabsTrigger>
          <TabsTrigger value="matrix">Influence Matrix</TabsTrigger>
          <TabsTrigger value="communication">Communication Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filterStakeholders().map((stakeholder) => (
              <StakeholderCard key={stakeholder.id} stakeholder={stakeholder} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(Object.keys(influenceConfig) as Array<keyof typeof influenceConfig>).map((influence) => {
              const config = influenceConfig[influence];
              const Icon = config.icon;
              const stakeholders = getStakeholdersByInfluence(influence);

              return (
                <Card key={influence} className={`border-2 ${config.color}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5" />
                      {config.label}
                      <Badge variant="secondary" className="ml-auto">
                        {stakeholders.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stakeholders.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No stakeholders in this category
                      </p>
                    ) : (
                      stakeholders.map((stakeholder) => (
                        <div
                          key={stakeholder.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {stakeholder.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {stakeholder.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {stakeholder.role} • {stakeholder.organization}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="communication" className="mt-6 space-y-6">
          {/* Communication Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {mockCommunicationPlans.map((plan) => (
              <CommunicationPlanCard key={plan.influence} plan={plan} />
            ))}
          </div>

          {/* Communication Schedule Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Communication Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stakeholder Group</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Primary Channel</TableHead>
                    <TableHead>Message Type</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Next Scheduled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCommunicationPlans.map((plan) => {
                    const config = influenceConfig[plan.influence];
                    return (
                      <TableRow key={plan.influence}>
                        <TableCell>
                          <Badge className={config.badgeColor}>{config.label}</Badge>
                        </TableCell>
                        <TableCell>{plan.frequency}</TableCell>
                        <TableCell>{plan.channels[0]}</TableCell>
                        <TableCell>{plan.messageTypes[0]}</TableCell>
                        <TableCell>{plan.owner}</TableCell>
                        <TableCell className="text-primary font-medium">
                          {plan.nextScheduled}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StakeholderView;
