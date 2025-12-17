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
    'productDocs': 'Product Docs',
    'pitchDeck': 'Pitch Deck',
    
    // Dashboard
    'overview': 'Overview',
    'executiveDashboard': 'Executive Dashboard',
    'realtimeOverview': 'Real-time overview of your project portfolio',
    'activeProjects': 'Active Projects',
    'pendingTasks': 'Pending Tasks',
    'teamMembers': 'Team Members',
    'completionRate': 'Completion Rate',
    'portfolioHealth': 'Portfolio Health',
    'budgetOverview': 'Budget Overview',
    'teamVelocity': 'Team Velocity',
    'recentProjects': 'Recent Projects',
    'onTrack': 'On Track',
    'atRisk': 'At Risk',
    'delayed': 'Delayed',
    'allocated': 'Allocated',
    'spent': 'Spent',
    'remaining': 'Remaining',
    'tasksCompleted': 'Tasks Completed',
    
    // Smart Inbox
    'smartInbox': 'Smart Inbox',
    'aiPoweredEmail': 'AI-powered email analysis and task extraction',
    'sentiment': 'Sentiment',
    'extractedTasks': 'Extracted Tasks',
    'reply': 'Reply',
    'attach': 'Attach',
    'aiReply': 'AI Reply',
    'send': 'Send',
    'replyingTo': 'Replying to',
    'typeYourReply': 'Type your reply...',
    'selectEmailToView': 'Select an email to view',
    'positive': 'Positive',
    'negative': 'Negative',
    'neutral': 'Neutral',
    'operational': 'Operational',
    'tactical': 'Tactical',
    'strategic': 'Strategic',
    'executive': 'Executive',
    
    // Task Board
    'taskBoard': 'Task Board',
    'manageAndTrack': 'Manage and track all your tasks',
    'newTask': 'New Task',
    'addTask': '+ Add task',
    'backlog': 'Backlog',
    'toDo': 'To Do',
    'inProgress': 'In Progress',
    'review': 'Review',
    'done': 'Done',
    'critical': 'Critical',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
    
    // Projects
    'totalProjects': 'Total Projects',
    'totalBudget': 'Total Budget',
    'avgProgress': 'Avg Progress',
    'acrossAllProjects': 'Across all projects',
    'assignedToProjects': 'Assigned to projects',
    'cards': 'Cards',
    'timeline': 'Timeline',
    
    // Team
    'departmentDistribution': 'Department Distribution',
    'teamSkillsOverview': 'Team Skills Overview',
    'workloadDistribution': 'Workload Distribution',
    
    // Meetings
    'meetingHub': 'Meeting Hub',
    'scheduleMeetings': 'Schedule meetings and manage transcripts',
    'upcomingMeetings': 'Upcoming Meetings',
    'pastMeetings': 'Past Meetings',
    
    // Documents
    'documentsAndTemplates': 'Documents & Templates',
    'manageDocuments': 'Manage project documents and use templates',
    'templates': 'Templates',
    
    // Reports
    'reportsAndAnalytics': 'Reports & Analytics',
    'generateReports': 'Generate AI-powered reports and analytics',
    
    // Settings
    'profile': 'Profile',
    'security': 'Security',
    'integrations': 'Integrations',
    'mcpSettings': 'MCP Settings',
    'resources': 'Resources',
    'profileInformation': 'Profile Information',
    'updateProfileDetails': 'Update your profile details and photo',
    'displayName': 'Display Name',
    'email': 'Email',
    'emailCannotChange': 'Email cannot be changed',
    'uploadPhoto': 'Upload Photo',
    'saveChanges': 'Save Changes',
    'changePassword': 'Change Password',
    'updatePasswordSecure': 'Update your password to keep your account secure',
    'currentPassword': 'Current Password',
    'newPassword': 'New Password',
    'confirmPassword': 'Confirm Password',
    'updatePassword': 'Update Password',
    'emailAccounts': 'Email Accounts',
    'connectEmailAccounts': 'Connect email accounts to sync with Nexus',
    'connectGmail': 'Connect your Gmail account',
    'connectOutlook': 'Connect your Outlook account',
    'connectedAccounts': 'Connected Accounts',
    'cloudStorage': 'Cloud Storage',
    'connectCloudStorage': 'Connect cloud storage services to access your files',
    'googleDrive': 'Google Drive',
    'accessGoogleDrive': 'Access files from Google Drive',
    'oneDrive': 'OneDrive',
    'accessOneDrive': 'Access files from Microsoft OneDrive',
    'connect': 'Connect',
    'disconnect': 'Disconnect',
    'mcpServerConfig': 'MCP Server Configuration',
    'configureMcp': 'Configure your Model Context Protocol server settings',
    'serverUrl': 'Server URL',
    'mcpServerUrl': 'The URL of your MCP server endpoint',
    'apiKey': 'API Key',
    'mcpApiKey': 'Your MCP server API key',
    'saveSettings': 'Save Settings',
    'resourcesAndDocs': 'Resources & Documentation',
    'accessDocs': 'Access product documentation and resources',
    'viewPitchDeck': 'View the Nexus Project OS pitch deck presentation',
    'viewProductDocs': 'Access detailed product documentation and guides',
    
    // Common
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'add': 'Add',
    'remove': 'Remove',
    'search': 'Search',
    'filter': 'Filter',
    'all': 'All',
    'today': 'Today',
    'thisWeek': 'This Week',
    'thisMonth': 'This Month',
    'noData': 'No data available',
    'error': 'Error',
    'success': 'Success',
    
    // AI Chat
    'aiAssistant': 'Nexus AI',
    'aiAssistantDesc': 'Your project management assistant',
    'aiWelcome': 'Hi! I\'m Nexus AI. How can I help you with your projects today?',
    'typeMessage': 'Type a message...',
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
    'productDocs': 'وثائق المنتج',
    'pitchDeck': 'عرض تقديمي',
    
    // Dashboard
    'overview': 'نظرة عامة',
    'executiveDashboard': 'لوحة التحكم التنفيذية',
    'realtimeOverview': 'نظرة عامة في الوقت الحقيقي على محفظة مشاريعك',
    'activeProjects': 'المشاريع النشطة',
    'pendingTasks': 'المهام المعلقة',
    'teamMembers': 'أعضاء الفريق',
    'completionRate': 'معدل الإنجاز',
    'portfolioHealth': 'صحة المحفظة',
    'budgetOverview': 'نظرة عامة على الميزانية',
    'teamVelocity': 'سرعة الفريق',
    'recentProjects': 'المشاريع الأخيرة',
    'onTrack': 'في المسار',
    'atRisk': 'في خطر',
    'delayed': 'متأخر',
    'allocated': 'مخصص',
    'spent': 'منفق',
    'remaining': 'متبقي',
    'tasksCompleted': 'المهام المكتملة',
    
    // Smart Inbox
    'smartInbox': 'البريد الذكي',
    'aiPoweredEmail': 'تحليل البريد واستخراج المهام بالذكاء الاصطناعي',
    'sentiment': 'المشاعر',
    'extractedTasks': 'المهام المستخرجة',
    'reply': 'رد',
    'attach': 'إرفاق',
    'aiReply': 'رد ذكي',
    'send': 'إرسال',
    'replyingTo': 'الرد على',
    'typeYourReply': 'اكتب ردك...',
    'selectEmailToView': 'اختر بريداً للعرض',
    'positive': 'إيجابي',
    'negative': 'سلبي',
    'neutral': 'محايد',
    'operational': 'تشغيلي',
    'tactical': 'تكتيكي',
    'strategic': 'استراتيجي',
    'executive': 'تنفيذي',
    
    // Task Board
    'taskBoard': 'لوحة المهام',
    'manageAndTrack': 'إدارة وتتبع جميع مهامك',
    'newTask': 'مهمة جديدة',
    'addTask': '+ إضافة مهمة',
    'backlog': 'قائمة الانتظار',
    'toDo': 'للتنفيذ',
    'inProgress': 'قيد التنفيذ',
    'review': 'مراجعة',
    'done': 'مكتمل',
    'critical': 'حرج',
    'high': 'عالي',
    'medium': 'متوسط',
    'low': 'منخفض',
    
    // Projects
    'totalProjects': 'إجمالي المشاريع',
    'totalBudget': 'إجمالي الميزانية',
    'avgProgress': 'متوسط التقدم',
    'acrossAllProjects': 'عبر جميع المشاريع',
    'assignedToProjects': 'معين للمشاريع',
    'cards': 'بطاقات',
    'timeline': 'الجدول الزمني',
    
    // Team
    'departmentDistribution': 'توزيع الأقسام',
    'teamSkillsOverview': 'نظرة عامة على مهارات الفريق',
    'workloadDistribution': 'توزيع عبء العمل',
    
    // Meetings
    'meetingHub': 'مركز الاجتماعات',
    'scheduleMeetings': 'جدولة الاجتماعات وإدارة المحاضر',
    'upcomingMeetings': 'الاجتماعات القادمة',
    'pastMeetings': 'الاجتماعات السابقة',
    
    // Documents
    'documentsAndTemplates': 'المستندات والقوالب',
    'manageDocuments': 'إدارة مستندات المشروع واستخدام القوالب',
    'templates': 'القوالب',
    
    // Reports
    'reportsAndAnalytics': 'التقارير والتحليلات',
    'generateReports': 'إنشاء تقارير وتحليلات بالذكاء الاصطناعي',
    
    // Settings
    'profile': 'الملف الشخصي',
    'security': 'الأمان',
    'integrations': 'التكاملات',
    'mcpSettings': 'إعدادات MCP',
    'resources': 'الموارد',
    'profileInformation': 'معلومات الملف الشخصي',
    'updateProfileDetails': 'تحديث تفاصيل ملفك الشخصي وصورتك',
    'displayName': 'الاسم المعروض',
    'email': 'البريد الإلكتروني',
    'emailCannotChange': 'لا يمكن تغيير البريد الإلكتروني',
    'uploadPhoto': 'رفع صورة',
    'saveChanges': 'حفظ التغييرات',
    'changePassword': 'تغيير كلمة المرور',
    'updatePasswordSecure': 'تحديث كلمة المرور للحفاظ على أمان حسابك',
    'currentPassword': 'كلمة المرور الحالية',
    'newPassword': 'كلمة المرور الجديدة',
    'confirmPassword': 'تأكيد كلمة المرور',
    'updatePassword': 'تحديث كلمة المرور',
    'emailAccounts': 'حسابات البريد',
    'connectEmailAccounts': 'ربط حسابات البريد للمزامنة مع نيكسس',
    'connectGmail': 'ربط حساب Gmail الخاص بك',
    'connectOutlook': 'ربط حساب Outlook الخاص بك',
    'connectedAccounts': 'الحسابات المتصلة',
    'cloudStorage': 'التخزين السحابي',
    'connectCloudStorage': 'ربط خدمات التخزين السحابي للوصول إلى ملفاتك',
    'googleDrive': 'جوجل درايف',
    'accessGoogleDrive': 'الوصول إلى الملفات من جوجل درايف',
    'oneDrive': 'ون درايف',
    'accessOneDrive': 'الوصول إلى الملفات من مايكروسوفت ون درايف',
    'connect': 'اتصال',
    'disconnect': 'قطع الاتصال',
    'mcpServerConfig': 'إعدادات خادم MCP',
    'configureMcp': 'تكوين إعدادات خادم بروتوكول سياق النموذج',
    'serverUrl': 'عنوان الخادم',
    'mcpServerUrl': 'عنوان URL لنقطة نهاية خادم MCP',
    'apiKey': 'مفتاح API',
    'mcpApiKey': 'مفتاح API لخادم MCP الخاص بك',
    'saveSettings': 'حفظ الإعدادات',
    'resourcesAndDocs': 'الموارد والوثائق',
    'accessDocs': 'الوصول إلى وثائق المنتج والموارد',
    'viewPitchDeck': 'عرض العرض التقديمي لنيكسس',
    'viewProductDocs': 'الوصول إلى وثائق المنتج والأدلة التفصيلية',
    
    // Common
    'loading': 'جاري التحميل...',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'delete': 'حذف',
    'edit': 'تعديل',
    'view': 'عرض',
    'add': 'إضافة',
    'remove': 'إزالة',
    'search': 'بحث',
    'filter': 'تصفية',
    'all': 'الكل',
    'today': 'اليوم',
    'thisWeek': 'هذا الأسبوع',
    'thisMonth': 'هذا الشهر',
    'noData': 'لا توجد بيانات',
    'error': 'خطأ',
    'success': 'نجاح',
    
    // AI Chat
    'aiAssistant': 'نيكسس الذكي',
    'aiAssistantDesc': 'مساعدك في إدارة المشاريع',
    'aiWelcome': 'مرحباً! أنا نيكسس الذكي. كيف يمكنني مساعدتك في مشاريعك اليوم؟',
    'typeMessage': 'اكتب رسالة...',
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
