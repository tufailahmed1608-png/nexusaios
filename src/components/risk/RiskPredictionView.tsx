import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  Users,
  DollarSign,
  Target,
  Brain,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  Sparkles,
  Shield,
  Loader2,
  CheckCircle2,
  Zap,
  Eye,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIExplainability, type AIExplanation } from '@/components/ai/AIExplainability';

interface MitigationRecommendation {
  id: number;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  timeToImplement: string;
  resources: string;
}

interface MitigationData {
  summary: string;
  recommendations: MitigationRecommendation[];
  warningSignsToMonitor: string[];
  estimatedDelayReduction: string;
}

interface ProjectRiskWithExplanation {
  id: string;
  name: string;
  riskScore: number;
  delayProbability: number;
  predictedDelay: number;
  confidence: number;
  trend: string;
  factors: { name: string; score: number; impact: string }[];
  historicalRisk: { week: string; score: number }[];
  explanation?: AIExplanation;
}

// Risk prediction data
const initialProjectRisks: ProjectRiskWithExplanation[] = [
  {
    id: '1',
    name: 'Enterprise Platform Migration',
    riskScore: 78,
    delayProbability: 65,
    predictedDelay: 12,
    confidence: 87,
    trend: 'increasing',
    factors: [
      { name: 'Resource Availability', score: 72, impact: 'high' },
      { name: 'Technical Complexity', score: 85, impact: 'critical' },
      { name: 'Scope Creep', score: 45, impact: 'medium' },
      { name: 'Dependencies', score: 68, impact: 'high' },
      { name: 'Budget Constraints', score: 35, impact: 'low' },
    ],
    historicalRisk: [
      { week: 'W1', score: 45 },
      { week: 'W2', score: 52 },
      { week: 'W3', score: 58 },
      { week: 'W4', score: 65 },
      { week: 'W5', score: 72 },
      { week: 'W6', score: 78 },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    riskScore: 42,
    delayProbability: 28,
    predictedDelay: 3,
    confidence: 92,
    trend: 'stable',
    factors: [
      { name: 'Resource Availability', score: 35, impact: 'low' },
      { name: 'Technical Complexity', score: 55, impact: 'medium' },
      { name: 'Scope Creep', score: 40, impact: 'medium' },
      { name: 'Dependencies', score: 30, impact: 'low' },
      { name: 'Budget Constraints', score: 50, impact: 'medium' },
    ],
    historicalRisk: [
      { week: 'W1', score: 48 },
      { week: 'W2', score: 45 },
      { week: 'W3', score: 44 },
      { week: 'W4', score: 42 },
      { week: 'W5', score: 43 },
      { week: 'W6', score: 42 },
    ],
  },
  {
    id: '3',
    name: 'Data Analytics Pipeline',
    riskScore: 25,
    delayProbability: 15,
    predictedDelay: 0,
    confidence: 95,
    trend: 'decreasing',
    factors: [
      { name: 'Resource Availability', score: 20, impact: 'low' },
      { name: 'Technical Complexity', score: 35, impact: 'low' },
      { name: 'Scope Creep', score: 25, impact: 'low' },
      { name: 'Dependencies', score: 28, impact: 'low' },
      { name: 'Budget Constraints', score: 15, impact: 'low' },
    ],
    historicalRisk: [
      { week: 'W1', score: 55 },
      { week: 'W2', score: 48 },
      { week: 'W3', score: 40 },
      { week: 'W4', score: 35 },
      { week: 'W5', score: 30 },
      { week: 'W6', score: 25 },
    ],
  },
  {
    id: '4',
    name: 'Security Compliance Update',
    riskScore: 56,
    delayProbability: 45,
    predictedDelay: 7,
    confidence: 84,
    trend: 'increasing',
    factors: [
      { name: 'Resource Availability', score: 60, impact: 'high' },
      { name: 'Technical Complexity', score: 70, impact: 'high' },
      { name: 'Scope Creep', score: 35, impact: 'low' },
      { name: 'Dependencies', score: 55, impact: 'medium' },
      { name: 'Budget Constraints', score: 45, impact: 'medium' },
    ],
    historicalRisk: [
      { week: 'W1', score: 38 },
      { week: 'W2', score: 42 },
      { week: 'W3', score: 48 },
      { week: 'W4', score: 50 },
      { week: 'W5', score: 53 },
      { week: 'W6', score: 56 },
    ],
  },
];

const portfolioRiskTrend = [
  { date: 'Jan', avgRisk: 42, highRiskProjects: 1, mitigated: 3 },
  { date: 'Feb', avgRisk: 45, highRiskProjects: 2, mitigated: 2 },
  { date: 'Mar', avgRisk: 48, highRiskProjects: 2, mitigated: 4 },
  { date: 'Apr', avgRisk: 44, highRiskProjects: 1, mitigated: 5 },
  { date: 'May', avgRisk: 50, highRiskProjects: 2, mitigated: 3 },
  { date: 'Jun', avgRisk: 52, highRiskProjects: 2, mitigated: 4 },
];

const getRiskColor = (score: number) => {
  if (score >= 70) return 'text-destructive';
  if (score >= 50) return 'text-amber-500';
  return 'text-emerald-500';
};

const getRiskBgColor = (score: number) => {
  if (score >= 70) return 'bg-destructive/20';
  if (score >= 50) return 'bg-amber-500/20';
  return 'bg-emerald-500/20';
};

const getRiskLabel = (score: number) => {
  if (score >= 70) return 'Critical';
  if (score >= 50) return 'At Risk';
  if (score >= 30) return 'Moderate';
  return 'Low';
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'critical': return 'bg-destructive text-destructive-foreground';
    case 'high': return 'bg-amber-500 text-white';
    case 'medium': return 'bg-amber-400/80 text-amber-900';
    default: return 'bg-muted text-muted-foreground';
  }
};

const RiskGauge = ({ score, size = 'large' }: { score: number; size?: 'small' | 'large' }) => {
  const radius = size === 'large' ? 80 : 40;
  const strokeWidth = size === 'large' ? 12 : 6;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  const getGaugeColor = (score: number) => {
    if (score >= 70) return 'stroke-destructive';
    if (score >= 50) return 'stroke-amber-500';
    return 'stroke-emerald-500';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg 
        width={radius * 2 + strokeWidth * 2} 
        height={radius + strokeWidth * 2}
        className="transform -rotate-180"
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${radius * 2 + strokeWidth} ${radius + strokeWidth}`}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${radius * 2 + strokeWidth} ${radius + strokeWidth}`}
          fill="none"
          className={getGaugeColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <span className={cn(
          "font-bold",
          size === 'large' ? 'text-3xl' : 'text-lg',
          getRiskColor(score)
        )}>
          {score}
        </span>
        {size === 'large' && (
          <p className="text-xs text-muted-foreground mt-1">Risk Score</p>
        )}
      </div>
    </div>
  );
};

const TrendIndicator = ({ trend }: { trend: string }) => {
  switch (trend) {
    case 'increasing':
      return (
        <div className="flex items-center gap-1 text-destructive">
          <ArrowUpRight className="h-4 w-4" />
          <span className="text-xs font-medium">Rising</span>
        </div>
      );
    case 'decreasing':
      return (
        <div className="flex items-center gap-1 text-emerald-500">
          <ArrowDownRight className="h-4 w-4" />
          <span className="text-xs font-medium">Falling</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Minus className="h-4 w-4" />
          <span className="text-xs font-medium">Stable</span>
        </div>
      );
  }
};

const RiskPredictionView = () => {
  const { isRTL } = useLanguage();
  const [projectRisks, setProjectRisks] = useState<ProjectRiskWithExplanation[]>(initialProjectRisks);
  const [selectedProject, setSelectedProject] = useState<ProjectRiskWithExplanation>(initialProjectRisks[0]);
  const [mitigationData, setMitigationData] = useState<MitigationData | null>(null);
  const [isGeneratingMitigation, setIsGeneratingMitigation] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const radarData = selectedProject.factors.map(f => ({
    factor: f.name.split(' ')[0],
    score: f.score,
    fullMark: 100,
  }));

  const chartConfig = {
    score: { label: 'Risk Score', color: 'hsl(var(--primary))' },
    avgRisk: { label: 'Avg Risk', color: 'hsl(var(--primary))' },
    highRiskProjects: { label: 'High Risk', color: 'hsl(var(--destructive))' },
    mitigated: { label: 'Mitigated', color: 'hsl(var(--emerald-500))' },
  };

  // Calculate portfolio stats
  const avgPortfolioRisk = Math.round(
    projectRisks.reduce((sum, p) => sum + p.riskScore, 0) / projectRisks.length
  );
  const highRiskCount = projectRisks.filter(p => p.riskScore >= 70).length;
  const atRiskCount = projectRisks.filter(p => p.riskScore >= 50 && p.riskScore < 70).length;

  const generateExplanation = async (project: ProjectRiskWithExplanation) => {
    setIsLoadingExplanation(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-explanation', {
        body: {
          type: 'risk',
          context: {
            projectName: project.name,
            riskScore: project.riskScore,
            delayProbability: project.delayProbability,
            predictedDelay: project.predictedDelay,
            riskFactors: project.factors,
            trend: project.trend,
          },
        },
      });

      if (error) throw error;

      const updatedProject = { ...project, explanation: data };
      setSelectedProject(updatedProject);
      setProjectRisks(prev =>
        prev.map(p => (p.id === project.id ? updatedProject : p))
      );

      toast.success('AI explanation generated');
    } catch (error) {
      console.error('Error generating explanation:', error);
      toast.error('Could not generate AI explanation');
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const generateMitigation = async () => {
    setIsGeneratingMitigation(true);
    setMitigationData(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-risk-mitigation', {
        body: {
          projectName: selectedProject.name,
          riskScore: selectedProject.riskScore,
          delayProbability: selectedProject.delayProbability,
          predictedDelay: selectedProject.predictedDelay,
          riskFactors: selectedProject.factors,
          trend: selectedProject.trend,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setMitigationData(data);
      toast.success('Mitigation recommendations generated');
    } catch (error) {
      console.error('Error generating mitigation:', error);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setIsGeneratingMitigation(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-amber-500 text-white';
      case 'medium': return 'bg-amber-400/80 text-amber-900';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <Zap className="h-4 w-4" />;
      case 'medium': return <Target className="h-4 w-4" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="nexus-fade-in flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Risk Prediction Dashboard</h2>
          </div>
          <p className="text-muted-foreground mt-1">AI-powered risk analysis and delay predictions</p>
        </div>
        <Badge variant="outline" className="gap-1 px-3 py-1">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>AI Powered</span>
        </Badge>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="nexus-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Portfolio Risk</p>
                <p className={cn("text-3xl font-bold mt-1", getRiskColor(avgPortfolioRisk))}>
                  {avgPortfolioRisk}%
                </p>
              </div>
              <div className={cn("p-3 rounded-full", getRiskBgColor(avgPortfolioRisk))}>
                <Gauge className={cn("h-6 w-6", getRiskColor(avgPortfolioRisk))} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Across all active projects</p>
          </CardContent>
        </Card>

        <Card className="nexus-fade-in" style={{ animationDelay: '0.15s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Critical Risk</p>
                <p className="text-3xl font-bold mt-1 text-destructive">{highRiskCount}</p>
              </div>
              <div className="p-3 rounded-full bg-destructive/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Projects need attention</p>
          </CardContent>
        </Card>

        <Card className="nexus-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">At Risk</p>
                <p className="text-3xl font-bold mt-1 text-amber-500">{atRiskCount}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/20">
                <Activity className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Monitoring required</p>
          </CardContent>
        </Card>

        <Card className="nexus-fade-in" style={{ animationDelay: '0.25s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">AI Confidence</p>
                <p className="text-3xl font-bold mt-1 text-primary">89%</p>
              </div>
              <div className="p-3 rounded-full bg-primary/20">
                <Brain className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Model accuracy rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Risk List */}
        <Card className="lg:col-span-1 nexus-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Project Risk Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectRisks.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                  selectedProject.id === project.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{project.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", getRiskBgColor(project.riskScore), getRiskColor(project.riskScore))}
                      >
                        {getRiskLabel(project.riskScore)}
                      </Badge>
                      <TrendIndicator trend={project.trend} />
                    </div>
                  </div>
                  <RiskGauge score={project.riskScore} size="small" />
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Delay Probability</span>
                    <span className={getRiskColor(project.delayProbability)}>{project.delayProbability}%</span>
                  </div>
                  <Progress 
                    value={project.delayProbability} 
                    className="h-1.5"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Selected Project Details */}
        <Card className="lg:col-span-2 nexus-fade-in" style={{ animationDelay: '0.35s' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">{selectedProject.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Detailed risk analysis</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Info className="h-3 w-3" />
                      <span>{selectedProject.confidence}% confidence</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI prediction confidence level</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="factors">Factors</TabsTrigger>
                <TabsTrigger value="trend">Trend</TabsTrigger>
                <TabsTrigger value="explainability" className="gap-1">
                  <Brain className="h-3 w-3" />
                  Why
                </TabsTrigger>
                <TabsTrigger value="mitigation" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Actions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                    <RiskGauge score={selectedProject.riskScore} size="large" />
                    <Badge className={cn("mt-2", getRiskBgColor(selectedProject.riskScore), getRiskColor(selectedProject.riskScore))}>
                      {getRiskLabel(selectedProject.riskScore)}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Predicted Delay</span>
                      </div>
                      <p className={cn("text-2xl font-bold", selectedProject.predictedDelay > 0 ? 'text-amber-500' : 'text-emerald-500')}>
                        {selectedProject.predictedDelay > 0 ? `${selectedProject.predictedDelay} days` : 'On Track'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Target className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Delay Probability</span>
                      </div>
                      <p className={cn("text-2xl font-bold", getRiskColor(selectedProject.delayProbability))}>
                        {selectedProject.delayProbability}%
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Risk Trend</p>
                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedProject.historicalRisk}>
                          <defs>
                            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="hsl(var(--primary))" 
                            fill="url(#riskGradient)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      <TrendIndicator trend={selectedProject.trend} />
                    </div>
                  </div>
                </div>

                {/* Quick Risk Factors */}
                <div className="p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-3">Top Risk Factors</p>
                  <div className="space-y-2">
                    {selectedProject.factors
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs", getImpactColor(factor.impact))}>
                              {factor.impact}
                            </Badge>
                            <span className="text-sm">{factor.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={factor.score} className="w-24 h-2" />
                            <span className={cn("text-sm font-medium w-8", getRiskColor(factor.score))}>
                              {factor.score}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="factors" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64">
                    <ChartContainer config={chartConfig}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="factor" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        />
                        <Radar
                          name="Risk Score"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ChartContainer>
                  </div>

                  <div className="space-y-3">
                    {selectedProject.factors.map((factor, idx) => (
                      <div key={idx} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{factor.name}</span>
                          <Badge className={cn("text-xs", getImpactColor(factor.impact))}>
                            {factor.impact}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={factor.score} className="flex-1 h-2" />
                          <span className={cn("text-sm font-bold w-8", getRiskColor(factor.score))}>
                            {factor.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trend" className="mt-4">
                <div className="h-64">
                  <ChartContainer config={chartConfig}>
                    <LineChart data={selectedProject.historicalRisk}>
                      <XAxis 
                        dataKey="week" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">AI Insight</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedProject.trend === 'increasing' 
                      ? `Risk has increased by ${selectedProject.historicalRisk[5].score - selectedProject.historicalRisk[0].score}% over the past 6 weeks. Primary drivers are technical complexity and resource constraints. Recommend immediate mitigation actions.`
                      : selectedProject.trend === 'decreasing'
                      ? `Risk has decreased by ${selectedProject.historicalRisk[0].score - selectedProject.historicalRisk[5].score}% over the past 6 weeks. Current mitigation strategies are effective. Continue monitoring key factors.`
                      : `Risk levels have remained stable over the past 6 weeks. No significant changes detected. Maintain current project management practices.`
                    }
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="explainability" className="mt-4 space-y-4">
                {selectedProject.explanation ? (
                  <AIExplainability explanation={selectedProject.explanation} />
                ) : (
                  <Card className="border-dashed border-primary/30 bg-primary/5">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-4 rounded-full bg-primary/10 mb-4">
                          <Brain className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">AI Explainability</h3>
                        <p className="text-sm text-muted-foreground max-w-md mb-4">
                          Understand how the AI analyzed risk factors and arrived at these predictions. 
                          See the reasoning, data sources, and confidence factors.
                        </p>
                        <Button
                          onClick={() => generateExplanation(selectedProject)}
                          disabled={isLoadingExplanation}
                          className="gap-2"
                        >
                          {isLoadingExplanation ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Generate Explanation
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="mitigation" className="mt-4 space-y-4">
                {!mitigationData && !isGeneratingMitigation && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">AI Risk Mitigation</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-4">
                      Generate AI-powered recommendations to reduce project delays and mitigate identified risks.
                    </p>
                    <Button onClick={generateMitigation} className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate Recommendations
                    </Button>
                  </div>
                )}

                {isGeneratingMitigation && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Analyzing risks and generating recommendations...</p>
                  </div>
                )}

                {mitigationData && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">AI Analysis Summary</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{mitigationData.summary}</p>
                    </div>

                    {/* Estimated Impact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-xs uppercase tracking-wide font-medium">Estimated Delay Reduction</span>
                        </div>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {mitigationData.estimatedDelayReduction}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                          <Eye className="h-4 w-4" />
                          <span className="text-xs uppercase tracking-wide font-medium">Warning Signs to Monitor</span>
                        </div>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          {mitigationData.warningSignsToMonitor.length} key indicators
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold">Action Recommendations</h4>
                        <Button variant="outline" size="sm" onClick={generateMitigation} className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          Regenerate
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {mitigationData.recommendations.map((rec) => (
                          <div key={rec.id} className="p-4 rounded-lg border bg-card">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={cn("text-xs gap-1", getPriorityColor(rec.priority))}>
                                  {getPriorityIcon(rec.priority)}
                                  {rec.priority}
                                </Badge>
                                <span className="font-medium text-sm">{rec.title}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Target className="h-3 w-3" />
                                <span className="font-medium">Impact:</span> {rec.impact}
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">Time:</span> {rec.timeToImplement}
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span className="font-medium">Resources:</span> {rec.resources}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warning Signs */}
                    {mitigationData.warningSignsToMonitor.length > 0 && (
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-semibold">Warning Signs to Monitor</span>
                        </div>
                        <ul className="space-y-2">
                          {mitigationData.warningSignsToMonitor.map((sign, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Risk Trend */}
      <Card className="nexus-fade-in" style={{ animationDelay: '0.4s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Portfolio Risk Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <LineChart data={portfolioRiskTrend}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="avgRisk" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="Avg Risk"
                />
                <Line 
                  type="monotone" 
                  dataKey="highRiskProjects" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--destructive))' }}
                  name="High Risk Projects"
                />
                <Line 
                  type="monotone" 
                  dataKey="mitigated" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Risks Mitigated"
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskPredictionView;
