import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Inbox, 
  Video, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Target, 
  FileText, 
  BarChart3, 
  Activity, 
  Bell, 
  MessageSquare,
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Shield,
  Zap,
  Brain
} from 'lucide-react';

// Import mockup images
import authMockup from '@/assets/features/auth-mockup.png';
import dashboardMockup from '@/assets/features/dashboard-mockup.png';
import inboxMockup from '@/assets/features/inbox-mockup.png';
import meetingMockup from '@/assets/features/meeting-mockup.png';
import projectsMockup from '@/assets/features/projects-mockup.png';
import taskboardMockup from '@/assets/features/taskboard-mockup.png';
import teamMockup from '@/assets/features/team-mockup.png';
import stakeholderMockup from '@/assets/features/stakeholder-mockup.png';
import strategyMockup from '@/assets/features/strategy-mockup.png';
import documentsMockup from '@/assets/features/documents-mockup.png';
import reportsMockup from '@/assets/features/reports-mockup.png';
import activityMockup from '@/assets/features/activity-mockup.png';
import notificationsMockup from '@/assets/features/notifications-mockup.png';
import aiChatMockup from '@/assets/features/ai-chat-mockup.png';
import languageMockup from '@/assets/features/language-mockup.png';
import themeMockup from '@/assets/features/theme-mockup.png';

const FeaturesShowcase = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [isDark] = useState(false);

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade login system with email/password authentication, session management, and secure sign-out functionality.',
      category: 'Security',
      color: 'bg-emerald-500/10 text-emerald-500',
      image: authMockup
    },
    {
      icon: LayoutDashboard,
      title: 'Executive Dashboard',
      description: 'Real-time KPI cards showing active projects, tasks in progress, team members, and completion rates. Portfolio health charts and velocity tracking.',
      category: 'Analytics',
      color: 'bg-primary/10 text-primary',
      image: dashboardMockup
    },
    {
      icon: Inbox,
      title: 'Smart Inbox',
      description: 'AI-powered email management with sentiment analysis, confidence scoring, escalation matrix (L1-L4), and one-click task extraction.',
      category: 'AI-Powered',
      color: 'bg-violet-500/10 text-violet-500',
      image: inboxMockup
    },
    {
      icon: Video,
      title: 'Meeting Hub',
      description: 'Transcript analyzer that converts meeting recordings into structured summaries, decisions, and action items automatically.',
      category: 'AI-Powered',
      color: 'bg-violet-500/10 text-violet-500',
      image: meetingMockup
    },
    {
      icon: FolderKanban,
      title: 'Projects View',
      description: 'Comprehensive project cards with team allocation, milestones, and interactive Gantt chart timeline visualization.',
      category: 'Management',
      color: 'bg-blue-500/10 text-blue-500',
      image: projectsMockup
    },
    {
      icon: CheckSquare,
      title: 'Task Board',
      description: 'Drag-and-drop Kanban board for task management. Tasks can be created manually or auto-extracted from emails and meetings.',
      category: 'Management',
      color: 'bg-blue-500/10 text-blue-500',
      image: taskboardMockup
    },
    {
      icon: Users,
      title: 'Team View',
      description: 'Member profiles, workload distribution charts, skills matrix, and team analytics for resource optimization.',
      category: 'Team',
      color: 'bg-orange-500/10 text-orange-500',
      image: teamMockup
    },
    {
      icon: Target,
      title: 'Stakeholder Management',
      description: 'Categorize stakeholders by influence/interest matrix. Communication plans with scheduling and channel preferences.',
      category: 'Management',
      color: 'bg-blue-500/10 text-blue-500',
      image: stakeholderMockup
    },
    {
      icon: Target,
      title: 'Strategy View',
      description: 'ROI tracking, budget vs. actuals comparison, and strategic pillar alignment dashboards for executive visibility.',
      category: 'Analytics',
      color: 'bg-primary/10 text-primary',
      image: strategyMockup
    },
    {
      icon: FileText,
      title: 'Documents & Templates',
      description: 'Cloud storage sync with Google Drive and OneDrive. Pre-built templates for kickoff meetings, RACI matrix, risk registers, and more.',
      category: 'Productivity',
      color: 'bg-cyan-500/10 text-cyan-500',
      image: documentsMockup
    },
    {
      icon: BarChart3,
      title: 'Auto-Generated Reports',
      description: 'AI creates weekly status, monthly summaries, stakeholder updates, and risk assessments automatically from project data.',
      category: 'AI-Powered',
      color: 'bg-violet-500/10 text-violet-500',
      image: reportsMockup
    },
    {
      icon: Activity,
      title: 'Activity Tracking',
      description: 'Daily, weekly, and monthly activity metrics showing how AI reduces administrative work and increases productivity.',
      category: 'Analytics',
      color: 'bg-primary/10 text-primary',
      image: activityMockup
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'AI-prioritized alerts for deadlines, risks, updates, mentions, and milestones with critical/high/medium/low priority levels.',
      category: 'AI-Powered',
      color: 'bg-violet-500/10 text-violet-500',
      image: notificationsMockup
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Floating chat interface powered by AI for instant help, project queries, and intelligent suggestions.',
      category: 'AI-Powered',
      color: 'bg-violet-500/10 text-violet-500',
      image: aiChatMockup
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Full English and Arabic support with automatic RTL layout switching and localized interface elements.',
      category: 'Accessibility',
      color: 'bg-teal-500/10 text-teal-500',
      image: languageMockup
    },
    {
      icon: isDark ? Sun : Moon,
      title: 'Theme Switching',
      description: 'Professional dark and light themes optimized for extended use with high-contrast enterprise design.',
      category: 'Accessibility',
      color: 'bg-teal-500/10 text-teal-500',
      image: themeMockup
    }
  ];

  const categories = ['All', 'AI-Powered', 'Analytics', 'Management', 'Team', 'Productivity', 'Security', 'Accessibility'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFeatures = selectedCategory === 'All' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
          <h1 className="text-xl font-bold text-foreground">Nexus Project OS - Features</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          <Brain className="h-3 w-3 mr-1" />
          AI-First Platform
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          One Platform. Every Feature.
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          From secure login to intelligent automation, explore all the capabilities that make Nexus your single point of work.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Zap className="h-5 w-5 text-amber-500" />
          <span className="text-muted-foreground">16 Powerful Features</span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground">6 AI-Powered</span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground">Fully Responsive</span>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card overflow-hidden"
            >
              {/* Feature Image */}
              <div className="relative h-40 overflow-hidden bg-muted">
                <img 
                  src={feature.image} 
                  alt={`${feature.title} mockup`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              </div>
              
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* User Journey Section */}
      <section className="container mx-auto px-4 pb-16">
        <h3 className="text-2xl font-bold text-center text-foreground mb-8">User Journey</h3>
        <div className="flex flex-wrap justify-center items-center gap-4">
          {[
            { step: 1, label: 'Login', icon: Shield },
            { step: 2, label: 'Dashboard', icon: LayoutDashboard },
            { step: 3, label: 'Check Inbox', icon: Inbox },
            { step: 4, label: 'Review Meetings', icon: Video },
            { step: 5, label: 'Manage Tasks', icon: CheckSquare },
            { step: 6, label: 'Track Projects', icon: FolderKanban },
            { step: 7, label: 'Generate Reports', icon: BarChart3 },
            { step: 8, label: 'Logout', icon: Shield }
          ].map((item, index, arr) => (
            <div key={item.step} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground text-center">{item.label}</span>
              </div>
              {index < arr.length - 1 && (
                <div className="hidden md:block w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Experience Nexus?</h3>
            <p className="text-muted-foreground mb-6">
              Start using the AI-first project management platform today.
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
              Launch Application
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default FeaturesShowcase;
