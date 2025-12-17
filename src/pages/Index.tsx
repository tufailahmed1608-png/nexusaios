import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import SmartInbox from '@/components/inbox/SmartInbox';
import TaskBoard from '@/components/tasks/TaskBoard';
import MeetingHub from '@/components/meetings/MeetingHub';
import StrategyView from '@/components/strategy/StrategyView';
import ProjectsView from '@/components/projects/ProjectsView';
import TeamView from '@/components/team/TeamView';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      case 'meetings':
        return <MeetingHub />;
      case 'projects':
        return <ProjectsView />;
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
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className={cn('transition-all duration-300', 'ml-72')}>
        <Header isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
        
        <main className="p-6 min-h-[calc(100vh-64px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
