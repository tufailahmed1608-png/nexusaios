import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Brain,
  Sparkles,
  Video,
  FileText,
  BarChart3,
  Zap,
  MessageSquare,
  Shield,
  Clock,
  Target,
} from 'lucide-react';

// Demo data
const demoEmails = [
  {
    id: 1,
    from: 'Sarah Chen',
    subject: 'Q4 Budget Review - Urgent Approval Needed',
    preview: 'Hi team, we need to finalize the Q4 budget by Friday. Please review the attached spreadsheet...',
    sentiment: 'urgent',
    sentimentScore: 0.85,
    escalation: 'L3',
    extractedTask: 'Review Q4 budget spreadsheet by Friday',
    time: '2 hours ago',
  },
  {
    id: 2,
    from: 'Michael Torres',
    subject: 'Great news on the product launch!',
    preview: 'Team, I wanted to share that our product launch exceeded expectations by 150%...',
    sentiment: 'positive',
    sentimentScore: 0.92,
    escalation: 'L1',
    extractedTask: null,
    time: '4 hours ago',
  },
  {
    id: 3,
    from: 'Emily Watson',
    subject: 'Concerns about timeline slippage',
    preview: 'I have noticed some delays in the backend integration. We might need to discuss...',
    sentiment: 'concerned',
    sentimentScore: 0.65,
    escalation: 'L2',
    extractedTask: 'Schedule meeting to discuss backend integration delays',
    time: '5 hours ago',
  },
];

const demoMeeting = {
  title: 'Sprint Planning - Week 48',
  duration: '45 min',
  participants: ['Sarah Chen', 'Michael Torres', 'Emily Watson', 'David Kim'],
  transcript: `Sarah: Let's go through this sprint's priorities. We have the Q4 deadline approaching.
Michael: I think we should focus on the payment integration first. It's the critical path.
Emily: Agreed. I can have the backend ready by Wednesday.
David: I'll handle the frontend components. Should be done by Thursday.
Sarah: Perfect. Let's also allocate time for testing. Emily, can you coordinate with QA?
Emily: Yes, I'll set up the testing schedule today.`,
  aiSummary: {
    decisions: [
      'Payment integration is the sprint priority',
      'Backend completion target: Wednesday',
      'Frontend completion target: Thursday',
    ],
    actionItems: [
      { task: 'Complete payment integration backend', assignee: 'Emily Watson', due: 'Wednesday' },
      { task: 'Build frontend payment components', assignee: 'David Kim', due: 'Thursday' },
      { task: 'Coordinate QA testing schedule', assignee: 'Emily Watson', due: 'Today' },
    ],
  },
};

const demoKPIs = [
  { label: 'Active Projects', value: 12, change: '+2', trend: 'up', icon: Target },
  { label: 'Tasks Completed', value: 847, change: '+23%', trend: 'up', icon: CheckCircle2 },
  { label: 'Team Members', value: 24, change: '0', trend: 'neutral', icon: Users },
  { label: 'On-Time Delivery', value: 94, suffix: '%', change: '+5%', trend: 'up', icon: Clock },
];

const ProductDemo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(demoEmails[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [meetingStep, setMeetingStep] = useState<'transcript' | 'analyzing' | 'results'>('transcript');
  const [animatedValues, setAnimatedValues] = useState(demoKPIs.map(() => 0));

  // Animate KPI values
  useEffect(() => {
    if (activeTab === 'dashboard') {
      const targets = demoKPIs.map(k => k.value);
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        setAnimatedValues(targets.map(target => Math.round((target * step) / steps)));
        if (step >= steps) clearInterval(timer);
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [activeTab]);

  const handleAnalyzeEmail = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 1500);
  };

  const handleAnalyzeMeeting = () => {
    setMeetingStep('analyzing');
    setTimeout(() => {
      setMeetingStep('results');
    }, 2000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-500';
      case 'urgent': return 'bg-rose-500';
      case 'concerned': return 'bg-amber-500';
      default: return 'bg-muted';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', label: 'Positive' };
      case 'urgent': return { color: 'bg-rose-500/10 text-rose-600 border-rose-500/20', label: 'Urgent' };
      case 'concerned': return { color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', label: 'Concerned' };
      default: return { color: 'bg-muted', label: 'Neutral' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Nexus Demo</span>
          </div>
          <Button onClick={() => navigate('/auth')} className="gap-2">
            Try Free <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 text-center border-b border-border bg-muted/30">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          <Brain className="h-3 w-3 mr-1" />
          Interactive Demo
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Experience Nexus in Action
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our AI-powered features with live demonstrations. Click through the tabs to see how Nexus transforms project management.
        </p>
      </section>

      {/* Demo Tabs */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="inbox" className="gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Smart Inbox</span>
            </TabsTrigger>
            <TabsTrigger value="meeting" className="gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Meetings</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Smart Inbox Demo */}
          <TabsContent value="inbox" className="space-y-4">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Email List */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">AI-Analyzed Emails</h3>
                {demoEmails.map((email) => (
                  <Card
                    key={email.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedEmail.id === email.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedEmail(email);
                      setShowAnalysis(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${getSentimentColor(email.sentiment)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-medium text-foreground truncate">{email.from}</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{email.time}</span>
                          </div>
                          <p className="text-sm font-medium text-foreground truncate mb-1">{email.subject}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{email.preview}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Email Detail & Analysis */}
              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedEmail.subject}</CardTitle>
                        <p className="text-sm text-muted-foreground">From: {selectedEmail.from}</p>
                      </div>
                      <Badge className={getSentimentBadge(selectedEmail.sentiment).color}>
                        {getSentimentBadge(selectedEmail.sentiment).label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{selectedEmail.preview}</p>
                    <Button onClick={handleAnalyzeEmail} disabled={isAnalyzing || showAnalysis} className="gap-2">
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : showAnalysis ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Analyzed
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {showAnalysis && (
                  <Card className="animate-fade-in border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Sentiment Score</p>
                          <div className="flex items-center gap-2">
                            <Progress value={selectedEmail.sentimentScore * 100} className="h-2" />
                            <span className="text-sm font-medium">{Math.round(selectedEmail.sentimentScore * 100)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Escalation Level</p>
                          <Badge variant="outline" className="font-mono">{selectedEmail.escalation}</Badge>
                        </div>
                      </div>
                      {selectedEmail.extractedTask && (
                        <div className="p-3 rounded-lg bg-background border border-border">
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Extracted Task
                          </p>
                          <p className="text-sm font-medium text-foreground">{selectedEmail.extractedTask}</p>
                          <Button size="sm" className="mt-2 gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Add to Tasks
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Meeting Hub Demo */}
          <TabsContent value="meeting" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      {demoMeeting.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {demoMeeting.duration} • {demoMeeting.participants.length} participants
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    {demoMeeting.participants.slice(0, 4).map((p, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
                      >
                        {p.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {meetingStep === 'transcript' && (
                  <>
                    <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm whitespace-pre-wrap">
                      {demoMeeting.transcript}
                    </div>
                    <Button onClick={handleAnalyzeMeeting} className="gap-2">
                      <Brain className="h-4 w-4" />
                      Generate Meeting Summary
                    </Button>
                  </>
                )}

                {meetingStep === 'analyzing' && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                    <p className="text-muted-foreground">AI is analyzing the transcript...</p>
                    <Progress value={66} className="w-48 h-2" />
                  </div>
                )}

                {meetingStep === 'results' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Key Decisions
                      </h4>
                      <ul className="space-y-2">
                        {demoMeeting.aiSummary.decisions.map((decision, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{decision}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Action Items
                      </h4>
                      <div className="space-y-2">
                        {demoMeeting.aiSummary.actionItems.map((item, i) => (
                          <div key={i} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.task}</p>
                              <p className="text-xs text-muted-foreground">Assignee: {item.assignee}</p>
                            </div>
                            <Badge variant="outline">{item.due}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setMeetingStep('transcript')}
                      className="gap-2"
                    >
                      Reset Demo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Demo */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {demoKPIs.map((kpi, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <kpi.icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          kpi.trend === 'up'
                            ? 'text-emerald-600 border-emerald-500/20'
                            : 'text-muted-foreground'
                        }
                      >
                        {kpi.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {animatedValues[i]}{kpi.suffix || ''}
                    </p>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Website Redesign', health: 92, status: 'On Track' },
                    { name: 'Mobile App v2', health: 78, status: 'At Risk' },
                    { name: 'API Integration', health: 85, status: 'On Track' },
                  ].map((project, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{project.name}</span>
                        <Badge
                          variant="outline"
                          className={
                            project.status === 'On Track'
                              ? 'text-emerald-600 border-emerald-500/20'
                              : 'text-amber-600 border-amber-500/20'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <Progress value={project.health} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Team Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { user: 'Sarah Chen', action: 'completed task', item: 'Review Q4 budget', time: '5m ago' },
                    { user: 'Michael Torres', action: 'added comment on', item: 'Sprint Planning', time: '12m ago' },
                    { user: 'Emily Watson', action: 'created task', item: 'Backend integration', time: '28m ago' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-foreground">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-muted-foreground">{activity.action}</span>{' '}
                          <span className="font-medium">{activity.item}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Demo */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  AI-Generated Weekly Report
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Automatically generated from project activity
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Executive Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      This week saw strong progress across all active projects with a 23% increase in task
                      completion rate. The Website Redesign project is on track for its December deadline,
                      while the Mobile App v2 requires attention due to backend integration delays.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Key Highlights</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500 mt-0.5" />
                        847 tasks completed (+23% from last week)
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-primary mt-0.5" />
                        Team velocity improved by 15%
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        1 project flagged as at-risk
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Recommendations</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Allocate additional resources to Mobile App v2 backend</li>
                      <li>• Schedule stakeholder review for Website Redesign</li>
                      <li>• Begin planning for Q1 2025 roadmap</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Share with Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of project managers using Nexus to save hours every week.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/features')}>
              View All Features
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDemo;
