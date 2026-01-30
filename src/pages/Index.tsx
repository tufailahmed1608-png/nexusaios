import React, { useState, useEffect, Suspense, lazy } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import SmartInbox from '@/components/inbox/SmartInbox';
import TaskBoard from '@/components/tasks/TaskBoard';
import MeetingHub from '@/components/meetings/MeetingHub';
import CalendarView from '@/components/calendar/CalendarView';
import StrategyView from '@/components/strategy/StrategyView';
import ProjectsView from '@/components/projects/ProjectsView';
import TeamView from '@/components/team/TeamView';
import DocumentsView from '@/components/documents/DocumentsView';
import StakeholderView from '@/components/stakeholders/StakeholderView';
import ActivityView from '@/components/activity/ActivityView';
import ReportsView from '@/components/reports/ReportsView';
import RiskPredictionView from '@/components/risk/RiskPredictionView';
import WeeklyDigestView from '@/components/digest/WeeklyDigestView';
import DecisionLog from '@/components/decisions/DecisionLog';
import AIControlsView from '@/components/ai/AIControlsView';
import { KnowledgeBase } from '@/components/knowledge/KnowledgeBase';
import { BrandingView } from '@/components/branding/BrandingView';
import { SignalEngineView } from '@/components/signals/SignalEngineView';
import { ProtectedFeature } from '@/components/auth/ProtectedFeature';
import AIChatButton from '@/components/chat/AIChatButton';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePresence } from '@/hooks/usePresence';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { useUserRole } from '@/hooks/useUserRole';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();
  const { onlineUsers } = usePresence(activeView);
  const { trackAction } = useActivityTracking();
  const { role } = useUserRole();
  
  const isExecutive = role === 'executive';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    trackAction({ actionType: 'feature_usage', actionDetails: { view, feature: 'navigation' } });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        // Show Executive Dashboard for executive role
        return isExecutive ? (
          <ExecutiveDashboard />
        ) : (
          <Dashboard onNavigateToSignals={() => setActiveView('signals')} />
        );
      case 'inbox':
        return <SmartInbox />;
      case 'tasks':
        return <TaskBoard />;
      case 'calendar':
        return <CalendarView />;
      case 'meetings':
        return (
          <ProtectedFeature feature="meetings">
            <MeetingHub />
          </ProtectedFeature>
        );
      case 'projects':
        return (
          <ProtectedFeature feature="projects">
            <ProjectsView />
          </ProtectedFeature>
        );
      case 'signals':
        return (
          <ProtectedFeature feature="signals">
            <SignalEngineView />
          </ProtectedFeature>
        );
      case 'documents':
        return <DocumentsView />;
      case 'stakeholders':
        return (
          <ProtectedFeature feature="stakeholders">
            <StakeholderView />
          </ProtectedFeature>
        );
      case 'reports':
        return (
          <ProtectedFeature feature="reports">
            <ReportsView />
          </ProtectedFeature>
        );
      case 'weeklyDigest':
        return (
          <ProtectedFeature feature="weeklyDigest">
            <WeeklyDigestView />
          </ProtectedFeature>
        );
      case 'riskPrediction':
        return (
          <ProtectedFeature feature="riskPrediction">
            <RiskPredictionView />
          </ProtectedFeature>
        );
      case 'activity':
        return (
          <ProtectedFeature feature="activity">
            <ActivityView />
          </ProtectedFeature>
        );
      case 'decisions':
        return (
          <ProtectedFeature feature="decisions">
            <DecisionLog />
          </ProtectedFeature>
        );
      case 'strategy':
        return (
          <ProtectedFeature feature="strategy">
            <StrategyView />
          </ProtectedFeature>
        );
      case 'team':
        return (
          <ProtectedFeature feature="team">
            <TeamView />
          </ProtectedFeature>
        );
      case 'knowledge':
        return (
          <ProtectedFeature feature="knowledge">
            <KnowledgeBase />
          </ProtectedFeature>
        );
      case 'branding':
        return (
          <ProtectedFeature feature="branding">
            <BrandingView />
          </ProtectedFeature>
        );
      case 'aiControls':
        return (
          <ProtectedFeature feature="aiControls">
            <AIControlsView />
          </ProtectedFeature>
        );
      case 'tenantSettings': {
        const TenantSettings = lazy(() => import('@/components/admin/TenantSettings'));
        return (
          <ProtectedFeature feature="tenantSettings">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              <TenantSettings />
            </Suspense>
          </ProtectedFeature>
        );
      }
      case 'settings':
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
              <p>Configuration options coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      
      <div className={cn(
        'transition-all duration-300',
        !isMobile && (isRTL ? 'mr-72' : 'ml-72')
      )}>
        <Header 
          isDark={isDark} 
          onThemeToggle={() => setIsDark(!isDark)}
          onMenuClick={() => setSidebarOpen(true)}
          onlineUsers={onlineUsers}
        />
        
        <main className="p-4 md:p-6 min-h-[calc(100vh-64px)]">
          {renderContent()}
        </main>
      </div>
      
      <AIChatButton />
    </div>
  );
};

export default Index;
