import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Mail, Trash2, Edit, Copy, Eye } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  is_default: boolean;
  created_at: string;
}

const templateTypes = [
  { value: "welcome", label: "Welcome" },
  { value: "notification", label: "Notification" },
  { value: "reminder", label: "Reminder" },
  { value: "newsletter", label: "Newsletter" },
  { value: "custom", label: "Custom" },
];

const defaultEmailTemplates: Omit<EmailTemplate, "id" | "created_at">[] = [
  {
    name: "Welcome Email",
    type: "welcome",
    subject: "Welcome to {{company_name}}!",
    is_default: true,
    body: `Hi {{first_name}},

Welcome to {{company_name}}! We're thrilled to have you on board.

Here's what you can do next:
• Complete your profile
• Explore our features
• Connect with your team

If you have any questions, don't hesitate to reach out to our support team.

Best regards,
The {{company_name}} Team`,
  },
  {
    name: "Task Reminder",
    type: "reminder",
    subject: "Reminder: {{task_name}} is due soon",
    is_default: true,
    body: `Hi {{first_name}},

This is a friendly reminder that the following task is due soon:

Task: {{task_name}}
Due Date: {{due_date}}
Project: {{project_name}}

Please make sure to complete it on time. If you need any assistance or an extension, please contact your project manager.

Best regards,
{{company_name}}`,
  },
  {
    name: "Project Update",
    type: "notification",
    subject: "Project Update: {{project_name}}",
    is_default: true,
    body: `Hi {{first_name}},

There's been an update on {{project_name}}:

{{update_details}}

Key highlights:
• Progress: {{progress}}%
• Status: {{status}}
• Next milestone: {{next_milestone}}

Click here to view the full project details: {{project_link}}

Best regards,
{{sender_name}}`,
  },
  {
    name: "Weekly Newsletter",
    type: "newsletter",
    subject: "{{company_name}} Weekly Update - {{week_date}}",
    is_default: true,
    body: `Hi {{first_name}},

Here's your weekly update from {{company_name}}:

📊 This Week's Highlights
{{weekly_highlights}}

📅 Upcoming Events
{{upcoming_events}}

💡 Tips & Resources
{{tips_and_resources}}

Thank you for being part of our community!

Best regards,
The {{company_name}} Team

---
Unsubscribe: {{unsubscribe_link}}`,
  },
];

export function EmailTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "custom",
    subject: "",
    body: "",
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EmailTemplate[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (editingTemplate) {
        const { error } = await supabase
          .from("email_templates")
          .update(data)
          .eq("id", editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("email_templates")
          .insert({ ...data, user_id: user.id, is_default: false });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      setFormData({ name: "", type: "custom", subject: "", body: "" });
      toast({
        title: editingTemplate ? "Template updated" : "Template created",
        description: "Your email template has been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("email_templates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast({
        title: "Template deleted",
        description: "The template has been removed.",
      });
    },
  });

  const addDefaultTemplate = async (template: typeof defaultEmailTemplates[0]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("email_templates")
      .insert({ ...template, user_id: user.id });

    if (error) {
      toast({
        title: "Failed to add template",
        description: error.message,
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast({
        title: "Template added",
        description: `${template.name} has been added to your templates.`,
      });
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject,
      body: template.body,
    });
    setIsDialogOpen(true);
  };

  const handleCopy = (template: EmailTemplate) => {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    toast({
      title: "Copied",
      description: "Email template copied to clipboard.",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "welcome": return "bg-green-500/10 text-green-600";
      case "notification": return "bg-blue-500/10 text-blue-600";
      case "reminder": return "bg-amber-500/10 text-amber-600";
      case "newsletter": return "bg-purple-500/10 text-purple-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Email Templates</h2>
          <p className="text-sm text-muted-foreground">Create branded email templates for your communications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingTemplate(null);
            setFormData({ name: "", type: "custom", subject: "", body: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "Edit Email Template" : "Create Email Template"}</DialogTitle>
              <DialogDescription>
                Use {"{{variable}}"} syntax for dynamic placeholders
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templateTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject Line</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Body</Label>
                <Textarea
                  value={formData.body}
                  onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Enter email content..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => saveMutation.mutate(formData)}
                  disabled={saveMutation.isPending || !formData.name || !formData.subject || !formData.body}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Template"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>{previewTemplate?.name}</DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b">
                <p className="text-sm"><strong>Subject:</strong> {previewTemplate.subject}</p>
              </div>
              <div className="p-4 bg-background">
                <pre className="whitespace-pre-wrap text-sm font-sans">
                  {previewTemplate.body}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {templates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Get Started with Email Templates</CardTitle>
            <CardDescription>Add pre-built templates or create your own</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {defaultEmailTemplates.map((template, index) => (
                <Card key={index} className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {template.body.slice(0, 80)}...
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => addDefaultTemplate(template)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-1">{template.subject}</p>
                <ScrollArea className="h-16 mb-4">
                  <p className="text-xs text-muted-foreground">
                    {template.body.slice(0, 150)}...
                  </p>
                </ScrollArea>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(template)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleCopy(template)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Add More Templates</CardTitle>
            <CardDescription>Choose from pre-built email templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {defaultEmailTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addDefaultTemplate(template)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {template.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
