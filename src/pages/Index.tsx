import { useState, useEffect } from 'react';
import TopNav from '@/components/layout/TopNav';
import Dashboard from '@/components/dashboard/Dashboard';
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
import AIChatButton from '@/components/chat/AIChatButton';
import { usePresence } from '@/hooks/usePresence';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const { onlineUsers } = usePresence(activeView);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inbox':
        return <SmartInbox />;
      case 'tasks':
        return <TaskBoard />;
      case 'calendar':
        return <CalendarView />;
      case 'meetings':
        return <MeetingHub />;
      case 'projects':
        return <ProjectsView />;
      case 'documents':
        return <DocumentsView />;
      case 'stakeholders':
        return <StakeholderView />;
      case 'reports':
        return <ReportsView />;
      case 'weeklyDigest':
        return <WeeklyDigestView />;
      case 'riskPrediction':
        return <RiskPredictionView />;
      case 'activity':
        return <ActivityView />;
      case 'strategy':
        return <StrategyView />;
      case 'team':
        return <TeamView />;
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
      <TopNav 
        activeView={activeView} 
        onViewChange={setActiveView}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        onlineUsers={onlineUsers}
      />
      
      <main className="p-4 md:p-6 min-h-[calc(100vh-64px)]">
        {renderContent()}
      </main>
      
      <AIChatButton />
    </div>
  );
};

export default Index;
