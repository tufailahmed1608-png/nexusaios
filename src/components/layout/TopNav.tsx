import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  CalendarDays,
  Video,
  BarChart3,
  Settings,
  Users,
  FolderKanban,
  FileText,
  UserCircle,
  Activity,
  ClipboardList,
  Brain,
  Calendar,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Search,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import NotificationBell from '@/components/notifications/NotificationBell';
import OnlineUsers from '@/components/collaboration/OnlineUsers';
import nexusLogo from '@/assets/nexus-logo.png';
import { PresenceUser } from '@/hooks/usePresence';

interface TopNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onlineUsers?: PresenceUser[];
}

const primaryNavItems = [
  { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { id: 'projects', labelKey: 'projects', icon: FolderKanban },
  { id: 'inbox', labelKey: 'inbox', icon: Inbox, badge: 4 },
  { id: 'meetings', labelKey: 'meetings', icon: Video },
  { id: 'calendar', labelKey: 'calendar', icon: CalendarDays },
  { id: 'tasks', labelKey: 'tasks', icon: CheckSquare },
];

const secondaryNavItems = [
  { id: 'documents', labelKey: 'documents', icon: FileText },
  { id: 'stakeholders', labelKey: 'stakeholders', icon: UserCircle },
  { id: 'reports', labelKey: 'reports', icon: ClipboardList },
  { id: 'weeklyDigest', labelKey: 'weeklyDigest', icon: Calendar },
  { id: 'riskPrediction', labelKey: 'riskPrediction', icon: Brain },
  { id: 'activity', labelKey: 'activity', icon: Activity },
  { id: 'strategy', labelKey: 'strategy', icon: BarChart3 },
  { id: 'team', labelKey: 'team', icon: Users },
];

const TopNav = ({ activeView, onViewChange, isDark, onThemeToggle, onlineUsers = [] }: TopNavProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  const NavButton = ({ item, compact = false }: { item: typeof primaryNavItems[0]; compact?: boolean }) => {
    const Icon = item.icon;
    const isActive = activeView === item.id;

    return (
      <button
        onClick={() => handleViewChange(item.id)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
          compact && 'px-2'
        )}
      >
        <Icon className="w-4 h-4" />
        {!compact && <span>{t(item.labelKey)}</span>}
        {item.badge && !compact && (
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Main Nav Row */}
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img src={nexusLogo} alt="Nexus Logo" className="w-10 h-10 rounded-xl object-cover" />
          {!isMobile && (
            <div>
              <h1 className="font-semibold text-foreground">Nexus</h1>
              <p className="text-xs text-muted-foreground">Project OS</p>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-1 bg-muted/30 rounded-full p-1.5 mx-4">
            {primaryNavItems.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-3 text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? (
                    <>
                      <span className="text-sm">{t('less')}</span>
                      <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm">{t('more')}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}

          {/* Search */}
          {!isMobile && (
            <div className="relative w-48 lg:w-64">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                placeholder={t('search.placeholder')}
                className={`${isRTL ? 'pr-10' : 'pl-10'} nexus-input h-9`}
              />
            </div>
          )}

          {/* Online Users */}
          {onlineUsers.length > 0 && !isMobile && (
            <OnlineUsers users={onlineUsers} maxVisible={3} />
          )}

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-muted-foreground hover:text-foreground gap-1.5 px-2"
          >
            <span className="text-base">{language === 'en' ? '🇸🇦' : '🇺🇸'}</span>
            {!isMobile && (
              <span className="text-xs font-medium">{language === 'en' ? 'عربي' : 'English'}</span>
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <NotificationBell />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground px-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                {!isMobile && (
                  <span className="text-sm font-medium max-w-[80px] truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.email?.split('@')[0]}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expanded Secondary Nav (Desktop) */}
      {!isMobile && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <div className="px-4 md:px-6 pb-3">
              <nav className="flex items-center gap-1 flex-wrap justify-center bg-muted/20 rounded-full p-1.5 max-w-fit mx-auto">
                {secondaryNavItems.map((item) => (
                  <NavButton key={item.id} item={item} />
                ))}
              </nav>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg p-4 animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="relative mb-4">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              placeholder={t('search.placeholder')}
              className={`${isRTL ? 'pr-10' : 'pl-10'} nexus-input`}
            />
          </div>

          {/* Mobile Nav Grid */}
          <div className="grid grid-cols-3 gap-2">
            {[...primaryNavItems, ...secondaryNavItems].map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="truncate w-full text-center">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
