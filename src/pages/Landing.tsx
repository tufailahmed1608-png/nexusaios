import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

import {
  Brain,
  Mail,
  Video,
  BarChart3,
  Shield,
  Zap,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Eye,
  GitBranch,
  Gavel,
  TrendingUp,
  Lock,
  Check,
  X,
} from 'lucide-react';

const comparisonData = [
  {
    category: 'Primary Purpose',
    nexus: 'Intelligence layer for decision support',
    traditional: 'Task & project execution tracking',
  },
  {
    category: 'Relationship to Tools',
    nexus: 'Observes existing systems (Jira, M365, etc.)',
    traditional: 'Replaces or competes with other tools',
  },
  {
    category: 'AI Role',
    nexus: 'Assists analysis, humans decide',
    traditional: 'Automation focus, limited intelligence',
  },
  {
    category: 'Target Users',
    nexus: 'PMO, Executives, Program Managers',
    traditional: 'Project Managers, Team Members',
  },
  {
    category: 'Meeting Intelligence',
    nexus: 'Auto MoM, action extraction, decisions',
    traditional: 'Manual notes or basic transcription',
  },
  {
    category: 'Reporting',
    nexus: 'AI-generated executive summaries',
    traditional: 'Manual report creation',
  },
  {
    category: 'Decision Tracking',
    nexus: 'Structured log with audit trail',
    traditional: 'Scattered in emails/docs',
  },
  {
    category: 'Governance',
    nexus: 'Human-in-the-loop enforcement',
    traditional: 'Process-dependent',
  },
];

const features = [
  {
    icon: Video,
    title: 'Meeting Intelligence Hub',
    description: 'Automated MoM generation, extraction of actions, decisions, and risks from meetings.',
    primary: true,
  },
  {
    icon: FileText,
    title: 'Executive & PMO Reporting',
    description: 'Auto-generated weekly, monthly, and executive reports with portfolio summaries.',
    primary: true,
  },
  {
    icon: BarChart3,
    title: 'Executive Dashboard',
    description: 'Portfolio health, KPI heatmaps, and risk concentration views for leadership.',
    primary: true,
  },
  {
    icon: Gavel,
    title: 'Decision Log',
    description: 'Capture decisions from meetings with approval workflow and source traceability.',
    primary: true,
  },
  {
    icon: TrendingUp,
    title: 'Strategy View',
    description: 'Strategic pillar alignment, initiative contribution, and high-level ROI indicators.',
    primary: true,
  },
  {
    icon: Shield,
    title: 'Governance & Accountability',
    description: 'Human-in-the-loop enforcement with AI output lifecycle and explainability.',
    primary: true,
  },
];

const integrations = [
  { name: 'Jira', color: 'bg-blue-500' },
  { name: 'M365', color: 'bg-orange-500' },
  { name: 'Teams', color: 'bg-purple-500' },
  { name: 'Outlook', color: 'bg-cyan-500' },
  { name: 'Confluence', color: 'bg-blue-600' },
  { name: 'Slack', color: 'bg-pink-500' },
];

const howItWorks = [
  {
    step: '01',
    title: 'Observe',
    description: 'Connect to your existing delivery systems—Jira, M365, email, meetings—without replacing them.',
    icon: Eye,
  },
  {
    step: '02',
    title: 'Analyze',
    description: 'AI converts meetings and delivery signals into structured intelligence with full explainability.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Decide',
    description: 'Executives and PMO receive approved, auditable intelligence. Humans remain accountable.',
    icon: Gavel,
  },
];

const principles = [
  { icon: Brain, text: 'AI assists preparation and analysis' },
  { icon: Users, text: 'Humans approve, decide, and remain accountable' },
  { icon: Lock, text: 'No autonomous decision-making' },
  { icon: Shield, text: 'Every AI output has Draft → Reviewed → Approved lifecycle' },
];

const testRoles = [
  { id: 'executive', label: 'Executive', description: 'Portfolio overview, strategic dashboards, AI summaries' },
  { id: 'pmo', label: 'PMO', description: 'Cross-project reporting, governance, resource management' },
  { id: 'program_manager', label: 'Program Manager', description: 'Program health, dependencies, milestone tracking' },
  { id: 'project_manager', label: 'Project Manager', description: 'Project delivery, team coordination, risk tracking' },
];

const Landing = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('executive');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ 
      title: 'Request Submitted!', 
      description: `We'll set up your ${testRoles.find(r => r.id === selectedRole)?.label} demo access and contact you at ${email}.` 
    });
    setEmail('');
    setName('');
    setIsSubmitting(false);
  };

  // Generate particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 20}s`,
    duration: `${15 + Math.random() * 20}s`,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground text-lg">Nexus</span>
              <span className="text-muted-foreground text-sm ml-1">Project OS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden hero-gradient min-h-[90vh] flex items-center">
        {/* Animated glow orbs */}
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`particle particle-${particle.size}`}
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 nexus-fade-in border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            PMO Intelligence Layer
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 nexus-slide-up">
            Intelligence, Not Execution
            <span className="block nexus-gradient-text mt-2">For PMO & Executives</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 nexus-fade-in" style={{ animationDelay: '0.2s' }}>
            Nexus observes your existing delivery systems and converts meetings and delivery signals 
            into structured intelligence. Supporting decision-making, not replacing your tools.
          </p>

          <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-10 nexus-fade-in" style={{ animationDelay: '0.3s' }}>
            Works alongside <span className="text-foreground font-medium">Jira</span>, <span className="text-foreground font-medium">Microsoft 365</span>, <span className="text-foreground font-medium">Email</span>, and your existing workflows
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 nexus-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 text-lg px-8 py-6 nexus-pulse-glow">
              Request Pilot Access <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/demo')} className="text-lg px-8 py-6 backdrop-blur-sm">
              See Demo
            </Button>
          </div>

          {/* Integration Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 nexus-fade-in" style={{ animationDelay: '0.5s' }}>
            {integrations.map((integration, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <div className={`w-2 h-2 rounded-full ${integration.color}`} />
                <span className="text-sm text-muted-foreground">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Nexus Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Observe → Analyze → Decide. Intelligence layer, not a replacement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <Card className="nexus-card-hover border-border/50 bg-card/50 backdrop-blur-sm text-center">
                  <CardContent className="p-8">
                    <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Intelligence Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Core Intelligence Layer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Primary Value Proposition
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These features define Nexus. Meeting intelligence, executive reporting, 
              decision tracking, and governance enforcement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="nexus-card-hover border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Operating Principles */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Trustworthy AI
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Human Accountability, <br />
                <span className="nexus-gradient-text">AI-Powered Intelligence</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nexus enforces human-in-the-loop governance. AI assists analysis, 
                humans approve and decide. Every AI output follows a controlled lifecycle.
              </p>
              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <principle.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground">{principle.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="nexus-card p-6 col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <GitBranch className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">AI Output Lifecycle</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">Draft</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-xs font-medium text-amber-600">Reviewed</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-xs font-medium text-primary">Approved</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="px-3 py-1 rounded-full bg-success/20 text-xs font-medium text-success">Published</span>
                </div>
              </Card>
              <Card className="nexus-card p-6">
                <div className="text-3xl font-bold text-primary mb-1">Zero</div>
                <p className="text-sm text-muted-foreground">Tool replacement</p>
              </Card>
              <Card className="nexus-card p-6">
                <div className="text-3xl font-bold text-emerald-500 mb-1">100%</div>
                <p className="text-sm text-muted-foreground">Human accountability</p>
              </Card>
              <Card className="nexus-card p-6 col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Full Explainability</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every AI insight shows source, rationale, confidence, and approval status
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Positioning
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nexus vs Traditional PM Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nexus is not another PM tool. It's an intelligence layer that works with your existing tools.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            {/* Header */}
            <div className="grid grid-cols-3 bg-muted/50">
              <div className="p-4 font-semibold text-muted-foreground text-sm border-r border-border">
                Capability
              </div>
              <div className="p-4 font-semibold text-primary text-sm border-r border-border flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Nexus Project OS
              </div>
              <div className="p-4 font-semibold text-muted-foreground text-sm">
                Traditional PM Tools
              </div>
            </div>
            
            {/* Rows */}
            {comparisonData.map((row, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 ${index !== comparisonData.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="p-4 text-sm font-medium text-foreground border-r border-border bg-muted/20">
                  {row.category}
                </div>
                <div className="p-4 text-sm text-foreground border-r border-border flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{row.nexus}</span>
                </div>
                <div className="p-4 text-sm text-muted-foreground flex items-start gap-2">
                  <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Nexus complements Jira, M365, Asana, Monday.com—it doesn't replace them.
          </p>
        </div>
      </section>

      {/* What Nexus Is NOT */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            What Nexus Does <span className="text-muted-foreground">NOT</span> Do
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {[
              'Replace task or email systems',
              'Score or rank individuals',
              'Perform autonomous task assignment',
              'Predict employee performance',
              'Act as a system of record',
              'Make decisions without humans',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 text-destructive" />
                </div>
                <span className="text-foreground text-left">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Demo Form Section */}
      <section id="request-demo" className="py-20 px-6 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Try Nexus
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Request Demo Access
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience Nexus from any perspective. Select a role to see how PMOs, executives, 
              and project managers benefit from the intelligence layer.
            </p>
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                {/* Role Selection */}
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Select Your Role</h3>
                  <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-3">
                    {testRoles.map((role) => (
                      <div key={role.id} className="relative">
                        <RadioGroupItem
                          value={role.id}
                          id={role.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={role.id}
                          className="flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                            border-border hover:border-primary/50 
                            peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                        >
                          <span className="font-medium text-foreground">{role.label}</span>
                          <span className="text-sm text-muted-foreground mt-1">{role.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Form */}
                <div className="p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Your Details</h3>
                  <form onSubmit={handleDemoRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Request Demo Access'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      6-8 week pilot • Limited scope • Clean exit guaranteed
                    </p>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pilot Details */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Time-boxed Access</p>
                <p className="text-xs text-muted-foreground">6-8 week pilot period</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Governed Trial</p>
                <p className="text-xs text-muted-foreground">Full audit trail included</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Role-based Demo</p>
                <p className="text-xs text-muted-foreground">See exactly what you'll use</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Nexus Project OS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Nexus Project OS. Intelligence, not execution.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
