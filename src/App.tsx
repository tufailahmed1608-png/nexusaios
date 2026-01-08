import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import DocsCover from "./pages/docs/DocsCover";
import DocsExecutiveSummary from "./pages/docs/DocsExecutiveSummary";
import DocsCoreFeatures from "./pages/docs/DocsCoreFeatures";
import DocsTechnicalSpecs from "./pages/docs/DocsTechnicalSpecs";
import DocsAIIntegration from "./pages/docs/DocsAIIntegration";
import DocsCompetitiveAnalysis from "./pages/docs/DocsCompetitiveAnalysis";
import DocsRolesUserJourneys from "./pages/docs/DocsRolesUserJourneys";
import DocsMarketPosition from "./pages/docs/DocsMarketPosition";
import PitchDeck from "./pages/PitchDeck";
import FeaturesShowcase from "./pages/FeaturesShowcase";
import ProductDemo from "./pages/ProductDemo";
import AdminAnalytics from "./pages/AdminAnalytics";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/docs" element={<DocsCover />} />
              <Route path="/docs/executive-summary" element={<DocsExecutiveSummary />} />
              <Route path="/docs/core-features" element={<DocsCoreFeatures />} />
              <Route path="/docs/technical-specs" element={<DocsTechnicalSpecs />} />
              <Route path="/docs/ai-integration" element={<DocsAIIntegration />} />
              <Route path="/docs/competitive-analysis" element={<DocsCompetitiveAnalysis />} />
              <Route path="/docs/roles-user-journeys" element={<DocsRolesUserJourneys />} />
              <Route path="/docs/market-position" element={<DocsMarketPosition />} />
              <Route path="/pitch-deck" element={<PitchDeck />} />
              <Route path="/features" element={<FeaturesShowcase />} />
              <Route path="/demo" element={<ProductDemo />} />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/integrations"
                element={
                  <ProtectedRoute>
                    <Integrations />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
