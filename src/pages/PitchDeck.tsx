import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  Brain, 
  Mail, 
  Calendar, 
  BarChart3, 
  CheckSquare,
  Users,
  FileText,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Globe,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

const PitchDeck = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const slides = [
    // Slide 1: Title
    {
      id: 'title',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Brain className="w-14 h-14 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Nexus Project OS
            </h1>
            <p className="text-2xl text-muted-foreground">
              The AI-First Project Management Operating System
            </p>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Consolidating Communication, Strategy, and Execution into a Single Point of Work
          </p>
        </div>
      )
    },
    // Slide 2: Problem
    {
      id: 'problem',
      content: (
        <div className="flex flex-col h-full p-8">
          <h2 className="text-4xl font-bold text-foreground mb-8">The Problem</h2>
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">Context Switching</h3>
              <p className="text-muted-foreground">Project managers juggle 5-10 different tools daily: emails, spreadsheets, presentations, and multiple PMO platforms.</p>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">Manual Work Overload</h3>
              <p className="text-muted-foreground">Hours spent on status reports, meeting minutes, and routine administrative tasks that could be automated.</p>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">Scattered Information</h3>
              <p className="text-muted-foreground">Critical project data lives in silos, making it hard to get a unified view of portfolio health.</p>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">Reactive Management</h3>
              <p className="text-muted-foreground">Without AI-powered insights, teams react to problems instead of preventing them.</p>
            </div>
          </div>
        </div>
      )
    },
    // Slide 3: Solution
    {
      id: 'solution',
      content: (
        <div className="flex flex-col h-full p-8">
          <h2 className="text-4xl font-bold text-foreground mb-8">Our Solution</h2>
          <div className="flex-1 flex items-center">
            <div className="grid grid-cols-3 gap-8 w-full">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold">AI-Powered</h3>
                <p className="text-muted-foreground">Intelligent automation that analyzes, extracts, and generates insights from all your project data.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Unified Workspace</h3>
                <p className="text-muted-foreground">One platform for emails, meetings, tasks, documents, and strategy—no more context switching.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Proactive Insights</h3>
                <p className="text-muted-foreground">Predict risks, assess sentiment, and prioritize escalations before they become problems.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 4: Key Features
    {
      id: 'features',
      content: (
        <div className="flex flex-col h-full p-8">
          <h2 className="text-4xl font-bold text-foreground mb-8">Core Features</h2>
          <div className="grid grid-cols-3 gap-4 flex-1">
            {[
              { icon: Mail, title: 'Smart Inbox', desc: 'AI sentiment analysis, task extraction, smart replies' },
              { icon: Calendar, title: 'Meeting Hub', desc: 'Auto-generate minutes, decisions, action items' },
              { icon: BarChart3, title: 'Executive Dashboard', desc: 'Real-time KPIs and portfolio health' },
              { icon: CheckSquare, title: 'Task Board', desc: 'Kanban with AI-generated tasks' },
              { icon: Target, title: 'Strategy View', desc: 'ROI tracking, budget analysis' },
              { icon: Users, title: 'Stakeholder Management', desc: 'Influence mapping, communication plans' },
              { icon: FileText, title: 'Auto Reports', desc: 'AI-powered status report generation' },
              { icon: Globe, title: 'Multi-Language', desc: 'English & Arabic with RTL support' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Row-level security, encryption' },
            ].map((feature, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-2">
                <feature.icon className="w-8 h-8 text-primary" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // Slide 5: AI Integration
    {
      id: 'ai',
      content: (
        <div className="flex flex-col h-full p-8">
          <h2 className="text-4xl font-bold text-foreground mb-8">AI at the Core</h2>
          <div className="flex-1 flex items-center">
            <div className="w-full">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Powered by Google Gemini</h3>
                    <p className="text-muted-foreground">Advanced AI capabilities built into every feature</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  'Sentiment Analysis',
                  'Task Extraction',
                  'Report Generation',
                  'Risk Prediction',
                  'Smart Replies',
                  'Meeting Summaries',
                  'Priority Scoring',
                  'Content Generation'
                ].map((capability, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4 text-center">
                    <p className="font-medium">{capability}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 6: Competitive Advantage
    {
      id: 'competitive',
      content: (
        <div className="flex flex-col h-full p-8">
          <h2 className="text-4xl font-bold text-foreground mb-8">Why Nexus Wins</h2>
          <div className="flex-1">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 text-left font-semibold">Feature</th>
                    <th className="p-4 text-center font-semibold text-primary">Nexus</th>
                    <th className="p-4 text-center font-semibold text-muted-foreground">Jira</th>
                    <th className="p-4 text-center font-semibold text-muted-foreground">Asana</th>
                    <th className="p-4 text-center font-semibold text-muted-foreground">Monday</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['AI Sentiment Analysis', true, false, false, false],
                    ['Auto Task Extraction', true, false, false, false],
                    ['Meeting Minutes Generation', true, false, false, false],
                    ['Smart Email Replies', true, false, false, false],
                    ['Integrated Communication Hub', true, false, false, true],
                    ['Executive Dashboard', true, true, true, true],
                    ['Multi-Language (RTL)', true, true, false, true],
                  ].map(([feature, ...values], i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="p-4">{feature}</td>
                      {values.map((v, j) => (
                        <td key={j} className="p-4 text-center">
                          {v ? (
                            <span className="text-emerald-500 text-xl">✓</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    // Slide 7: Roadmap
    {
      id: 'roadmap',
      content: (
        <div className="flex flex-col h-full p-8">
          <h2 className="text-4xl font-bold text-foreground mb-8">Product Roadmap</h2>
          <div className="flex-1 flex items-center">
            <div className="w-full space-y-6">
              {[
                { phase: 'Q1 2025', title: 'Foundation', items: ['Core platform launch', 'Smart Inbox', 'Meeting Hub', 'Task Board'] },
                { phase: 'Q2 2025', title: 'Integration', items: ['Gmail/Outlook sync', 'Jira & Slack integration', 'Google Drive sync'] },
                { phase: 'Q3 2025', title: 'Intelligence', items: ['Advanced AI analytics', 'Predictive risk scoring', 'Custom report builder'] },
                { phase: 'Q4 2025', title: 'Scale', items: ['Mobile app', 'Real-time collaboration', 'Enterprise SSO'] },
              ].map((phase, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div className="w-28 flex-shrink-0">
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      {phase.phase}
                    </span>
                  </div>
                  <div className="flex-1 bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{phase.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {phase.items.map((item, j) => (
                        <span key={j} className="px-2 py-1 bg-muted rounded text-sm">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    // Slide 8: CTA
    {
      id: 'cta',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Brain className="w-14 h-14 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-5xl font-bold text-foreground mb-4">
              Ready to Transform Your Project Management?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the future of AI-powered project management with Nexus Project OS
            </p>
          </div>
          <div className="flex gap-4">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Schedule Demo
            </Button>
          </div>
          <p className="text-muted-foreground">
            contact@nexusprojectos.com
          </p>
        </div>
      )
    },
  ];

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const slideElements = document.querySelectorAll('.pitch-slide');
      
      for (let i = 0; i < slideElements.length; i++) {
        const slide = slideElements[i] as HTMLElement;
        const canvas = await html2canvas(slide, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save('Nexus-Project-OS-Pitch-Deck.pdf');
      toast({ title: 'PDF exported successfully!' });
    } catch (error) {
      toast({ title: 'Export failed', description: 'Please try again', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="font-semibold">Pitch Deck</h1>
        <Button onClick={handleExportPDF} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      </header>

      {/* Slide Display */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <div 
          className="pitch-slide w-full max-w-5xl aspect-video bg-background rounded-2xl shadow-2xl border border-border overflow-hidden"
        >
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Hidden slides for PDF export */}
      <div className="fixed -left-[9999px] top-0">
        {slides.map((slide, i) => (
          <div 
            key={i} 
            className="pitch-slide w-[1280px] h-[720px] bg-background"
            style={{ backgroundColor: 'hsl(var(--background))' }}
          >
            {slide.content}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <footer className="flex items-center justify-between p-4 border-t border-border bg-card">
        <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === currentSlide ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>
        <Button variant="outline" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </footer>
    </div>
  );
};

export default PitchDeck;
