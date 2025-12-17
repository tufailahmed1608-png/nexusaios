import { Moon, Sun, Search, User, LogOut, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationBell from '@/components/notifications/NotificationBell';
import OnlineUsers from '@/components/collaboration/OnlineUsers';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { PresenceUser } from '@/hooks/usePresence';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onMenuClick?: () => void;
  onlineUsers?: PresenceUser[];
}

const Header = ({ isDark, onThemeToggle, onMenuClick, onlineUsers = [] }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-muted-foreground hover:text-foreground mr-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={isMobile ? t('search.placeholder').split(' ')[0] + '...' : t('search.placeholder')}
            className={`${isRTL ? 'pr-10' : 'pl-10'} nexus-input`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div className="hidden md:block">
            <OnlineUsers users={onlineUsers} maxVisible={3} />
          </div>
        )}

        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-muted-foreground hover:text-foreground gap-1.5 px-2 md:px-3"
        >
          <span className="text-base">{language === 'en' ? '🇸🇦' : '🇺🇸'}</span>
          <span className="text-xs font-medium hidden sm:inline">{language === 'en' ? 'عربي' : 'English'}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <NotificationBell />

        <div className="w-px h-8 bg-border mx-1 md:mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground px-2 md:px-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium max-w-[80px] md:max-w-[120px] truncate hidden sm:inline">
                {user?.email?.split('@')[0] || 'User'}
              </span>
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
    </header>
  );
};

export default Header;
