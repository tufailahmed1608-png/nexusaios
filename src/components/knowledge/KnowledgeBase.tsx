import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Upload, MessageSquare, Send, Trash2, Loader2, BookOpen } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { id: string; title: string }[];
}

export function KnowledgeBase() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    },
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rag-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'upload', title, content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setTitle("");
      setContent("");
      toast({
        title: "Document uploaded",
        description: "Your document has been added to the knowledge base.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rag-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'delete', documentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Document deleted",
        description: "The document has been removed from the knowledge base.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Query knowledge base
  const handleQuery = async () => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: query };
    setChatMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsQuerying(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rag-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'query', query: userMessage.content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to query knowledge base');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Query failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsQuerying(false);
    }
  };

  const handleUpload = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide both title and content.",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate({ title, content });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Upload documents and query your company knowledge with AI</p>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Ask Questions
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Query Knowledge Base</CardTitle>
              <CardDescription>Ask questions about your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4 mb-4">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                      <MessageSquare className="h-12 w-12 mx-auto opacity-50" />
                      <p>No messages yet. Ask a question to get started!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <p className="text-xs opacity-70 mb-1">Sources:</p>
                              <div className="flex flex-wrap gap-1">
                                {msg.sources.map((source) => (
                                  <Badge key={source.id} variant="secondary" className="text-xs">
                                    {source.title}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isQuerying && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about your documents..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleQuery()}
                  disabled={isQuerying}
                />
                <Button onClick={handleQuery} disabled={isQuerying || !query.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Your knowledge base contains {documents.length} document(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents uploaded yet.</p>
                  <p className="text-sm">Go to the Upload tab to add your first document.</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {doc.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Added {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(doc.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Add text content to your knowledge base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <Input
                  placeholder="e.g., Company Policies, Product FAQ..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Paste or type your document content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !title.trim() || !content.trim()}
                className="w-full"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
