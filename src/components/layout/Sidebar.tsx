import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  FolderKanban,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inbox', label: 'Smart Inbox', icon: Inbox, badge: 4 },
  { id: 'tasks', label: 'Task Board', icon: CheckSquare },
  { id: 'meetings', label: 'Meeting Hub', icon: Calendar },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'strategy', label: 'Strategy', icon: BarChart3 },
  { id: 'team', label: 'Team', icon: Users },
];

const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-50',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="nexus-fade-in">
              <h1 className="font-semibold text-foreground">Nexus</h1>
              <p className="text-xs text-muted-foreground">Project OS</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto nexus-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'nexus-sidebar-item w-full',
                isActive && 'nexus-sidebar-item-active'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings & Collapse */}
      <div className="p-4 border-t border-border space-y-1">
        <button
          onClick={() => onViewChange('settings')}
          className={cn(
            'nexus-sidebar-item w-full',
            activeView === 'settings' && 'nexus-sidebar-item-active'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Settings</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="nexus-sidebar-item w-full justify-center"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="flex-1 text-left">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
