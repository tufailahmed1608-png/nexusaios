import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Shield, 
  Eye, 
  Brain, 
  Database,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIScopeVisualizer from '@/components/ai/AIScopeVisualizer';
import { AIExplainability, AIExplanation } from '@/components/ai/AIExplainability';
import { WhyAmISeeingThis, createRoleBasedReason, createAIReason } from '@/components/ai/WhyAmISeeingThis';
import { TrustIndicator } from '@/components/ai/TrustIndicator';
import { AIOutputStatusBadge, AIOutputStatusWorkflow, AIOutputState } from '@/components/reports/AIOutputStatus';
import { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';

const AIControlsView = () => {
  const navigate = useNavigate();
  const { role } = useUserRole();
  const [demoStatus, setDemoStatus] = useState<AIOutputState>('draft');

  // Demo explanation data
  const demoExplanation: AIExplanation = {
    model: 'gemini-2.5-flash',
    confidence: 0.87,
    reasoning: 'This recommendation is based on your recent project activity, team workload patterns, and historical task completion data. The AI identified a potential resource bottleneck in the upcoming sprint.',
    dataSources: ['Project Data', 'Task History', 'Team Calendar', 'Risk Registry'],
    factors: [
      { name: 'Workload Analysis', weight: 0.35, description: 'Current team capacity vs upcoming tasks' },
      { name: 'Historical Patterns', weight: 0.30, description: 'Past sprint performance data' },
      { name: 'Risk Indicators', weight: 0.25, description: 'Active risk factors in the project' },
      { name: 'Dependencies', weight: 0.10, description: 'Cross-team dependencies' },
    ],
    generatedAt: new Date().toISOString(),
    processingTime: 245,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Trustworthy AI Controls
            </h1>
            <p className="text-muted-foreground">
              Understand, control, and verify AI-powered features
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="scope" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scope" className="gap-2">
            <Database className="h-4 w-4" />
            AI Scope
          </TabsTrigger>
          <TabsTrigger value="outputs" className="gap-2">
            <Eye className="h-4 w-4" />
            Output States
          </TabsTrigger>
          <TabsTrigger value="explainability" className="gap-2">
            <Brain className="h-4 w-4" />
            Explainability
          </TabsTrigger>
          <TabsTrigger value="trust" className="gap-2">
            <Shield className="h-4 w-4" />
            Trust Indicators
          </TabsTrigger>
        </TabsList>

        {/* AI Scope Tab */}
        <TabsContent value="scope">
          <AIScopeVisualizer />
        </TabsContent>

        {/* Output States Tab */}
        <TabsContent value="outputs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                AI Output State Management
              </CardTitle>
              <CardDescription>
                Track the lifecycle of AI-generated content from draft to publication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* State Badges */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Status Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <AIOutputStatusBadge status="draft" />
                  <AIOutputStatusBadge status="reviewed" />
                  <AIOutputStatusBadge status="approved" />
                  <AIOutputStatusBadge status="published" />
                </div>
              </div>

              {/* Interactive Workflow */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Interactive Workflow</h4>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <AIOutputStatusWorkflow 
                    status={demoStatus} 
                    onStatusChange={setDemoStatus}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the action button to advance through the workflow stages
                </p>
              </div>

              {/* Workflow Explanation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { status: 'draft', desc: 'AI has generated content that needs human review' },
                  { status: 'reviewed', desc: 'A team member has reviewed the content' },
                  { status: 'approved', desc: 'Content approved by authorized personnel' },
                  { status: 'published', desc: 'Content is live and visible to stakeholders' },
                ].map((item) => (
                  <div key={item.status} className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <AIOutputStatusBadge status={item.status as AIOutputState} size="sm" />
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Explainability Tab */}
        <TabsContent value="explainability" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Explanation Card */}
            <AIExplainability explanation={demoExplanation} />

            {/* Compact Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Compact Explainability</CardTitle>
                <CardDescription>
                  Expandable explanation for inline use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <p className="text-sm mb-3">
                    AI recommends allocating 2 additional resources to Sprint 12 to meet the deadline.
                  </p>
                  <AIExplainability explanation={demoExplanation} compact />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* "Why am I seeing this?" Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Why Am I Seeing This?
                {role && (
                  <WhyAmISeeingThis
                    itemType="section"
                    reasons={[
                      createRoleBasedReason(role, 'AI Controls'),
                      createAIReason('content'),
                    ]}
                  />
                )}
              </CardTitle>
              <CardDescription>
                Contextual explanations for content visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Demo Items with Why tooltips */}
                {[
                  { 
                    title: 'Risk Alert: Budget Overrun Predicted',
                    type: 'alert',
                    reasons: [
                      { type: 'ai' as const, title: 'AI Prediction', description: 'Based on spending patterns and project timeline' },
                      { type: 'role' as const, title: 'Role Access', description: 'Visible to Program Managers and above' },
                    ]
                  },
                  { 
                    title: 'Recommended: Schedule team sync',
                    type: 'recommendation',
                    reasons: [
                      { type: 'personalization' as const, title: 'Personalized', description: 'Based on your calendar and team availability' },
                      { type: 'ai' as const, title: 'AI Suggestion', description: 'Detected communication gaps in recent activity' },
                    ]
                  },
                  { 
                    title: 'Q4 Executive Summary',
                    type: 'report',
                    reasons: [
                      { type: 'ownership' as const, title: 'Your Team', description: 'Report generated for your portfolio' },
                      { type: 'time' as const, title: 'Recent', description: 'Generated within the last 24 hours' },
                    ]
                  },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{item.type}</Badge>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <WhyAmISeeingThis
                      itemType={item.type}
                      reasons={item.reasons}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Indicators Tab */}
        <TabsContent value="trust" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Trust Indicators
              </CardTitle>
              <CardDescription>
                Visual indicators showing content source and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Indicator Types */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Indicator Types</h4>
                <div className="flex flex-wrap gap-3">
                  <TrustIndicator isAIGenerated />
                  <TrustIndicator isAIGenerated isHumanReviewed />
                  <TrustIndicator isAIGenerated isHumanReviewed isApproved />
                  <TrustIndicator isAIGenerated confidenceScore={0.92} />
                </div>
              </div>

              {/* Size Variants */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Size Variants</h4>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <TrustIndicator isAIGenerated isApproved size="sm" />
                    <p className="text-xs text-muted-foreground mt-1">Small</p>
                  </div>
                  <div className="text-center">
                    <TrustIndicator isAIGenerated isApproved size="md" />
                    <p className="text-xs text-muted-foreground mt-1">Medium</p>
                  </div>
                  <div className="text-center">
                    <TrustIndicator isAIGenerated isApproved size="lg" />
                    <p className="text-xs text-muted-foreground mt-1">Large</p>
                  </div>
                </div>
              </div>

              {/* In Context Examples */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">In Context</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Weekly Status Report', ai: true, reviewed: true, approved: true, confidence: 0.95 },
                    { title: 'Risk Assessment Summary', ai: true, reviewed: true, approved: false, confidence: 0.78 },
                    { title: 'Resource Recommendation', ai: true, reviewed: false, approved: false, confidence: 0.65 },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <span className="font-medium">{item.title}</span>
                      <TrustIndicator 
                        isAIGenerated={item.ai}
                        isHumanReviewed={item.reviewed}
                        isApproved={item.approved}
                        confidenceScore={item.confidence}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIControlsView;
