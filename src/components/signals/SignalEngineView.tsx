import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEnterpriseSignals, SignalCategory, SignalSeverity } from "@/hooks/useEnterpriseSignals";
import { SignalStats } from "./SignalStats";
import { SignalControls } from "./SignalControls";
import { SignalFilters } from "./SignalFilters";
import { SignalCard } from "./SignalCard";
import { toast } from "sonner";
import { 
  Activity, 
  AlertTriangle, 
  MessageSquare, 
  Shield,
  Zap
} from "lucide-react";

export function SignalEngineView() {
  const {
    signals,
    stats,
    isLoading,
    generate,
    isGenerating,
    clear,
    isClearing,
    resolve,
    isResolving,
    refetch,
  } = useEnterpriseSignals();

  const [selectedCategories, setSelectedCategories] = useState<SignalCategory[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<SignalSeverity[]>([]);
  const [showResolved, setShowResolved] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filter signals
  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(signal.signal_category)) {
        return false;
      }
      // Severity filter
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(signal.severity)) {
        return false;
      }
      // Resolved filter
      if (!showResolved && signal.is_resolved) {
        return false;
      }
      // Tab filter
      if (activeTab !== 'all' && signal.signal_category !== activeTab) {
        return false;
      }
      return true;
    });
  }, [signals, selectedCategories, selectedSeverities, showResolved, activeTab]);

  const handleGenerate = (params: { count: number; category?: SignalCategory }) => {
    generate(params, {
      onSuccess: () => {
        toast.success(`Generated ${params.count} synthetic signals`);
      },
      onError: (error) => {
        toast.error(`Failed to generate signals: ${error.message}`);
      },
    });
  };

  const handleClear = () => {
    clear(undefined, {
      onSuccess: () => {
        toast.success('Cleared all synthetic signals');
      },
      onError: (error) => {
        toast.error(`Failed to clear signals: ${error.message}`);
      },
    });
  };

  const handleResolve = (id: string) => {
    resolve(
      { id, resolved_by: 'Current User' },
      {
        onSuccess: () => {
          toast.success('Signal marked as resolved');
        },
        onError: (error) => {
          toast.error(`Failed to resolve signal: ${error.message}`);
        },
      }
    );
  };

  const toggleCategory = (category: SignalCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleSeverity = (severity: SignalSeverity) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSeverities([]);
    setShowResolved(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Synthetic Enterprise Signal Engine</h1>
          <p className="text-muted-foreground">
            Generate and monitor realistic enterprise signals for testing
          </p>
        </div>
      </div>

      {/* Stats */}
      <SignalStats stats={stats} isLoading={isLoading} />

      {/* Controls */}
      <SignalControls
        onGenerate={handleGenerate}
        onClear={handleClear}
        onRefresh={refetch}
        isGenerating={isGenerating}
        isClearing={isClearing}
      />

      {/* Signal Stream */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Signal Stream
          </CardTitle>
          <CardDescription>
            Real-time enterprise signals normalized from synthetic data generator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="gap-2">
                <Activity className="h-4 w-4" />
                All ({signals.filter(s => !s.is_resolved || showResolved).length})
              </TabsTrigger>
              <TabsTrigger value="project" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Project ({signals.filter(s => s.signal_category === 'project' && (!s.is_resolved || showResolved)).length})
              </TabsTrigger>
              <TabsTrigger value="communication" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Communication ({signals.filter(s => s.signal_category === 'communication' && (!s.is_resolved || showResolved)).length})
              </TabsTrigger>
              <TabsTrigger value="governance" className="gap-2">
                <Shield className="h-4 w-4" />
                Governance ({signals.filter(s => s.signal_category === 'governance' && (!s.is_resolved || showResolved)).length})
              </TabsTrigger>
            </TabsList>

            <SignalFilters
              selectedCategories={selectedCategories}
              selectedSeverities={selectedSeverities}
              showResolved={showResolved}
              onCategoryToggle={toggleCategory}
              onSeverityToggle={toggleSeverity}
              onShowResolvedToggle={() => setShowResolved(!showResolved)}
              onClearFilters={clearFilters}
            />

            <TabsContent value={activeTab} className="mt-0">
              <ScrollArea className="h-[600px] pr-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                        </CardHeader>
                        <CardContent>
                          <div className="h-12 bg-muted rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredSignals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No signals yet</h3>
                    <p className="text-muted-foreground">
                      Generate synthetic signals to see them here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSignals.map((signal) => (
                      <SignalCard
                        key={signal.id}
                        signal={signal}
                        onResolve={handleResolve}
                        isResolving={isResolving}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
