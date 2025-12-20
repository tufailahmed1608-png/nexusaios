import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, FileText, Mail } from "lucide-react";
import { BrandingSettings } from "./BrandingSettings";
import { DocumentTemplates } from "./DocumentTemplates";
import { EmailTemplates } from "./EmailTemplates";

export function BrandingView() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Branding & Templates</h1>
          <p className="text-muted-foreground">Customize your company branding and manage templates</p>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            Theme Settings
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Document Templates
          </TabsTrigger>
          <TabsTrigger value="emails" className="gap-2">
            <Mail className="h-4 w-4" />
            Email Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <BrandingSettings />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentTemplates />
        </TabsContent>

        <TabsContent value="emails">
          <EmailTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
}
