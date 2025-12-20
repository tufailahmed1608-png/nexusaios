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
import { Loader2, Plus, FileText, Trash2, Edit, Copy } from "lucide-react";

interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  is_default: boolean;
  created_at: string;
}

const templateTypes = [
  { value: "report", label: "Report" },
  { value: "proposal", label: "Proposal" },
  { value: "memo", label: "Memo" },
  { value: "invoice", label: "Invoice" },
  { value: "custom", label: "Custom" },
];

const defaultTemplates: Omit<DocumentTemplate, "id" | "created_at">[] = [
  {
    name: "Project Status Report",
    type: "report",
    is_default: true,
    content: `# Project Status Report

**Project Name:** {{project_name}}
**Report Date:** {{date}}
**Prepared By:** {{author}}

## Executive Summary
{{summary}}

## Progress Update
- Completed: {{completed_tasks}}
- In Progress: {{in_progress_tasks}}
- Pending: {{pending_tasks}}

## Key Milestones
{{milestones}}

## Risks & Issues
{{risks}}

## Next Steps
{{next_steps}}

## Budget Status
- Allocated: {{budget_allocated}}
- Spent: {{budget_spent}}
- Remaining: {{budget_remaining}}`,
  },
  {
    name: "Business Proposal",
    type: "proposal",
    is_default: true,
    content: `# Business Proposal

**Proposal Title:** {{title}}
**Date:** {{date}}
**Prepared For:** {{client_name}}
**Prepared By:** {{company_name}}

## Introduction
{{introduction}}

## Problem Statement
{{problem}}

## Proposed Solution
{{solution}}

## Scope of Work
{{scope}}

## Timeline
{{timeline}}

## Investment
{{pricing}}

## Terms & Conditions
{{terms}}

## Next Steps
{{next_steps}}

---
Contact: {{contact_info}}`,
  },
  {
    name: "Internal Memo",
    type: "memo",
    is_default: true,
    content: `# MEMORANDUM

**TO:** {{recipients}}
**FROM:** {{sender}}
**DATE:** {{date}}
**RE:** {{subject}}

---

{{content}}

---

Please reach out if you have any questions.

{{signature}}`,
  },
];

export function DocumentTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "custom",
    content: "",
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["document-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DocumentTemplate[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (editingTemplate) {
        const { error } = await supabase
          .from("document_templates")
          .update(data)
          .eq("id", editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("document_templates")
          .insert({ ...data, user_id: user.id, is_default: false });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      setFormData({ name: "", type: "custom", content: "" });
      toast({
        title: editingTemplate ? "Template updated" : "Template created",
        description: "Your document template has been saved.",
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
        .from("document_templates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
      toast({
        title: "Template deleted",
        description: "The template has been removed.",
      });
    },
  });

  const addDefaultTemplate = async (template: typeof defaultTemplates[0]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("document_templates")
      .insert({ ...template, user_id: user.id });

    if (error) {
      toast({
        title: "Failed to add template",
        description: error.message,
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
      toast({
        title: "Template added",
        description: `${template.name} has been added to your templates.`,
      });
    }
  };

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      content: template.content,
    });
    setIsDialogOpen(true);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Template content copied to clipboard.",
    });
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
          <h2 className="text-lg font-semibold">Your Templates</h2>
          <p className="text-sm text-muted-foreground">Create and manage document templates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingTemplate(null);
            setFormData({ name: "", type: "custom", content: "" });
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
              <DialogTitle>{editingTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
              <DialogDescription>
                {editingTemplate ? "Update your document template" : "Create a new document template"}
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
                <Label>Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter template content... Use {{variable}} for placeholders"
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => saveMutation.mutate(formData)}
                  disabled={saveMutation.isPending || !formData.name || !formData.content}
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

      {templates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Get Started with Templates</CardTitle>
            <CardDescription>Add pre-built templates or create your own</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {defaultTemplates.map((template, index) => (
                <Card key={index} className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">{template.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {template.content.slice(0, 100)}...
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
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">{template.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-24 mb-4">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {template.content.slice(0, 200)}...
                  </pre>
                </ScrollArea>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleCopy(template.content)}>
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
            <CardDescription>Choose from pre-built templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {defaultTemplates.map((template, index) => (
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
