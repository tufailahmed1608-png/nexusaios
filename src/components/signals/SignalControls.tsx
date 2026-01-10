import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Zap, 
  Trash2, 
  RefreshCw,
  Loader2 
} from "lucide-react";
import { useState } from "react";
import { SignalCategory } from "@/hooks/useEnterpriseSignals";

interface SignalControlsProps {
  onGenerate: (params: { count: number; category?: SignalCategory }) => void;
  onClear: () => void;
  onRefresh: () => void;
  isGenerating: boolean;
  isClearing: boolean;
}

export function SignalControls({
  onGenerate,
  onClear,
  onRefresh,
  isGenerating,
  isClearing,
}: SignalControlsProps) {
  const [count, setCount] = useState(5);
  const [category, setCategory] = useState<SignalCategory | 'all'>('all');

  const handleGenerate = () => {
    onGenerate({
      count,
      category: category === 'all' ? undefined : category,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Generate</span>
        <Input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 5)}
          className="w-20 h-9"
        />
        <span className="text-sm text-muted-foreground">signals</span>
      </div>

      <Select value={category} onValueChange={(v) => setCategory(v as SignalCategory | 'all')}>
        <SelectTrigger className="w-40 h-9">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="project">Project Events</SelectItem>
          <SelectItem value="communication">Communication</SelectItem>
          <SelectItem value="governance">Governance</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleGenerate} disabled={isGenerating} size="sm">
        {isGenerating ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Zap className="h-4 w-4 mr-2" />
        )}
        Generate
      </Button>

      <div className="flex-1" />

      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>

      <Button 
        variant="destructive" 
        size="sm" 
        onClick={onClear}
        disabled={isClearing}
      >
        {isClearing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4 mr-2" />
        )}
        Clear All
      </Button>
    </div>
  );
}
