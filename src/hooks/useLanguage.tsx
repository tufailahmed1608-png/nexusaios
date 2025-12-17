import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'search.placeholder': 'Search projects, tasks, emails...',
    'settings': 'Settings',
    'signOut': 'Sign Out',
    
    // Sidebar
    'dashboard': 'Dashboard',
    'inbox': 'Smart Inbox',
    'tasks': 'Task Board',
    'projects': 'Projects',
    'meetings': 'Meeting Hub',
    'documents': 'Documents',
    'reports': 'Reports',
    'team': 'Team',
    'stakeholders': 'Stakeholders',
    'strategy': 'Strategy',
    'activity': 'Activity',
    'collapse': 'Collapse',
    'expand': 'Expand',
    
    // Dashboard
    'overview': 'Overview',
    'activeProjects': 'Active Projects',
    'pendingTasks': 'Pending Tasks',
    'teamMembers': 'Team Members',
    'completionRate': 'Completion Rate',
    'portfolioHealth': 'Portfolio Health',
    'budgetOverview': 'Budget Overview',
    'teamVelocity': 'Team Velocity',
    'recentProjects': 'Recent Projects',
    
    // Settings
    'profile': 'Profile',
    'security': 'Security',
    'integrations': 'Integrations',
    'mcpSettings': 'MCP Settings',
    'displayName': 'Display Name',
    'email': 'Email',
    'saveChanges': 'Save Changes',
    'changePassword': 'Change Password',
    'currentPassword': 'Current Password',
    'newPassword': 'New Password',
    'confirmPassword': 'Confirm Password',
    'updatePassword': 'Update Password',
    'connectedAccounts': 'Connected Accounts',
    'cloudStorage': 'Cloud Storage',
    'connect': 'Connect',
    'disconnect': 'Disconnect',
    'serverUrl': 'Server URL',
    'apiKey': 'API Key',
    'saveSettings': 'Save Settings',
    
    // Common
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'add': 'Add',
    'remove': 'Remove',
  },
  ar: {
    // Header
    'search.placeholder': 'البحث في المشاريع والمهام والبريد...',
    'settings': 'الإعدادات',
    'signOut': 'تسجيل الخروج',
    
    // Sidebar
    'dashboard': 'لوحة التحكم',
    'inbox': 'البريد الذكي',
    'tasks': 'لوحة المهام',
    'projects': 'المشاريع',
    'meetings': 'مركز الاجتماعات',
    'documents': 'المستندات',
    'reports': 'التقارير',
    'team': 'الفريق',
    'stakeholders': 'أصحاب المصلحة',
    'strategy': 'الاستراتيجية',
    'activity': 'النشاط',
    'collapse': 'طي',
    'expand': 'توسيع',
    
    // Dashboard
    'overview': 'نظرة عامة',
    'activeProjects': 'المشاريع النشطة',
    'pendingTasks': 'المهام المعلقة',
    'teamMembers': 'أعضاء الفريق',
    'completionRate': 'معدل الإنجاز',
    'portfolioHealth': 'صحة المحفظة',
    'budgetOverview': 'نظرة عامة على الميزانية',
    'teamVelocity': 'سرعة الفريق',
    'recentProjects': 'المشاريع الأخيرة',
    
    // Settings
    'profile': 'الملف الشخصي',
    'security': 'الأمان',
    'integrations': 'التكاملات',
    'mcpSettings': 'إعدادات MCP',
    'displayName': 'الاسم المعروض',
    'email': 'البريد الإلكتروني',
    'saveChanges': 'حفظ التغييرات',
    'changePassword': 'تغيير كلمة المرور',
    'currentPassword': 'كلمة المرور الحالية',
    'newPassword': 'كلمة المرور الجديدة',
    'confirmPassword': 'تأكيد كلمة المرور',
    'updatePassword': 'تحديث كلمة المرور',
    'connectedAccounts': 'الحسابات المتصلة',
    'cloudStorage': 'التخزين السحابي',
    'connect': 'اتصال',
    'disconnect': 'قطع الاتصال',
    'serverUrl': 'عنوان الخادم',
    'apiKey': 'مفتاح API',
    'saveSettings': 'حفظ الإعدادات',
    
    // Common
    'loading': 'جاري التحميل...',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'delete': 'حذف',
    'edit': 'تعديل',
    'view': 'عرض',
    'add': 'إضافة',
    'remove': 'إزالة',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nexus-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (isRTL) {
      document.body.style.fontFamily = "'Cairo', 'Inter', system-ui, sans-serif";
    } else {
      document.body.style.fontFamily = "'Inter', system-ui, sans-serif";
    }
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
