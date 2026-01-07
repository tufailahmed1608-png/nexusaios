import { useState, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { emails } from '@/data/mockData';
import type { Email } from '@/data/mockData';
import {
  Star,
  StarOff,
  AlertTriangle,
  CheckCircle2,
  Minus,
  ArrowRight,
  Sparkles,
  ListTodo,
  Send,
  Reply,
  Paperclip,
  X,
  Wand2,
  Loader2,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SmartTaskSuggestions from '@/components/tasks/SmartTaskSuggestions';
import { useTenantSettings } from '@/hooks/useTenantSettings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Import email sender avatars
import sarahChenAvatar from '@/assets/inbox/sarah-chen-email.png';
import michaelTorresAvatar from '@/assets/inbox/michael-torres.png';
import alexKimAvatar from '@/assets/inbox/alex-kim.png';
import emilyWatsonAvatar from '@/assets/inbox/emily-watson.png';

// Avatar mapping for email senders
const emailAvatars: Record<string, string> = {
  'Sarah Chen': sarahChenAvatar,
  'Michael Torres': michaelTorresAvatar,
  'Alex Kim': alexKimAvatar,
  'Emily Watson': emilyWatsonAvatar,
};

const SmartInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0]);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { settings } = useTenantSettings();

  // Calculate aggregate signals (no individual sentiment)
  const aggregateSignals = useMemo(() => {
    const total = emails.length;
    const positive = emails.filter(e => e.sentiment.label === 'positive').length;
    const negative = emails.filter(e => e.sentiment.label === 'negative').length;
    const neutral = emails.filter(e => e.sentiment.label === 'neutral').length;
    const critical = emails.filter(e => e.priority === 'critical').length;
    const high = emails.filter(e => e.priority === 'high').length;

    return {
      total,
      sentimentDistribution: {
        positive: Math.round((positive / total) * 100),
        negative: Math.round((negative / total) * 100),
        neutral: Math.round((neutral / total) * 100),
      },
      priorityAlerts: critical + high,
      criticalCount: critical,
      trend: positive > negative ? 'positive' : negative > positive ? 'negative' : 'stable',
    };
  }, []);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast({ title: 'Error', description: 'Please enter a message', variant: 'destructive' });
      return;
    }
    toast({
      title: 'Reply Sent',
      description: `Reply sent to ${selectedEmail?.from}${attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ''}`,
    });
    setReplyText('');
    setAttachments([]);
    setIsReplying(false);
  };

  const handleGenerateAIReply = async () => {
    if (!selectedEmail) return;
    
    setIsGeneratingReply(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-reply', {
        body: {
          emailSubject: selectedEmail.subject,
          emailFrom: selectedEmail.from,
          emailBody: selectedEmail.body,
          tone: 'professional',
        },
      });

      if (error) throw error;
      
      if (data?.reply) {
        setReplyText(data.reply);
        toast({
          title: 'AI Reply Generated',
          description: 'Review and edit the suggested reply before sending.',
        });
      }
    } catch (error: any) {
      console.error('Error generating AI reply:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate AI reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const getPriorityColor = (priority: Email['priority']) => {
    switch (priority) {
      case 'critical':
        return 'masira-badge-danger';
      case 'high':
        return 'masira-badge-warning';
      case 'medium':
        return 'bg-primary/10 text-primary';
      default:
        return 'masira-badge-neutral';
    }
  };

  const getEscalationLabel = (level: Email['escalationLevel']) => {
    switch (level) {
      case 'L1':
        return 'Operational';
      case 'L2':
        return 'Tactical';
      case 'L3':
        return 'Strategic';
      case 'L4':
        return 'Executive';
    }
  };

  if (!settings.smartInboxEnabled) {
    return (
      <div className="space-y-6">
        <div className="masira-fade-in">
          <h2 className="text-2xl font-bold text-foreground">Communication Signals</h2>
          <p className="text-muted-foreground">Feature disabled by Tenant Administrator</p>
        </div>
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            The Smart Inbox feature has been disabled by your organization's administrator. 
            Contact your Tenant Admin for more information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="masira-fade-in">
        <h2 className="text-2xl font-bold text-foreground">Communication Signals</h2>
        <p className="text-muted-foreground">Aggregate communication intelligence from connected systems</p>
      </div>

      {/* Governance Notice */}
      <Alert className="border-primary/30 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <span className="font-medium">Governed Feature:</span> This view shows aggregate communication signals only. 
          Individual sentiment scoring is disabled. Data is not used for HR or performance evaluation.
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 ml-1 inline-block cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Per governance policy, this feature aggregates signals to support PMO decision-making 
                  without individual performance tracking.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDescription>
      </Alert>

      {/* Aggregate Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="masira-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Total Signals</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{aggregateSignals.total}</div>
          <p className="text-xs text-muted-foreground">Communications analyzed</p>
        </div>
        <div className="masira-card p-4">
          <div className="flex items-center gap-2 mb-2">
            {aggregateSignals.trend === 'positive' ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : aggregateSignals.trend === 'negative' ? (
              <TrendingDown className="w-4 h-4 text-destructive" />
            ) : (
              <Minus className="w-4 h-4 text-warning" />
            )}
            <span className="text-xs font-medium text-muted-foreground">Overall Tone</span>
          </div>
          <div className="text-2xl font-bold text-foreground capitalize">{aggregateSignals.trend}</div>
          <p className="text-xs text-muted-foreground">Aggregate sentiment trend</p>
        </div>
        <div className="masira-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium text-muted-foreground">Priority Alerts</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{aggregateSignals.priorityAlerts}</div>
          <p className="text-xs text-muted-foreground">High/Critical items</p>
        </div>
        <div className="masira-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Sentiment Mix</span>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-secondary">
            <div 
              className="bg-success transition-all" 
              style={{ width: `${aggregateSignals.sentimentDistribution.positive}%` }} 
            />
            <div 
              className="bg-warning transition-all" 
              style={{ width: `${aggregateSignals.sentimentDistribution.neutral}%` }} 
            />
            <div 
              className="bg-destructive transition-all" 
              style={{ width: `${aggregateSignals.sentimentDistribution.negative}%` }} 
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {aggregateSignals.sentimentDistribution.positive}% positive • {aggregateSignals.sentimentDistribution.neutral}% neutral • {aggregateSignals.sentimentDistribution.negative}% negative
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-420px)]">
        {/* Email List */}
        <div className="masira-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Signal Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto masira-scrollbar">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={cn(
                  'w-full p-4 text-left border-b border-border transition-colors',
                  'hover:bg-secondary/50',
                  selectedEmail?.id === email.id && 'bg-secondary',
                  !email.isRead && 'bg-primary/5'
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={emailAvatars[email.from]} alt={email.from} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {email.from.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <button className="mt-1 text-muted-foreground hover:text-warning">
                    {email.isStarred ? (
                      <Star className="w-4 h-4 fill-warning text-warning" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('font-medium text-foreground', !email.isRead && 'font-semibold')}>
                        {email.from}
                      </span>
                      <span className={cn('masira-badge text-[10px]', getPriorityColor(email.priority))}>
                        {email.priority}
                      </span>
                    </div>
                    <p className={cn('text-sm truncate', !email.isRead ? 'text-foreground' : 'text-muted-foreground')}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1">{email.preview}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">{getEscalationLabel(email.escalationLevel)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Email Content + AI Analysis */}
        <div className="masira-card overflow-hidden flex flex-col">
          {selectedEmail ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={emailAvatars[selectedEmail.from]} alt={selectedEmail.from} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedEmail.from.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{selectedEmail.subject}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{selectedEmail.from}</span>
                        <span>•</span>
                        <span>{selectedEmail.fromEmail}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReplying(!isReplying)}
                    className="shrink-0"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto masira-scrollbar">
                {/* Email Body */}
                <div className="p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                    {selectedEmail.body}
                  </pre>
                </div>

                {/* Extracted Intelligence (no individual sentiment) */}
                <div className="px-4 pb-4 space-y-3">
                  {/* Escalation Level & Priority */}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-xs font-medium text-muted-foreground">Classification</span>
                    </div>
                    <span className={cn('masira-badge text-xs', getPriorityColor(selectedEmail.priority))}>
                      {selectedEmail.priority} priority
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getEscalationLabel(selectedEmail.escalationLevel)} level
                    </span>
                  </div>

                  {/* Compact Tasks */}
                  {selectedEmail.extractedTasks.length > 0 && (
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <ListTodo className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Extracted Actions</span>
                      </div>
                      <div className="space-y-1.5">
                        {selectedEmail.extractedTasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-1.5 px-2 rounded bg-background/50 hover:bg-background transition-colors group"
                          >
                            <span className="text-xs text-foreground">{task}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Task Suggestions */}
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <SmartTaskSuggestions
                      content={selectedEmail.body}
                      contentType="email"
                      sender={selectedEmail.from}
                      subject={selectedEmail.subject}
                      compact
                      onTaskAdded={(task) => {
                        console.log('Task added:', task);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              {isReplying && (
                <div className="p-4 border-t border-border space-y-3 bg-secondary/20">
                  <div className="text-sm text-muted-foreground">
                    Replying to <span className="font-medium text-foreground">{selectedEmail.from}</span>
                  </div>
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm"
                        >
                          <Paperclip className="w-3 h-3 text-muted-foreground" />
                          <span className="max-w-[120px] truncate text-foreground">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                      />
                      <Button variant="ghost" size="sm" onClick={handleAttachmentClick}>
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerateAIReply}
                        disabled={isGeneratingReply}
                        className="text-primary border-primary/30 hover:bg-primary/10"
                      >
                        {isGeneratingReply ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 mr-2" />
                        )}
                        AI Reply
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setIsReplying(false);
                        setReplyText('');
                        setAttachments([]);
                      }}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSendReply}>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a signal to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartInbox;
