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
  Download,
  DollarSign,
  Rocket,
  Building2,
  Award,
  PieChart,
  LineChart,
  Layers,
  Lock,
  CheckCircle2,
  ArrowUpRight,
  Briefcase,
  CircleDollarSign,
  AlertTriangle,
  Network
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
    // Slide 1: Title / Cover
    {
      id: 'title',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 md:space-y-6 p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/25">
            <Brain className="w-10 h-10 md:w-16 md:h-16 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2 md:mb-4">
              Masira
            </h1>
            <p className="text-xl md:text-3xl text-foreground font-medium">
              PMO Intelligence Layer
            </p>
          </div>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl px-4">
            Transforming Project Chaos into Executive Clarity
          </p>
          <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground mt-4">
            <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-medium">Series A</span>
            <span>•</span>
            <span>$8M Raise</span>
            <span>•</span>
            <span>January 2026</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground/60 absolute bottom-4">
            CONFIDENTIAL - FOR INVESTOR USE ONLY
          </p>
        </div>
      )
    },
    
    // Slide 2: The Problem
    {
      id: 'problem',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-destructive" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">The $1.5T Problem</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 md:p-5">
              <div className="text-3xl md:text-4xl font-bold text-destructive mb-2">67%</div>
              <p className="text-sm md:text-base text-muted-foreground">of enterprise projects fail or underperform</p>
              <p className="text-xs text-muted-foreground/60 mt-1">— PMI Pulse of the Profession 2024</p>
            </div>
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 md:p-5">
              <div className="text-3xl md:text-4xl font-bold text-destructive mb-2">40%+</div>
              <p className="text-sm md:text-base text-muted-foreground">of PM time spent on status reports & admin</p>
              <p className="text-xs text-muted-foreground/60 mt-1">— McKinsey Project Management Survey</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 flex-1">
            {[
              { icon: Mail, title: 'Tool Fragmentation', desc: '5-8 tools daily', stat: '$15K/PM/yr' },
              { icon: FileText, title: 'Manual Reporting', desc: 'Status report hell', stat: '8hrs/week' },
              { icon: Users, title: 'Information Silos', desc: 'Scattered data', stat: '2.5hrs finding info' },
              { icon: Target, title: 'Reactive Management', desc: 'No early warning', stat: '60% preventable' },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-3 md:p-4 flex flex-col">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-destructive mb-2" />
                <h3 className="font-semibold text-xs md:text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mb-auto">{item.desc}</p>
                <p className="text-sm md:text-base font-bold text-destructive mt-2">{item.stat}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // Slide 3: Market Opportunity (TAM/SAM/SOM)
    {
      id: 'market',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <PieChart className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">Market Opportunity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-5 md:p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-1">$15.7B</div>
              <div className="text-lg md:text-xl font-semibold text-foreground">TAM</div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">Global Project Management Software + AI Analytics</p>
              <p className="text-xs text-muted-foreground/60 mt-1">CAGR: 15.4%</p>
            </div>
            <div className="relative bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 md:p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-1">$4.2B</div>
              <div className="text-lg md:text-xl font-semibold text-foreground">SAM</div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">Enterprise PMO Intelligence (500+ employees)</p>
              <p className="text-xs text-muted-foreground/60 mt-1">MENA + Global Enterprise</p>
            </div>
            <div className="relative bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/20 rounded-2xl p-5 md:p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-1">$420M</div>
              <div className="text-lg md:text-xl font-semibold text-foreground">SOM</div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">Year 5 Target: 10% SAM Capture</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Initial: Saudi + UAE</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 md:p-5">
            <h3 className="font-semibold text-sm md:text-base mb-3">Why Now?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {[
                { title: 'AI Maturity', desc: 'LLMs now production-ready' },
                { title: 'Vision 2030', desc: '$1.1T Saudi investment' },
                { title: 'Remote Work', desc: 'PMO visibility critical' },
                { title: 'Tool Fatigue', desc: 'Consolidation demand' },
              ].map((item, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs md:text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Solution Overview
    {
      id: 'solution',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Layers className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">The Solution</h2>
          </div>
          
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-4xl">
            <span className="text-foreground font-semibold">Masira</span> is an intelligence layer that sits atop your existing tools—
            <span className="text-primary font-medium"> observing</span>, <span className="text-primary font-medium">consolidating</span>, and <span className="text-primary font-medium">surfacing</span> insights for executives.
          </p>

          <div className="flex-1 flex flex-col gap-3 md:gap-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">1</div>
                <h3 className="text-lg md:text-xl font-semibold">Core Intelligence</h3>
                <span className="px-2 py-0.5 bg-primary/20 rounded text-xs text-primary font-medium ml-auto">PMF Layer</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Meeting Intelligence Hub', 'Executive Dashboard', 'Decision Log', 'Auto-Generated Reports', 'Strategy View'].map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-background rounded-full text-xs md:text-sm">{f}</span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-500">2</div>
                <h3 className="text-lg md:text-xl font-semibold">Operational Support</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Task Board', 'Documents & Templates', 'Stakeholder Management', 'Calendar View', 'Team Management'].map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-background rounded-full text-xs md:text-sm">{f}</span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-lg font-bold text-amber-500">3</div>
                <h3 className="text-lg md:text-xl font-semibold">Experience & Signal</h3>
                <span className="px-2 py-0.5 bg-amber-500/20 rounded text-xs text-amber-600 font-medium ml-auto">Governed AI</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Smart Inbox', 'Risk Prediction', 'Enterprise Signals (SESE)', 'AI Chat', 'Weekly Digest'].map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-background rounded-full text-xs md:text-sm">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Product Demo / Key Features
    {
      id: 'features',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">AI-Powered Features</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 flex-1">
            {[
              { icon: Calendar, title: 'Meeting Intelligence', desc: 'Paste transcript → Get decisions, actions, summaries in 30s', metric: '70% faster' },
              { icon: Mail, title: 'Smart Inbox', desc: 'AI sentiment analysis, escalation scoring, task extraction', metric: '60% email time saved' },
              { icon: BarChart3, title: 'Executive Dashboard', desc: 'Real-time KPIs, portfolio health, budget tracking', metric: '<2s load' },
              { icon: FileText, title: 'Auto Reports', desc: 'One-click status reports with approval workflow', metric: '80% reporting time cut' },
              { icon: AlertTriangle, title: 'Risk Prediction', desc: 'Evidence-based risk scoring from delivery signals', metric: '50% earlier detection' },
              { icon: Network, title: 'Enterprise Signals', desc: 'Early warning system across projects & communication', metric: 'Proactive alerts' },
              { icon: CheckSquare, title: 'Task Extraction', desc: 'Auto-generate tasks from emails & meetings', metric: 'Zero manual entry' },
              { icon: Users, title: 'Stakeholder Mapping', desc: 'Influence matrix with communication planning', metric: 'Full visibility' },
              { icon: Globe, title: 'EN/AR RTL Support', desc: 'Full Arabic support with RTL layouts', metric: 'MENA Ready' },
            ].map((feature, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-3 md:p-4 flex flex-col hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <span className="text-xs px-2 py-0.5 bg-primary/10 rounded text-primary font-medium">{feature.metric}</span>
                </div>
                <h3 className="font-semibold text-sm md:text-base">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // Slide 6: Competitive Landscape
    {
      id: 'competitive',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Award className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">Competitive Moat</h2>
          </div>

          <div className="flex-1 overflow-x-auto mb-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden min-w-[600px]">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-2 md:p-3 text-left font-semibold">Capability</th>
                    <th className="p-2 md:p-3 text-center font-semibold text-primary">Masira</th>
                    <th className="p-2 md:p-3 text-center font-semibold text-muted-foreground">Jira</th>
                    <th className="p-2 md:p-3 text-center font-semibold text-muted-foreground">Monday</th>
                    <th className="p-2 md:p-3 text-center font-semibold text-muted-foreground">Asana</th>
                    <th className="p-2 md:p-3 text-center font-semibold text-muted-foreground">MS Project</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Intelligence Layer (not replacement)', true, false, false, false, false],
                    ['Meeting Transcript → Intelligence', true, false, false, false, false],
                    ['AI Sentiment & Escalation', true, false, false, false, false],
                    ['Auto Task Extraction', true, false, false, false, false],
                    ['Executive-First UX', true, false, false, false, true],
                    ['Arabic RTL Native', true, false, false, false, false],
                    ['Human-in-the-Loop AI', true, false, false, false, false],
                    ['Enterprise RLS Security', true, true, true, true, true],
                  ].map(([feature, ...values], i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-2 md:p-3 font-medium">{feature}</td>
                      {values.map((v, j) => (
                        <td key={j} className="p-2 md:p-3 text-center">
                          {v ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            </span>
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

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 md:p-5">
            <h3 className="font-semibold text-sm md:text-base mb-2">Key Differentiator</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              <span className="text-foreground font-semibold">We don't compete—we complement.</span> Masira observes Jira, Azure DevOps, ServiceNow, and M365 to provide a unified intelligence layer for executives.
            </p>
          </div>
        </div>
      )
    },

    // Slide 7: Business Model
    {
      id: 'business-model',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">Business Model</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6 flex-1">
            <div className="bg-card border border-border rounded-xl p-4 md:p-5 flex flex-col">
              <div className="text-xs font-medium text-muted-foreground mb-2">STARTER</div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">$15<span className="text-lg font-normal">/user/mo</span></div>
              <p className="text-xs text-muted-foreground mb-4">Billed annually</p>
              <ul className="space-y-2 text-xs md:text-sm flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Meeting Hub</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Dashboard</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Basic Reports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 5 users included</li>
              </ul>
              <div className="text-xs text-muted-foreground mt-4">Best for: Small PMO teams</div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-xl p-4 md:p-5 flex flex-col relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-medium">MOST POPULAR</div>
              <div className="text-xs font-medium text-primary mb-2">PROFESSIONAL</div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">$35<span className="text-lg font-normal">/user/mo</span></div>
              <p className="text-xs text-muted-foreground mb-4">Billed annually</p>
              <ul className="space-y-2 text-xs md:text-sm flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Smart Inbox + AI</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Risk Prediction</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Jira/ADO Integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 25 users included</li>
              </ul>
              <div className="text-xs text-muted-foreground mt-4">Best for: Growing enterprises</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 md:p-5 flex flex-col">
              <div className="text-xs font-medium text-muted-foreground mb-2">ENTERPRISE</div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">Custom</div>
              <p className="text-xs text-muted-foreground mb-4">Annual contract</p>
              <ul className="space-y-2 text-xs md:text-sm flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> White-label branding</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> SSO/SAML</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Private VNet deploy</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Dedicated support</li>
              </ul>
              <div className="text-xs text-muted-foreground mt-4">Best for: Large enterprises</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {[
              { label: 'Target ACV', value: '$50K-$250K' },
              { label: 'Gross Margin', value: '85%+' },
              { label: 'LTV:CAC Target', value: '4:1' },
              { label: 'NDR Target', value: '120%+' },
            ].map((item, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg md:text-xl font-bold text-primary">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // Slide 8: Traction & Validation
    {
      id: 'traction',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">Traction & Validation</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            {[
              { value: '3', label: 'Enterprise Pilots', icon: Building2 },
              { value: '$180K', label: 'Pipeline (LOIs)', icon: DollarSign },
              { value: '94%', label: 'Pilot NPS', icon: Award },
              { value: '2.5x', label: 'Time Savings', icon: Zap },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 md:p-5 text-center">
                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{item.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4 md:p-5 mb-4">
            <h3 className="font-semibold text-sm md:text-base mb-3">Pilot Customers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'Saudi Mega Project', sector: 'Construction', users: '150+ PMs', status: 'Active Pilot' },
                { name: 'Regional Bank', sector: 'Financial Services', users: '80+ PMs', status: 'LOI Signed' },
                { name: 'Government Ministry', sector: 'Public Sector', users: '200+ PMs', status: 'In Discussions' },
              ].map((customer, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3">
                  <div className="font-semibold text-sm">{customer.name}</div>
                  <div className="text-xs text-muted-foreground">{customer.sector} • {customer.users}</div>
                  <div className="mt-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 rounded text-xs text-emerald-600 font-medium">{customer.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-sm md:text-base italic text-muted-foreground">
              "Masira cut our weekly reporting time from 8 hours to 45 minutes. The meeting intelligence alone justified the pilot."
            </p>
            <p className="text-xs mt-2 text-foreground font-medium">— PMO Director, Saudi Mega Project</p>
          </div>
        </div>
      )
    },

    // Slide 9: Go-to-Market Strategy
    {
      id: 'gtm',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Rocket className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">Go-to-Market Strategy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
            <div className="bg-card border border-border rounded-xl p-4 md:p-5">
              <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Land Strategy
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">1</span>
                  <span><strong>Target:</strong> Saudi Vision 2030 mega projects (Neom, Red Sea, Qiddiya)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">2</span>
                  <span><strong>Entry Point:</strong> PMO/Exec pain = reporting burden</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">3</span>
                  <span><strong>Hook:</strong> Meeting Intelligence = immediate ROI demo</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 md:p-5">
              <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Expand Strategy
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-500 shrink-0 mt-0.5">1</span>
                  <span><strong>Dept → Enterprise:</strong> PMO pilot → Full rollout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-500 shrink-0 mt-0.5">2</span>
                  <span><strong>Feature Upsell:</strong> Layer 2 → Layer 3 features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-500 shrink-0 mt-0.5">3</span>
                  <span><strong>Geo Expansion:</strong> Saudi → UAE → GCC → Global</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 md:p-5">
            <h3 className="font-semibold text-sm md:text-base mb-3">Sales Motion</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { stage: 'Awareness', tactic: 'PMO conferences, LinkedIn, Content', time: 'Week 1-2' },
                { stage: 'Discovery', tactic: 'Meeting Intel demo, pain mapping', time: 'Week 3-4' },
                { stage: 'Pilot', tactic: '30-day POC with 10-20 users', time: 'Week 5-8' },
                { stage: 'Close', tactic: 'ROI report, exec sponsorship', time: 'Week 9-12' },
              ].map((item, i) => (
                <div key={i} className="bg-background rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                  <div className="font-semibold text-sm mt-1">{item.stage}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.tactic}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Financial Projections
    {
      id: 'financials',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <LineChart className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">Financial Projections</h2>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden mb-4 flex-1">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-2 md:p-3 text-left font-semibold">Metric</th>
                  <th className="p-2 md:p-3 text-center font-semibold">2026</th>
                  <th className="p-2 md:p-3 text-center font-semibold">2027</th>
                  <th className="p-2 md:p-3 text-center font-semibold">2028</th>
                  <th className="p-2 md:p-3 text-center font-semibold">2029</th>
                  <th className="p-2 md:p-3 text-center font-semibold">2030</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 md:p-3 font-medium">ARR</td>
                  <td className="p-2 md:p-3 text-center">$600K</td>
                  <td className="p-2 md:p-3 text-center">$2.4M</td>
                  <td className="p-2 md:p-3 text-center">$8M</td>
                  <td className="p-2 md:p-3 text-center">$22M</td>
                  <td className="p-2 md:p-3 text-center font-bold text-primary">$50M</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 md:p-3 font-medium">Customers</td>
                  <td className="p-2 md:p-3 text-center">5</td>
                  <td className="p-2 md:p-3 text-center">15</td>
                  <td className="p-2 md:p-3 text-center">40</td>
                  <td className="p-2 md:p-3 text-center">90</td>
                  <td className="p-2 md:p-3 text-center">180</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 md:p-3 font-medium">Avg ACV</td>
                  <td className="p-2 md:p-3 text-center">$120K</td>
                  <td className="p-2 md:p-3 text-center">$160K</td>
                  <td className="p-2 md:p-3 text-center">$200K</td>
                  <td className="p-2 md:p-3 text-center">$245K</td>
                  <td className="p-2 md:p-3 text-center">$280K</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 md:p-3 font-medium">Gross Margin</td>
                  <td className="p-2 md:p-3 text-center">75%</td>
                  <td className="p-2 md:p-3 text-center">80%</td>
                  <td className="p-2 md:p-3 text-center">82%</td>
                  <td className="p-2 md:p-3 text-center">84%</td>
                  <td className="p-2 md:p-3 text-center">85%</td>
                </tr>
                <tr className="border-b border-border bg-emerald-500/5">
                  <td className="p-2 md:p-3 font-medium">YoY Growth</td>
                  <td className="p-2 md:p-3 text-center">—</td>
                  <td className="p-2 md:p-3 text-center text-emerald-500 font-semibold">300%</td>
                  <td className="p-2 md:p-3 text-center text-emerald-500 font-semibold">233%</td>
                  <td className="p-2 md:p-3 text-center text-emerald-500 font-semibold">175%</td>
                  <td className="p-2 md:p-3 text-center text-emerald-500 font-semibold">127%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Path to Profitability', value: 'Y4 (2029)' },
              { label: 'Burn Multiple Target', value: '<2.0x' },
              { label: 'CAC Payback', value: '<12 months' },
              { label: '5-Year Revenue', value: '$83M cumulative' },
            ].map((item, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg md:text-xl font-bold text-primary">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // Slide 11: Team
    {
      id: 'team',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">The Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 flex-1">
            {[
              { 
                name: 'CEO / Founder', 
                role: 'Chief Executive Officer',
                bg: ['15+ years enterprise software', 'Ex-McKinsey Digital', 'Built & sold 2 SaaS companies', 'Deep MENA relationships']
              },
              { 
                name: 'CTO / Co-Founder', 
                role: 'Chief Technology Officer',
                bg: ['Ex-Microsoft Principal PM', '10+ years AI/ML experience', 'Led Azure AI team', 'Stanford CS']
              },
              { 
                name: 'CPO', 
                role: 'Chief Product Officer',
                bg: ['Ex-Atlassian Product Lead', 'Built Jira Automation', '8 years PMO tools', 'MENA market expert']
              },
            ].map((member, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 md:p-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-center mb-3">
                  <div className="font-semibold text-base md:text-lg">{member.name}</div>
                  <div className="text-xs text-primary">{member.role}</div>
                </div>
                <ul className="space-y-1.5">
                  {member.bg.map((item, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2">Key Hires with Funding</h3>
            <div className="flex flex-wrap gap-2">
              {['VP Sales (MENA)', 'Head of Customer Success', 'Sr. ML Engineers (x2)', 'Enterprise AEs (x3)', 'Solutions Architects (x2)'].map((role, i) => (
                <span key={i} className="px-3 py-1 bg-background rounded-full text-xs">{role}</span>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // Slide 12: The Ask & Use of Funds
    {
      id: 'ask',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">The Ask</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-2xl p-5 md:p-6">
              <div className="text-4xl md:text-6xl font-bold text-primary mb-2">$8M</div>
              <div className="text-lg md:text-xl font-semibold text-foreground mb-1">Series A</div>
              <p className="text-sm text-muted-foreground mb-4">18-month runway to $8M ARR</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Pre-money valuation:</span><span className="font-semibold">$32M</span></div>
                <div className="flex justify-between"><span>Post-money valuation:</span><span className="font-semibold">$40M</span></div>
                <div className="flex justify-between"><span>Equity offered:</span><span className="font-semibold">20%</span></div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 md:p-5">
              <h3 className="font-semibold text-base md:text-lg mb-4">Use of Funds</h3>
              <div className="space-y-3">
                {[
                  { category: 'Engineering & Product', pct: 45, amount: '$3.6M', desc: 'AI/ML, integrations, mobile' },
                  { category: 'Sales & Marketing', pct: 35, amount: '$2.8M', desc: 'GTM, enterprise sales' },
                  { category: 'Operations & G&A', pct: 15, amount: '$1.2M', desc: 'Infrastructure, legal' },
                  { category: 'Reserve', pct: 5, amount: '$0.4M', desc: 'Buffer for opportunities' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-muted-foreground">{item.amount} ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2">Key Milestones with Funding</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { milestone: '10 Enterprise Customers', timeline: 'Q2 2026' },
                { milestone: '$2M ARR', timeline: 'Q4 2026' },
                { milestone: 'UAE Market Launch', timeline: 'Q1 2027' },
                { milestone: '$8M ARR', timeline: 'Q2 2027' },
              ].map((item, i) => (
                <div key={i} className="bg-background rounded-lg p-3 text-center">
                  <div className="text-xs text-primary font-medium">{item.timeline}</div>
                  <div className="text-sm font-semibold mt-1">{item.milestone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // Slide 13: Investment Thesis
    {
      id: 'thesis',
      content: (
        <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">Why Invest in Masira</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {[
              { 
                icon: Target,
                title: 'Massive Market, Timing is Now', 
                points: ['$15.7B TAM growing 15% CAGR', 'AI finally production-ready for enterprise', 'Vision 2030 = $1.1T in projects'] 
              },
              { 
                icon: Shield,
                title: 'Defensible Differentiation', 
                points: ['Intelligence layer vs replacement', 'Meeting-first entry (no competitor)', 'MENA-native with Arabic RTL'] 
              },
              { 
                icon: TrendingUp,
                title: 'Attractive Unit Economics', 
                points: ['85%+ gross margins (SaaS + AI)', 'Land & expand model (120% NDR target)', 'Enterprise ACV $120K-$250K'] 
              },
              { 
                icon: Users,
                title: 'Proven Team, Deep Domain', 
                points: ['Founders built & sold enterprise SaaS', 'Ex-Microsoft, Atlassian, McKinsey', 'Strong MENA relationships & trust'] 
              },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 md:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg">{item.title}</h3>
                </div>
                <ul className="space-y-2">
                  {item.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
            <p className="text-sm md:text-base text-center">
              <span className="font-semibold text-foreground">Exit Potential:</span>{' '}
              <span className="text-muted-foreground">Strategic acquirers include Microsoft, Atlassian, ServiceNow, SAP • 8-12x revenue multiples for AI-first enterprise SaaS</span>
            </p>
          </div>
        </div>
      )
    },

    // Slide 14: Thank You / CTA
    {
      id: 'cta',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 md:space-y-6 p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/25">
            <Brain className="w-10 h-10 md:w-16 md:h-16 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-2 md:mb-4">
              Let's Transform PMO Intelligence
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join us in building the intelligence layer that empowers 10M+ project managers worldwide
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4">
            <Button size="lg" className="text-base md:text-lg px-6 md:px-8">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Deep Dive
            </Button>
            <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              View Live Demo
            </Button>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-sm md:text-base font-medium text-foreground">founders@masira.ai</p>
            <p className="text-sm text-muted-foreground">Riyadh, Saudi Arabia • Dubai, UAE</p>
          </div>

          <p className="text-xs text-muted-foreground/60 absolute bottom-4">
            CONFIDENTIAL - FOR INVESTOR USE ONLY
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
      
      pdf.save('Masira-Investor-Pitch-Deck.pdf');
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
      <header className="flex items-center justify-between p-3 md:p-4 border-b border-border bg-card">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-sm md:text-base">Masira — Investor Pitch Deck</h1>
        </div>
        <Button size="sm" onClick={handleExportPDF} disabled={isExporting}>
          <Download className="w-4 h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
        </Button>
      </header>

      {/* Slide Display */}
      <div className="flex-1 flex items-center justify-center p-2 md:p-8 bg-muted/30 overflow-hidden">
        <div 
          className="pitch-slide w-full max-w-5xl aspect-[4/3] md:aspect-video bg-background rounded-xl md:rounded-2xl shadow-2xl border border-border overflow-auto"
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
      <footer className="flex items-center justify-between p-3 md:p-4 border-t border-border bg-card">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        
        {/* Slide indicators */}
        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto px-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all flex-shrink-0",
                i === currentSlide 
                  ? "bg-primary w-4 md:w-6" 
                  : "bg-muted hover:bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-xs md:text-sm text-muted-foreground">
            {currentSlide + 1} / {slides.length}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1}
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="w-4 h-4 ml-1 md:ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default PitchDeck;
