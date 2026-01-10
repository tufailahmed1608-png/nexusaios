import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SignalEngineView } from "@/components/signals/SignalEngineView";
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePresence } from '@/hooks/usePresence';
import AIChatButton from '@/components/chat/AIChatButton';

export default function SignalEnginePage() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();
  const { onlineUsers } = usePresence('signals');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        activeView="signals" 
        onViewChange={() => {}}
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
          <SignalEngineView />
        </main>
      </div>
      
      <AIChatButton />
    </div>
  );
}
