import { useState } from 'react';
import { cn } from '@/lib/utils';
import { meetings } from '@/data/mockData';
import type { Meeting } from '@/data/mockData';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Sparkles,
  CheckSquare,
  AlertCircle,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SmartTaskSuggestions from '@/components/tasks/SmartTaskSuggestions';

// Import attendee avatars
import sarahChenAvatar from '@/assets/inbox/sarah-chen-email.png';
import michaelTorresAvatar from '@/assets/inbox/michael-torres.png';
import alexKimAvatar from '@/assets/inbox/alex-kim.png';
import emilyWatsonAvatar from '@/assets/inbox/emily-watson.png';

// Avatar mapping for attendees
const attendeeAvatars: Record<string, string> = {
  'Sarah Chen': sarahChenAvatar,
  'Michael Torres': michaelTorresAvatar,
  'Alex Kim': alexKimAvatar,
  'Emily Watson': emilyWatsonAvatar,
};

const MeetingHub = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(
    meetings.find((m) => m.status === 'completed') || null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    decisions: string[];
    actionItems: string[];
  } | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        summary:
          'The Q4 planning session focused on resource allocation and priority setting. The team agreed to balance platform stability, new features, and technical debt reduction.',
        decisions: [
          'Allocate 40% of resources to platform stability',
          'Dedicate 35% to new feature development',
          'Reserve 25% for technical debt reduction',
          'Implement weekly check-ins to monitor progress',
        ],
        actionItems: [
          'Sarah: Document decisions and share with team',
          'Michael: Prepare technical roadmap by Friday',
          'Alex: Identify critical stability issues',
          'Emily: Prioritize enterprise feature requests',
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="masira-fade-in">
        <h2 className="text-2xl font-bold text-foreground">Meeting Hub</h2>
        <p className="text-muted-foreground">AI-powered meeting analysis and minutes generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Meeting List */}
        <div className="masira-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Meetings</h3>
          </div>
          <div className="flex-1 overflow-y-auto masira-scrollbar">
            {meetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => {
                  setSelectedMeeting(meeting);
                  setAnalysisResult(null);
                }}
                className={cn(
                  'w-full p-4 text-left border-b border-border transition-colors',
                  'hover:bg-secondary/50',
                  selectedMeeting?.id === meeting.id && 'bg-secondary'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">{meeting.title}</h4>
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
                      <AvatarImage src={attendeeAvatars[attendee]} alt={attendee} />
                      <AvatarFallback className="bg-primary text-[8px] font-medium text-primary-foreground">
                        {attendee.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {meeting.attendees.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[8px] font-medium text-foreground border border-card">
                      +{meeting.attendees.length - 4}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Transcript */}
        <div className="masira-card overflow-hidden flex flex-col">
          {selectedMeeting ? (
            <>
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground mb-2">{selectedMeeting.title}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {selectedMeeting.attendees.slice(0, 5).map((attendee, idx) => (
                      <Avatar key={idx} className="w-7 h-7 border-2 border-card" title={attendee}>
                        <AvatarImage src={attendeeAvatars[attendee]} alt={attendee} />
                        <AvatarFallback className="bg-primary text-[10px] font-medium text-primary-foreground">
                          {attendee.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedMeeting.attendees.length} attendees • {selectedMeeting.duration}
                  </span>
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
              {/* Summary */}
              <div className="masira-card masira-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Decisions */}
              <div className="masira-card masira-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <h3 className="font-semibold text-foreground">Key Decisions</h3>
                </div>
                <div className="space-y-2">
                  {analysisResult.decisions.map((decision, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-warning">{index + 1}</span>
                      </div>
                      <span className="text-sm text-foreground">{decision}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div className="masira-card masira-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-foreground">Action Items</h3>
                </div>
                <div className="space-y-2">
                  {analysisResult.actionItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-border"
                      />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Add All to Task Board
                </Button>
              </div>

              {/* Smart Task Suggestions */}
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
