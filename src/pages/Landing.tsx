import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Delivery Signal Processing',
    description: 'Observe Jira, M365, and other delivery systems to convert signals into structured intelligence.',
  },
  {
    icon: Mail,
    title: 'Communication Intelligence',
    description: 'Analyze emails and messages to surface critical decisions, risks, and governance needs.',
  },
  {
    icon: Video,
    title: 'Meeting Intelligence',
    description: 'Transform meeting transcripts into structured decisions, action items, and accountability records.',
  },
  {
    icon: BarChart3,
    title: 'Executive Dashboards',
    description: 'Real-time portfolio intelligence for PMO and executive decision-making.',
  },
  {
    icon: Shield,
    title: 'Risk & Governance',
    description: 'AI-powered risk identification with human accountability enforcement.',
  },
  {
    icon: Users,
    title: 'Stakeholder Intelligence',
    description: 'Track stakeholder engagement and communication patterns across your delivery ecosystem.',
  },
];

const benefits = [
  'Works alongside Jira, M365, and your existing tools',
  'Converts delivery signals into executive insights',
  'Enforces human accountability and governance',
  'AI-generated intelligence reports',
  'Supports PMO and executive decision-making',
  'No replacement of existing workflows',
];

const Landing = () => {
  const navigate = useNavigate();

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

      {/* Hero Section with Animations */}
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
            Intelligence Layer for
            <span className="block nexus-gradient-text mt-2">PMO & Executives</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 nexus-fade-in" style={{ animationDelay: '0.2s' }}>
            Nexus observes your existing delivery systems—Jira, M365, email—and converts meetings and 
            delivery signals into structured intelligence. Supporting decision-making, not replacing your tools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 nexus-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 text-lg px-8 py-6 nexus-pulse-glow">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/demo')} className="text-lg px-8 py-6 backdrop-blur-sm">
              See Demo
            </Button>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative nexus-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="nexus-glass rounded-2xl p-2 mx-auto max-w-5xl border border-border/50 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-shadow duration-500">
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="h-8 bg-muted/50 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="p-6 grid grid-cols-3 gap-4 min-h-[300px]">
                  <div className="col-span-1 space-y-3">
                    <div className="h-8 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-6 bg-muted/20 rounded-lg w-3/4" />
                    <div className="h-6 bg-primary/20 rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="h-6 bg-muted/20 rounded-lg w-2/3" />
                    <div className="h-6 bg-muted/20 rounded-lg w-4/5" />
                  </div>
                  <div className="col-span-2 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1 h-24 bg-muted/20 rounded-xl" />
                      <div className="flex-1 h-24 bg-muted/20 rounded-xl animate-pulse" style={{ animationDelay: '1s' }} />
                      <div className="flex-1 h-24 bg-primary/10 rounded-xl" />
                    </div>
                    <div className="h-32 bg-muted/10 rounded-xl" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-muted/20 rounded-xl" />
                      <div className="h-16 bg-primary/10 rounded-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Observe. Analyze. Decide.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nexus doesn't replace Jira, email, or task systems. It sits above them—converting 
              delivery signals into actionable intelligence for PMO and executives.
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

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Human Accountability, <br />
                <span className="nexus-gradient-text">AI-Powered Intelligence</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nexus enforces governance and accountability while AI converts your delivery 
                signals into structured intelligence for executive decision-making.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="nexus-card p-6 col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-foreground">Delivery Signal Processing</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Jira updates, emails, and meeting notes converted into structured executive intelligence
                </p>
              </Card>
              <Card className="nexus-card p-6">
                <div className="text-3xl font-bold text-primary mb-1">Zero</div>
                <p className="text-sm text-muted-foreground">Tool replacement</p>
              </Card>
              <Card className="nexus-card p-6">
                <div className="text-3xl font-bold text-emerald-500 mb-1">100%</div>
                <p className="text-sm text-muted-foreground">Accountability</p>
              </Card>
              <Card className="nexus-card p-6 col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Intelligence Reports</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-generated insights from your delivery ecosystem for PMO and executive review
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Add Intelligence to Your PMO?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Keep your existing tools. Add the intelligence layer that executives and PMOs need.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 text-lg px-8 py-6">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Button>
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
            © 2025 Nexus Project OS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
