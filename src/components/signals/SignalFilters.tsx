import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  MessageSquare, 
  Shield,
  X
} from "lucide-react";
import { SignalCategory, SignalSeverity } from "@/hooks/useEnterpriseSignals";

interface SignalFiltersProps {
  selectedCategories: SignalCategory[];
  selectedSeverities: SignalSeverity[];
  showResolved: boolean;
  onCategoryToggle: (category: SignalCategory) => void;
  onSeverityToggle: (severity: SignalSeverity) => void;
  onShowResolvedToggle: () => void;
  onClearFilters: () => void;
}

const categories: { value: SignalCategory; label: string; icon: React.ElementType }[] = [
  { value: 'project', label: 'Project', icon: AlertTriangle },
  { value: 'communication', label: 'Communication', icon: MessageSquare },
  { value: 'governance', label: 'Governance', icon: Shield },
];

const severities: { value: SignalSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-muted' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-destructive' },
];

export function SignalFilters({
  selectedCategories,
  selectedSeverities,
  showResolved,
  onCategoryToggle,
  onSeverityToggle,
  onShowResolvedToggle,
  onClearFilters,
}: SignalFiltersProps) {
  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedSeverities.length > 0 || 
    showResolved;

  return (
    <div className="flex flex-wrap items-center gap-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Category:</span>
        <div className="flex gap-1">
          {categories.map(({ value, label, icon: Icon }) => (
            <Badge
              key={value}
              variant={selectedCategories.includes(value) ? "default" : "outline"}
              className="cursor-pointer gap-1"
              onClick={() => onCategoryToggle(value)}
            >
              <Icon className="h-3 w-3" />
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Severity:</span>
        <div className="flex gap-1">
          {severities.map(({ value, label, color }) => (
            <Badge
              key={value}
              variant={selectedSeverities.includes(value) ? "default" : "outline"}
              className="cursor-pointer gap-1"
              onClick={() => onSeverityToggle(value)}
            >
              <div className={`w-2 h-2 rounded-full ${color}`} />
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-border" />

      <Badge
        variant={showResolved ? "default" : "outline"}
        className="cursor-pointer"
        onClick={onShowResolvedToggle}
      >
        Show Resolved
      </Badge>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-6 px-2 text-xs"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
