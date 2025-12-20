import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Upload, Building2 } from "lucide-react";

interface CompanyBranding {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  tagline: string | null;
}

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
];

export function BrandingSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<CompanyBranding>>({
    company_name: "My Company",
    primary_color: "#6366f1",
    secondary_color: "#8b5cf6",
    accent_color: "#06b6d4",
    font_heading: "Inter",
    font_body: "Inter",
    tagline: "",
  });

  const { data: branding, isLoading } = useQuery({
    queryKey: ["company-branding"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("company_branding")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as CompanyBranding | null;
    },
  });

  useEffect(() => {
    if (branding) {
      setFormData(branding);
    }
  }, [branding]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<CompanyBranding>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (branding?.id) {
        const { error } = await supabase
          .from("company_branding")
          .update({
            company_name: data.company_name,
            logo_url: data.logo_url,
            primary_color: data.primary_color,
            secondary_color: data.secondary_color,
            accent_color: data.accent_color,
            font_heading: data.font_heading,
            font_body: data.font_body,
            tagline: data.tagline,
          })
          .eq("id", branding.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("company_branding")
          .insert({
            user_id: user.id,
            company_name: data.company_name || "My Company",
            logo_url: data.logo_url,
            primary_color: data.primary_color || "#6366f1",
            secondary_color: data.secondary_color || "#8b5cf6",
            accent_color: data.accent_color || "#06b6d4",
            font_heading: data.font_heading || "Inter",
            font_body: data.font_body || "Inter",
            tagline: data.tagline,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-branding"] });
      toast({
        title: "Branding saved",
        description: "Your company branding has been updated.",
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setFormData(prev => ({ ...prev, logo_url: publicUrl }));
    toast({
      title: "Logo uploaded",
      description: "Your logo has been uploaded. Click Save to apply.",
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
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Identity
          </CardTitle>
          <CardDescription>Set your company name, logo, and tagline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={formData.company_name || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              placeholder="Enter company tagline"
            />
          </div>

          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              {formData.logo_url && (
                <img
                  src={formData.logo_url}
                  alt="Company logo"
                  className="h-16 w-16 rounded-lg object-cover border"
                />
              )}
              <Label
                htmlFor="logo-upload"
                className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload Logo
              </Label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>Choose your brand color palette</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="primary_color"
                value={formData.primary_color || "#6366f1"}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                className="h-10 w-20 rounded cursor-pointer border-0"
              />
              <Input
                value={formData.primary_color || "#6366f1"}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_color">Secondary Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="secondary_color"
                value={formData.secondary_color || "#8b5cf6"}
                onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                className="h-10 w-20 rounded cursor-pointer border-0"
              />
              <Input
                value={formData.secondary_color || "#8b5cf6"}
                onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent_color">Accent Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="accent_color"
                value={formData.accent_color || "#06b6d4"}
                onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                className="h-10 w-20 rounded cursor-pointer border-0"
              />
              <Input
                value={formData.accent_color || "#06b6d4"}
                onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <div
              className="h-12 flex-1 rounded-lg"
              style={{ backgroundColor: formData.primary_color }}
            />
            <div
              className="h-12 flex-1 rounded-lg"
              style={{ backgroundColor: formData.secondary_color }}
            />
            <div
              className="h-12 flex-1 rounded-lg"
              style={{ backgroundColor: formData.accent_color }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Select fonts for headings and body text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Heading Font</Label>
            <Select
              value={formData.font_heading || "Inter"}
              onValueChange={(value) => setFormData(prev => ({ ...prev, font_heading: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Body Font</Label>
            <Select
              value={formData.font_body || "Inter"}
              onValueChange={(value) => setFormData(prev => ({ ...prev, font_body: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h3 style={{ fontFamily: formData.font_heading }} className="text-lg font-bold">
              Preview Heading
            </h3>
            <p style={{ fontFamily: formData.font_body }} className="text-sm text-muted-foreground">
              This is how your body text will look with the selected font.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your branding looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              {formData.logo_url ? (
                <img
                  src={formData.logo_url}
                  alt="Logo"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  {formData.company_name?.charAt(0) || "C"}
                </div>
              )}
              <div>
                <h3 style={{ fontFamily: formData.font_heading }} className="font-bold">
                  {formData.company_name || "Company Name"}
                </h3>
                <p style={{ fontFamily: formData.font_body }} className="text-sm text-muted-foreground">
                  {formData.tagline || "Your tagline here"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: formData.primary_color }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: formData.secondary_color }}
              >
                Secondary
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: formData.accent_color }}
              >
                Accent
              </button>
            </div>
          </div>

          <Button
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending}
            className="w-full mt-4"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Branding
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
