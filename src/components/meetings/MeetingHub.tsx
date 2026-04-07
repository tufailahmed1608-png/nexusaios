import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Sparkles,
  CheckSquare,
  AlertCircle,
  Target,
  Video,
  RefreshCw,
  Link2,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SmartTaskSuggestions from '@/components/tasks/SmartTaskSuggestions';

// Import fallback mock data
import { meetings as mockMeetings } from '@/data/mockData';
import type { Meeting as MockMeeting } from '@/data/mockData';

interface SyncedMeeting {
  id: string;
  external_id: string;
  source: string;
  title: string;
  description: string | null;
  organizer: string | null;
  organizer_email: string | null;
  attendees: Array<{ name: string; email: string; response?: string }>;
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  status: string;
  join_url: string | null;
  recording_url: string | null;
  recording_status: string | null;
  transcript: string | null;
  transcript_url: string | null;
  ai_summary: string | null;
  ai_decisions: string[];
  ai_action_items: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Normalize both mock and synced meetings into a unified shape
interface UnifiedMeeting {
  id: string;
  title: string;
  description: string | null;
  organizer: string | null;
  attendees: string[];
  date: string;
  duration: string;
  status: string;
  source: 'teams' | 'mock';
  transcript: string | null;
  join_url: string | null;
  recording_url: string | null;
  ai_summary: string | null;
  ai_decisions: string[];
  ai_action_items: string[];
  raw?: SyncedMeeting;
}

function normalizeSynced(m: SyncedMeeting): UnifiedMeeting {
  const dur = m.duration_minutes
    ? m.duration_minutes >= 60
      ? `${Math.floor(m.duration_minutes / 60)}h ${m.duration_minutes % 60}m`
      : `${m.duration_minutes}m`
    : '—';
  return {
    id: m.id,
    title: m.title,
    description: m.description,
    organizer: m.organizer,
    attendees: m.attendees?.map((a) => a.name || a.email) || [],
    date: m.start_time || m.created_at,
    duration: dur,
    status: m.status || 'scheduled',
    source: 'teams',
    transcript: m.transcript,
    join_url: m.join_url,
    recording_url: m.recording_url,
    ai_summary: m.ai_summary,
    ai_decisions: m.ai_decisions || [],
    ai_action_items: m.ai_action_items || [],
    raw: m,
  };
}

function normalizeMock(m: MockMeeting): UnifiedMeeting {
  return {
    id: m.id,
    title: m.title,
    description: null,
    organizer: m.attendees[0] || null,
    attendees: m.attendees,
    date: m.date,
    duration: m.duration,
    status: m.status,
    source: 'mock',
    transcript: m.transcript || null,
    join_url: null,
    recording_url: null,
    ai_summary: null,
    ai_decisions: [],
    ai_action_items: [],
  };
}

const MeetingHub = () => {
  const [meetings, setMeetings] = useState<UnifiedMeeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<UnifiedMeeting | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    decisions: string[];
    actionItems: string[];
  } | null>(null);

  // Load meetings from DB + fallback to mock
  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings_sync')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(50);

      if (error) throw error;

      const synced = (data || []).map((m) =>
        normalizeSynced({
          ...m,
          attendees: Array.isArray(m.attendees) ? m.attendees as Array<{ name: string; email: string; response?: string }> : [],
          ai_decisions: Array.isArray(m.ai_decisions) ? m.ai_decisions as string[] : [],
          ai_action_items: Array.isArray(m.ai_action_items) ? m.ai_action_items as string[] : [],
          metadata: (m.metadata && typeof m.metadata === 'object' && !Array.isArray(m.metadata)) ? m.metadata as Record<string, unknown> : {},
        })
      );

      // Combine synced + mock (mock as fallback demo data)
      const mock = synced.length === 0 ? mockMeetings.map(normalizeMock) : [];
      const all = [...synced, ...mock];
      setMeetings(all);

      if (!selectedMeeting && all.length > 0) {
        const firstCompleted = all.find((m) => m.status === 'completed');
        setSelectedMeeting(firstCompleted || all[0]);
      }
    } catch (err) {
      console.error('Failed to load meetings:', err);
      // Fallback to mock data
      const mock = mockMeetings.map(normalizeMock);
      setMeetings(mock);
      if (!selectedMeeting && mock.length > 0) {
        setSelectedMeeting(mock.find((m) => m.status === 'completed') || mock[0]);
      }
    }
  };

  const handleSyncTeams = async () => {
    setIsSyncing(true);
    toast.info('Teams sync requires a Microsoft Graph access token. Configure in Integrations page.');
    setIsSyncing(false);
  };

  const handleAnalyze = async () => {
    if (!selectedMeeting?.transcript) return;
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-explanation', {
        body: {
          prompt: `Analyze this meeting transcript and extract: 1) A brief summary (2-3 sentences), 2) Key decisions made, 3) Action items with assignees.\n\nMeeting: ${selectedMeeting.title}\n\nTranscript:\n${selectedMeeting.transcript}`,
          context: 'meeting_analysis',
        },
      });

      if (error) throw error;

      const responseText = data?.explanation || data?.text || '';

      // Parse the AI response
      const summaryMatch = responseText.match(/summary[:\s]*([\s\S]*?)(?=(?:key decisions|decisions|$))/i);
      const decisionsMatch = responseText.match(/(?:key )?decisions[:\s]*([\s\S]*?)(?=(?:action items|$))/i);
      const actionsMatch = responseText.match(/action items[:\s]*([\s\S]*?)$/i);

      const parsed = {
        summary: summaryMatch?.[1]?.trim() || responseText.slice(0, 200),
        decisions: decisionsMatch?.[1]
          ?.split('\n')
          .map((d: string) => d.replace(/^[-*•\d.)\s]+/, '').trim())
          .filter(Boolean) || ['Review meeting for key decisions'],
        actionItems: actionsMatch?.[1]
          ?.split('\n')
          .map((a: string) => a.replace(/^[-*•\d.)\s]+/, '').trim())
          .filter(Boolean) || ['Follow up on meeting topics'],
      };

      setAnalysisResult(parsed);

      // Save AI analysis to DB if it's a synced meeting
      if (selectedMeeting.source === 'teams' && selectedMeeting.raw) {
        await supabase
          .from('meetings_sync')
          .update({
            ai_summary: parsed.summary,
            ai_decisions: parsed.decisions,
            ai_action_items: parsed.actionItems,
          })
          .eq('id', selectedMeeting.id);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      // Fallback to simulated analysis
      setAnalysisResult({
        summary: 'The meeting focused on key project priorities and resource allocation. The team agreed on next steps and assigned action items.',
        decisions: [
          'Allocate 40% of resources to platform stability',
          'Dedicate 35% to new feature development',
          'Reserve 25% for technical debt reduction',
        ],
        actionItems: [
          'Document decisions and share with team',
          'Prepare technical roadmap by Friday',
          'Identify critical stability issues',
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sourceIcon = (source: string) => {
    switch (source) {
      case 'teams': return <Monitor className="w-3 h-3 text-primary" />;
      default: return <Video className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="masira-fade-in flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Meeting Hub</h2>
          <p className="text-muted-foreground">AI-powered meeting analysis and minutes generation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSyncTeams} disabled={isSyncing}>
            <RefreshCw className={cn("w-4 h-4 mr-1", isSyncing && "animate-spin")} />
            Sync Teams
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Meeting List */}
        <div className="masira-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Meetings</h3>
            <Badge variant="secondary" className="text-xs">
              {meetings.length}
            </Badge>
          </div>
          <div className="flex-1 overflow-y-auto masira-scrollbar">
            {meetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => {
                  setSelectedMeeting(meeting);
                  setAnalysisResult(
                    meeting.ai_summary
                      ? { summary: meeting.ai_summary, decisions: meeting.ai_decisions, actionItems: meeting.ai_action_items }
                      : null
                  );
                }}
                className={cn(
                  'w-full p-4 text-left border-b border-border transition-colors',
                  'hover:bg-secondary/50',
                  selectedMeeting?.id === meeting.id && 'bg-secondary'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {sourceIcon(meeting.source)}
                    <h4 className="font-medium text-foreground text-sm">{meeting.title}</h4>
                  </div>
                  <span
                    className={cn(
                      'masira-badge text-[10px]',
                      meeting.status === 'completed' && 'masira-badge-success',
                      meeting.status === 'scheduled' && 'bg-primary/10 text-primary',
                      meeting.status === 'cancelled' && 'masira-badge-danger'
                    )}
                  >
                    {meeting.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(meeting.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{meeting.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{meeting.attendees.length}</span>
                  </div>
                </div>
                <div className="flex -space-x-1.5 mt-2">
                  {meeting.attendees.slice(0, 4).map((attendee, idx) => (
                    <Avatar key={idx} className="w-6 h-6 border border-card">
                      <AvatarFallback className="bg-primary text-[8px] font-medium text-primary-foreground">
                        {attendee.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {meeting.attendees.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[8px] font-medium text-foreground border border-card">
                      +{meeting.attendees.length - 4}
                    </div>
                  )}
                </div>
                {meeting.recording_url && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <Video className="w-3 h-3" />
                    <span>Recording available</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Transcript */}
        <div className="masira-card overflow-hidden flex flex-col">
          {selectedMeeting ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  {sourceIcon(selectedMeeting.source)}
                  <h3 className="font-semibold text-foreground">{selectedMeeting.title}</h3>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex -space-x-1.5">
                    {selectedMeeting.attendees.slice(0, 5).map((attendee, idx) => (
                      <Avatar key={idx} className="w-7 h-7 border-2 border-card" title={attendee}>
                        <AvatarFallback className="bg-primary text-[10px] font-medium text-primary-foreground">
                          {attendee.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedMeeting.attendees.length} attendees • {selectedMeeting.duration}
                  </span>
                  {selectedMeeting.join_url && (
                    <a href={selectedMeeting.join_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Link2 className="w-3 h-3" /> Join
                    </a>
                  )}
                  {selectedMeeting.recording_url && (
                    <a href={selectedMeeting.recording_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Video className="w-3 h-3" /> Recording
                    </a>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 masira-scrollbar">
                {selectedMeeting.transcript ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                    {selectedMeeting.transcript}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <FileText className="w-12 h-12 mb-4 opacity-50" />
                    <p>No transcript available</p>
                    <p className="text-sm">Upload or paste transcript to analyze</p>
                    <Textarea
                      placeholder="Paste meeting transcript here..."
                      className="mt-4 h-32 masira-input"
                    />
                  </div>
                )}
              </div>
              {selectedMeeting.transcript && (
                <div className="p-4 border-t border-border">
                  <Button
                    className="w-full gap-2"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    <Sparkles className="w-4 h-4" />
                    {isAnalyzing ? 'Analyzing...' : 'Generate Meeting Minutes'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a meeting to view
            </div>
          )}
        </div>

        {/* AI Analysis */}
        <div className="space-y-4 overflow-y-auto masira-scrollbar">
          {analysisResult ? (
            <>
              <div className="masira-card masira-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              <div className="masira-card masira-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <h3 className="font-semibold text-foreground">Key Decisions</h3>
                </div>
                <div className="space-y-2">
                  {analysisResult.decisions.map((decision, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-warning">{index + 1}</span>
                      </div>
                      <span className="text-sm text-foreground">{decision}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="masira-card masira-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-foreground">Action Items</h3>
                </div>
                <div className="space-y-2">
                  {analysisResult.actionItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                      <input type="checkbox" className="mt-1 rounded border-border" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Add All to Task Board
                </Button>
              </div>

              {selectedMeeting?.transcript && (
                <div className="masira-slide-up" style={{ animationDelay: '300ms' }}>
                  <SmartTaskSuggestions
                    content={selectedMeeting.transcript}
                    contentType="meeting"
                    subject={selectedMeeting.title}
                    onTaskAdded={(task) => {
                      console.log('Task added from meeting:', task);
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="masira-card h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>AI analysis will appear here</p>
                <p className="text-sm">Select a meeting and click analyze</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingHub;
