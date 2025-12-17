import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import nexusLogo from '@/assets/nexus-logo.png';
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
    title: 'AI-Powered Intelligence',
    description: 'Automatically analyze emails, meetings, and documents to extract tasks and predict risks.',
  },
  {
    icon: Mail,
    title: 'Smart Inbox',
    description: 'Unified inbox with sentiment analysis, priority scoring, and one-click task extraction.',
  },
  {
    icon: Video,
    title: 'Meeting Hub',
    description: 'Transform meeting transcripts into structured summaries, decisions, and action items.',
  },
  {
    icon: BarChart3,
    title: 'Strategic Dashboards',
    description: 'Real-time KPIs, portfolio health tracking, and budget vs. actuals visualization.',
  },
  {
    icon: Shield,
    title: 'Risk Prediction',
    description: 'AI identifies potential project delays and recommends mitigation strategies.',
  },
  {
    icon: Users,
    title: 'Stakeholder Management',
    description: 'Track stakeholder influence, communication plans, and engagement history.',
  },
];

const benefits = [
  'Eliminate context switching between tools',
  'Reduce administrative work by 60%',
  'AI-generated weekly status reports',
  'Unified view of all project communications',
  'Automated task extraction from emails',
  'Real-time collaboration features',
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={nexusLogo} alt="Nexus Logo" className="w-10 h-10 rounded-xl" />
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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 nexus-fade-in">
            <Sparkles className="w-4 h-4" />
            AI-First Project Management
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 nexus-slide-up">
            Your Single Point of
            <span className="block nexus-gradient-text">Project Intelligence</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 nexus-fade-in">
            Nexus consolidates communication, strategy, and execution into one AI-powered workspace. 
            Let AI handle the administrative work while you focus on decisions that matter.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 nexus-fade-in">
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 text-lg px-8 py-6">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/features')} className="text-lg px-8 py-6">
              View Features
            </Button>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="nexus-glass rounded-2xl p-2 mx-auto max-w-5xl border border-border/50 shadow-2xl shadow-primary/10">
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="h-8 bg-muted/50 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="p-6 grid grid-cols-3 gap-4 min-h-[300px]">
                  <div className="col-span-1 space-y-3">
                    <div className="h-8 bg-muted/30 rounded-lg" />
                    <div className="h-6 bg-muted/20 rounded-lg w-3/4" />
                    <div className="h-6 bg-primary/20 rounded-lg" />
                    <div className="h-6 bg-muted/20 rounded-lg w-2/3" />
                    <div className="h-6 bg-muted/20 rounded-lg w-4/5" />
                  </div>
                  <div className="col-span-2 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1 h-24 bg-muted/20 rounded-xl" />
                      <div className="flex-1 h-24 bg-muted/20 rounded-xl" />
                      <div className="flex-1 h-24 bg-primary/10 rounded-xl" />
                    </div>
                    <div className="h-32 bg-muted/10 rounded-xl" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-muted/20 rounded-xl" />
                      <div className="h-16 bg-muted/20 rounded-xl" />
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
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop switching between emails, spreadsheets, and multiple PMO tools. 
              Nexus brings it all together with AI-powered automation.
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
                Focus on Strategy, <br />
                <span className="nexus-gradient-text">Not Administration</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nexus uses AI to automatically handle routine tasks, analyze communications, 
                and surface the insights that matter most to your projects.
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
                  <span className="font-medium text-foreground">AI Task Extraction</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Review budget proposal by Friday" automatically converted to task with deadline
                </p>
              </Card>
              <Card className="nexus-card p-6">
                <div className="text-3xl font-bold text-primary mb-1">60%</div>
                <p className="text-sm text-muted-foreground">Less admin work</p>
              </Card>
              <Card className="nexus-card p-6">
                <div className="text-3xl font-bold text-emerald-500 mb-1">3x</div>
                <p className="text-sm text-muted-foreground">Faster decisions</p>
              </Card>
              <Card className="nexus-card p-6 col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Auto-Generated Reports</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Weekly status reports created automatically from your project activity
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
            Ready to Transform Your Project Management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of project managers who've made Nexus their single point of work.
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
            <img src={nexusLogo} alt="Nexus Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-foreground">Nexus Project OS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Nexus Project OS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
