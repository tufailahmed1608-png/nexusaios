import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  FileText, 
  Clock,
  Sparkles,
  Target,
  Lightbulb,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AIExplanation {
  model?: string;
  confidence?: number;
  reasoning?: string;
  dataSources?: string[];
  factors?: { name: string; weight: number; description: string }[];
  generatedAt?: string;
  processingTime?: number;
}

interface AIExplainabilityProps {
  explanation: AIExplanation;
  compact?: boolean;
  className?: string;
}

export const AIExplainability = ({ explanation, compact = false, className }: AIExplainabilityProps) => {
  const [isOpen, setIsOpen] = useState(!compact);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-600 dark:text-emerald-400';
    if (confidence >= 0.6) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  if (compact) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Brain className="h-4 w-4" />
            <span>AI Explanation</span>
            {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <ExplanationContent explanation={explanation} />
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Card className={cn('border-primary/20', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          AI Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ExplanationContent explanation={explanation} />
      </CardContent>
    </Card>
  );
};

const ExplanationContent = ({ explanation }: { explanation: AIExplanation }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10';
    if (confidence >= 0.6) return 'text-amber-600 dark:text-amber-400 bg-amber-500/10';
    return 'text-red-600 dark:text-red-400 bg-red-500/10';
  };

  return (
    <div className="space-y-4">
      {/* Model & Confidence */}
      <div className="flex flex-wrap gap-2">
        {explanation.model && (
          <Badge variant="outline" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            {explanation.model}
          </Badge>
        )}
        {explanation.confidence !== undefined && (
          <Badge variant="outline" className={cn('gap-1.5', getConfidenceColor(explanation.confidence))}>
            <Target className="h-3 w-3" />
            {Math.round(explanation.confidence * 100)}% Confidence
          </Badge>
        )}
        {explanation.processingTime && (
          <Badge variant="outline" className="gap-1.5 text-muted-foreground">
            <Clock className="h-3 w-3" />
            {explanation.processingTime}ms
          </Badge>
        )}
      </div>

      {/* Reasoning */}
      {explanation.reasoning && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5" />
            Reasoning
          </div>
          <p className="text-sm text-foreground/80 bg-muted/50 rounded-md p-3">
            {explanation.reasoning}
          </p>
        </div>
      )}

      {/* Factors */}
      {explanation.factors && explanation.factors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            Contributing Factors
          </div>
          <div className="space-y-2">
            {explanation.factors.map((factor, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-2 rounded-md bg-muted/30"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{factor.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(factor.weight * 100)}% weight
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {factor.description}
                  </p>
                </div>
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${factor.weight * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Sources */}
      {explanation.dataSources && explanation.dataSources.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
            Data Sources
          </div>
          <div className="flex flex-wrap gap-1.5">
            {explanation.dataSources.map((source, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs gap-1"
              >
                <FileText className="h-3 w-3" />
                {source}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Generated At */}
      {explanation.generatedAt && (
        <p className="text-xs text-muted-foreground">
          Generated: {new Date(explanation.generatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default AIExplainability;
