import { useState, useRef } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SmartInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0]);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const getSentimentColor = (sentiment: Email['sentiment']['label']) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success';
      case 'negative':
        return 'bg-destructive';
      default:
        return 'bg-warning';
    }
  };

  const getSentimentIcon = (sentiment: Email['sentiment']['label']) => {
    switch (sentiment) {
      case 'positive':
        return CheckCircle2;
      case 'negative':
        return AlertTriangle;
      default:
        return Minus;
    }
  };

  const getPriorityColor = (priority: Email['priority']) => {
    switch (priority) {
      case 'critical':
        return 'nexus-badge-danger';
      case 'high':
        return 'nexus-badge-warning';
      case 'medium':
        return 'bg-primary/10 text-primary';
      default:
        return 'nexus-badge-neutral';
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

  return (
    <div className="space-y-6">
      <div className="nexus-fade-in">
        <h2 className="text-2xl font-bold text-foreground">Smart Inbox</h2>
        <p className="text-muted-foreground">AI-powered email analysis and task extraction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Email List */}
        <div className="nexus-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Inbox</h3>
          </div>
          <div className="flex-1 overflow-y-auto nexus-scrollbar">
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
                      <span className={cn('nexus-badge text-[10px]', getPriorityColor(email.priority))}>
                        {email.priority}
                      </span>
                    </div>
                    <p className={cn('text-sm truncate', !email.isRead ? 'text-foreground' : 'text-muted-foreground')}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1">{email.preview}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={cn('w-2 h-2 rounded-full', getSentimentColor(email.sentiment.label))}
                      />
                      <span className="text-xs text-muted-foreground">{email.escalationLevel}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Email Content */}
        <div className="nexus-card overflow-hidden flex flex-col">
          {selectedEmail ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{selectedEmail.subject}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{selectedEmail.from}</span>
                      <span>•</span>
                      <span>{selectedEmail.fromEmail}</span>
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
              <div className="flex-1 overflow-y-auto p-4 nexus-scrollbar">
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                  {selectedEmail.body}
                </pre>
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
              Select an email to view
            </div>
          )}
        </div>

        {/* AI Analysis Panel */}
        <div className="space-y-4 overflow-y-auto nexus-scrollbar">
          {selectedEmail && (
            <>
              {/* Sentiment Gauge */}
              <div className="nexus-card nexus-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Sentiment Analysis</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = getSentimentIcon(selectedEmail.sentiment.label);
                        return (
                          <Icon
                            className={cn(
                              'w-5 h-5',
                              selectedEmail.sentiment.label === 'positive' && 'text-success',
                              selectedEmail.sentiment.label === 'negative' && 'text-destructive',
                              selectedEmail.sentiment.label === 'neutral' && 'text-warning'
                            )}
                          />
                        );
                      })()}
                      <span className="font-medium text-foreground capitalize">
                        {selectedEmail.sentiment.label}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(selectedEmail.sentiment.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="nexus-sentiment-bar">
                    <div
                      className={cn('h-full transition-all', getSentimentColor(selectedEmail.sentiment.label))}
                      style={{ width: `${selectedEmail.sentiment.score * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Escalation Matrix */}
              <div className="nexus-card nexus-slide-up" style={{ animationDelay: '100ms' }}>
                <h3 className="font-semibold text-foreground mb-4">Escalation Matrix</h3>
                <div className="grid grid-cols-4 gap-2">
                  {(['L1', 'L2', 'L3', 'L4'] as const).map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'p-3 rounded-lg text-center transition-all',
                        selectedEmail.escalationLevel === level
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-muted-foreground'
                      )}
                    >
                      <p className="font-semibold">{level}</p>
                      <p className="text-xs mt-1">{getEscalationLabel(level)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted Tasks */}
              <div className="nexus-card nexus-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <ListTodo className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Extracted Tasks</h3>
                </div>
                <div className="space-y-2">
                  {selectedEmail.extractedTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                    >
                      <span className="text-sm text-foreground">{task}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Add All to Task Board
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartInbox;
