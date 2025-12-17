import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Sparkles,
  Loader2,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  Target,
  FileText,
  ChevronRight,
  Trophy,
  Zap,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface DigestData {
  executiveSummary: string;
  weekHighlights: Array<{ icon: string; title: string; description: string }>;
  projectUpdates: Array<{
    name: string;
    status: 'on-track' | 'at-risk' | 'delayed';
    progress: number;
    keyUpdate: string;
    nextMilestone: string;
  }>;
  tasksOverview: {
    completed: number;
    inProgress: number;
    blocked: number;
    highlight: string;
  };
  risksAndBlockers: Array<{
    severity: 'high' | 'medium' | 'low';
    description: string;
    mitigation: string;
  }>;
  teamPerformance: {
    velocity: string;
    recognition: string;
  };
  nextWeekPriorities: string[];
  actionItems: Array<{
    owner: string;
    action: string;
    due: string;
  }>;
}

// Mock week data for the digest
const mockWeekData = {
  dateRange: {
    start: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
    end: format(endOfWeek(new Date()), 'yyyy-MM-dd')
  },
  projects: [
    { name: 'Enterprise Platform Migration', progress: 68, status: 'at-risk', tasksCompleted: 12, tasksTotal: 45, budget: { spent: 245000, total: 350000 } },
    { name: 'Mobile App Redesign', progress: 85, status: 'on-track', tasksCompleted: 34, tasksTotal: 40, budget: { spent: 125000, total: 150000 } },
    { name: 'Data Analytics Pipeline', progress: 45, status: 'on-track', tasksCompleted: 18, tasksTotal: 40, budget: { spent: 80000, total: 200000 } },
    { name: 'Security Compliance Update', progress: 72, status: 'delayed', tasksCompleted: 29, tasksTotal: 40, budget: { spent: 95000, total: 100000 } },
  ],
  tasks: {
    completed: 24,
    newlyCreated: 15,
    inProgress: 18,
    blocked: 3,
    overdue: 2
  },
  meetings: {
    held: 8,
    actionItemsGenerated: 23,
    decisionsRecorded: 12
  },
  emails: {
    processed: 156,
    tasksExtracted: 18,
    highPriority: 7
  },
  team: {
    activeMembers: 12,
    avgWorkload: 78,
    topPerformer: 'Sarah Chen'
  }
};

const WeeklyDigestView = () => {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateDigest = async () => {
    setIsGenerating(true);
    setDigest(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-weekly-digest', {
        body: { weekData: mockWeekData },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setDigest(data);
      toast.success('Weekly digest generated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate digest');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!digest) return;
    
    const text = `Weekly Digest - ${format(new Date(), 'MMM d, yyyy')}\n\n${digest.executiveSummary}\n\nHighlights:\n${digest.weekHighlights.map(h => `• ${h.title}: ${h.description}`).join('\n')}\n\nNext Week Priorities:\n${digest.nextWeekPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!digest) return;
    
    const content = `# Weekly Digest - ${format(new Date(), 'MMMM d, yyyy')}\n\n## Executive Summary\n${digest.executiveSummary}\n\n## Week Highlights\n${digest.weekHighlights.map(h => `- **${h.title}**: ${h.description}`).join('\n')}\n\n## Project Updates\n${digest.projectUpdates.map(p => `### ${p.name}\n- Status: ${p.status}\n- Progress: ${p.progress}%\n- Key Update: ${p.keyUpdate}\n- Next Milestone: ${p.nextMilestone}`).join('\n\n')}\n\n## Tasks Overview\n- Completed: ${digest.tasksOverview.completed}\n- In Progress: ${digest.tasksOverview.inProgress}\n- Blocked: ${digest.tasksOverview.blocked}\n\n## Risks & Blockers\n${digest.risksAndBlockers.map(r => `- [${r.severity.toUpperCase()}] ${r.description}\n  - Mitigation: ${r.mitigation}`).join('\n')}\n\n## Next Week Priorities\n${digest.nextWeekPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n## Action Items\n${digest.actionItems.map(a => `- [ ] ${a.action} (@${a.owner}, due: ${a.due})`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-digest-${format(new Date(), 'yyyy-MM-dd')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Digest downloaded');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      case 'at-risk': return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
      case 'delayed': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/20 text-destructive';
      case 'medium': return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="nexus-fade-in flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Weekly Digest</h2>
          </div>
          <p className="text-muted-foreground mt-1">
            AI-generated status summary for {format(startOfWeek(new Date()), 'MMM d')} - {format(endOfWeek(new Date()), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {digest && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </>
          )}
          <Button onClick={generateDigest} disabled={isGenerating} className="gap-2">
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {digest ? 'Regenerate' : 'Generate Digest'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="nexus-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockWeekData.projects.length}</p>
                <p className="text-xs text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="nexus-fade-in" style={{ animationDelay: '0.15s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockWeekData.tasks.completed}</p>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="nexus-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockWeekData.meetings.held}</p>
                <p className="text-xs text-muted-foreground">Meetings Held</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="nexus-fade-in" style={{ animationDelay: '0.25s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockWeekData.team.activeMembers}</p>
                <p className="text-xs text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Prompt or Digest Content */}
      {!digest && !isGenerating && (
        <Card className="nexus-fade-in">
          <CardContent className="py-12 text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate Your Weekly Digest</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              AI will analyze your projects, tasks, meetings, and emails to create a comprehensive weekly status summary.
            </p>
            <Button onClick={generateDigest} size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Generate Weekly Digest
            </Button>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card className="nexus-fade-in">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing your week and generating digest...</p>
          </CardContent>
        </Card>
      )}

      {digest && (
        <div className="space-y-6">
          {/* Executive Summary */}
          <Card className="nexus-fade-in border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{digest.executiveSummary}</p>
            </CardContent>
          </Card>

          {/* Week Highlights */}
          {digest.weekHighlights.length > 0 && (
            <Card className="nexus-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Week Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {digest.weekHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <span className="text-2xl">{highlight.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{highlight.title}</p>
                        <p className="text-xs text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Updates */}
          <Card className="nexus-fade-in" style={{ animationDelay: '0.15s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Project Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {digest.projectUpdates.map((project, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{project.name}</span>
                    <Badge className={cn("text-xs", getStatusColor(project.status))}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={project.progress} className="flex-1 h-2" />
                    <span className="text-xs font-medium w-10">{project.progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">Update:</span> {project.keyUpdate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Next:</span> {project.nextMilestone}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks Overview */}
            <Card className="nexus-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Tasks Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-emerald-500/10">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{digest.tasksOverview.completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <p className="text-2xl font-bold text-primary">{digest.tasksOverview.inProgress}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-destructive/10">
                    <p className="text-2xl font-bold text-destructive">{digest.tasksOverview.blocked}</p>
                    <p className="text-xs text-muted-foreground">Blocked</p>
                  </div>
                </div>
                {digest.tasksOverview.highlight && (
                  <div className="p-3 rounded-lg bg-secondary/30 text-sm">
                    <span className="text-muted-foreground">✨ </span>
                    {digest.tasksOverview.highlight}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Performance */}
            <Card className="nexus-fade-in" style={{ animationDelay: '0.25s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Velocity</p>
                  <p className="text-sm">{digest.teamPerformance.velocity}</p>
                </div>
                {digest.teamPerformance.recognition && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Recognition</p>
                    </div>
                    <p className="text-sm">{digest.teamPerformance.recognition}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Risks & Blockers */}
          {digest.risksAndBlockers.length > 0 && (
            <Card className="nexus-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Risks & Blockers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {digest.risksAndBlockers.map((risk, idx) => (
                  <div key={idx} className="p-3 rounded-lg border">
                    <div className="flex items-start gap-2 mb-2">
                      <Badge className={cn("text-xs", getSeverityColor(risk.severity))}>
                        {risk.severity}
                      </Badge>
                      <p className="text-sm flex-1">{risk.description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Mitigation:</span> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Next Week Priorities & Action Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="nexus-fade-in" style={{ animationDelay: '0.35s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Next Week Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {digest.nextWeekPriorities.map((priority, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{idx + 1}</span>
                      </div>
                      <span className="text-sm">{priority}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="nexus-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {digest.actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg border">
                      <input type="checkbox" className="mt-1 rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{item.action}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="font-medium">@{item.owner}</span>
                          <span>•</span>
                          <span>Due: {item.due}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyDigestView;
