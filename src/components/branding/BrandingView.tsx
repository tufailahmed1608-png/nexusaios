import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, FileText, Mail, ShieldAlert } from "lucide-react";
import { BrandingSettings } from "./BrandingSettings";
import { DocumentTemplates } from "./DocumentTemplates";
import { EmailTemplates } from "./EmailTemplates";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Card, CardContent } from "@/components/ui/card";

export function BrandingView() {
  const { isAdmin, loading } = useAdminRole();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">
              You need administrator privileges to access branding and template settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
