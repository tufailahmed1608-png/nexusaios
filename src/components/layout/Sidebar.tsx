import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
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
  FileText,
  UserCircle,
  Activity,
  ClipboardList,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { id: 'inbox', labelKey: 'inbox', icon: Inbox, badge: 4 },
  { id: 'tasks', labelKey: 'tasks', icon: CheckSquare },
  { id: 'meetings', labelKey: 'meetings', icon: Calendar },
  { id: 'projects', labelKey: 'projects', icon: FolderKanban },
  { id: 'documents', labelKey: 'documents', icon: FileText },
  { id: 'stakeholders', labelKey: 'stakeholders', icon: UserCircle },
  { id: 'reports', labelKey: 'reports', icon: ClipboardList },
  { id: 'activity', labelKey: 'activity', icon: Activity },
  { id: 'strategy', labelKey: 'strategy', icon: BarChart3 },
  { id: 'team', labelKey: 'team', icon: Users },
];

const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        'fixed top-0 h-screen bg-card border-border flex flex-col transition-all duration-300 z-50',
        isRTL ? 'right-0 border-l' : 'left-0 border-r',
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
                  <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>
                    {t(item.labelKey)}
                  </span>
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

      {/* Settings & Docs */}
      <div className="p-4 border-t border-border space-y-1">
        <button
          onClick={() => navigate('/docs')}
          className="nexus-sidebar-item w-full"
        >
          <BookOpen className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>
              {t('productDocs')}
            </span>
          )}
        </button>

        <button
          onClick={() => onViewChange('settings')}
          className={cn(
            'nexus-sidebar-item w-full',
            activeView === 'settings' && 'nexus-sidebar-item-active'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>
              {t('settings')}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="nexus-sidebar-item w-full justify-center"
        >
          {isCollapsed ? (
            isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>
                {t('collapse')}
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
