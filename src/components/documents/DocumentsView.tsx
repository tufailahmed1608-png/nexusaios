import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  FolderOpen,
  Cloud,
  CloudOff,
  Upload,
  Download,
  RefreshCw,
  Search,
  Grid,
  List,
  MoreVertical,
  Star,
  StarOff,
  Trash2,
  Share2,
  ExternalLink,
  Copy,
  Calendar,
  ClipboardList,
  Users,
  MessageSquare,
  FileSpreadsheet,
  Presentation,
  CheckSquare,
  LayoutTemplate,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: 'doc' | 'spreadsheet' | 'presentation' | 'pdf' | 'folder';
  project: string;
  syncSource: 'google' | 'onedrive' | 'local';
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastModified: string;
  size: string;
  starred: boolean;
  sharedWith: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'planning' | 'meeting' | 'communication' | 'tracking' | 'reporting';
  type: 'doc' | 'spreadsheet' | 'presentation';
  icon: React.ReactNode;
  usageCount: number;
  lastUsed: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Project Requirements v2.1',
    type: 'doc',
    project: 'Platform Migration',
    syncSource: 'google',
    syncStatus: 'synced',
    lastModified: '2 hours ago',
    size: '2.4 MB',
    starred: true,
    sharedWith: 5,
  },
  {
    id: '2',
    name: 'Q4 Budget Analysis',
    type: 'spreadsheet',
    project: 'Digital Transformation',
    syncSource: 'onedrive',
    syncStatus: 'synced',
    lastModified: '1 day ago',
    size: '4.1 MB',
    starred: true,
    sharedWith: 3,
  },
  {
    id: '3',
    name: 'Sprint Planning Deck',
    type: 'presentation',
    project: 'Mobile App Development',
    syncSource: 'google',
    syncStatus: 'syncing',
    lastModified: 'Just now',
    size: '12.8 MB',
    starred: false,
    sharedWith: 8,
  },
  {
    id: '4',
    name: 'Security Audit Report',
    type: 'pdf',
    project: 'Platform Migration',
    syncSource: 'local',
    syncStatus: 'offline',
    lastModified: '3 days ago',
    size: '1.2 MB',
    starred: false,
    sharedWith: 2,
  },
  {
    id: '5',
    name: 'API Documentation',
    type: 'doc',
    project: 'Mobile App Development',
    syncSource: 'google',
    syncStatus: 'synced',
    lastModified: '5 hours ago',
    size: '890 KB',
    starred: false,
    sharedWith: 12,
  },
  {
    id: '6',
    name: 'Design Assets',
    type: 'folder',
    project: 'Digital Transformation',
    syncSource: 'onedrive',
    syncStatus: 'synced',
    lastModified: '1 week ago',
    size: '156 MB',
    starred: true,
    sharedWith: 4,
  },
  {
    id: '7',
    name: 'Meeting Notes - Stakeholders',
    type: 'doc',
    project: 'Platform Migration',
    syncSource: 'google',
    syncStatus: 'error',
    lastModified: '2 days ago',
    size: '340 KB',
    starred: false,
    sharedWith: 6,
  },
];

const mockTemplates: Template[] = [
  {
    id: 't1',
    name: 'Project Kickoff Meeting',
    description: 'Comprehensive agenda and notes template for project kickoff meetings with stakeholders',
    category: 'meeting',
    type: 'doc',
    icon: <Calendar className="w-6 h-6" />,
    usageCount: 24,
    lastUsed: '2 days ago',
  },
  {
    id: 't2',
    name: 'Project Schedule Plan',
    description: 'Gantt chart and milestone tracking template for project timeline management',
    category: 'planning',
    type: 'spreadsheet',
    icon: <FileSpreadsheet className="w-6 h-6" />,
    usageCount: 18,
    lastUsed: '1 week ago',
  },
  {
    id: 't3',
    name: 'Minutes of Meeting (MOM)',
    description: 'Structured template for recording meeting decisions, action items, and attendees',
    category: 'meeting',
    type: 'doc',
    icon: <ClipboardList className="w-6 h-6" />,
    usageCount: 56,
    lastUsed: 'Today',
  },
  {
    id: 't4',
    name: 'Communication Matrix',
    description: 'Stakeholder communication plan with frequency, channels, and responsibilities',
    category: 'communication',
    type: 'spreadsheet',
    icon: <MessageSquare className="w-6 h-6" />,
    usageCount: 12,
    lastUsed: '3 days ago',
  },
  {
    id: 't5',
    name: 'RACI Matrix',
    description: 'Responsibility assignment matrix for clear role definitions across tasks',
    category: 'planning',
    type: 'spreadsheet',
    icon: <Users className="w-6 h-6" />,
    usageCount: 31,
    lastUsed: '5 days ago',
  },
  {
    id: 't6',
    name: 'Status Report',
    description: 'Weekly/monthly project status report with KPIs, risks, and progress updates',
    category: 'reporting',
    type: 'presentation',
    icon: <Presentation className="w-6 h-6" />,
    usageCount: 42,
    lastUsed: 'Yesterday',
  },
  {
    id: 't7',
    name: 'Risk Register',
    description: 'Template for identifying, assessing, and tracking project risks and mitigations',
    category: 'tracking',
    type: 'spreadsheet',
    icon: <CheckSquare className="w-6 h-6" />,
    usageCount: 15,
    lastUsed: '1 week ago',
  },
  {
    id: 't8',
    name: 'Project Charter',
    description: 'Formal document outlining project objectives, scope, stakeholders, and success criteria',
    category: 'planning',
    type: 'doc',
    icon: <FileText className="w-6 h-6" />,
    usageCount: 9,
    lastUsed: '2 weeks ago',
  },
];

const DocumentsView = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [syncingAll, setSyncingAll] = useState(false);
  const { toast } = useToast();

  const projects = [...new Set(documents.map((d) => d.project))];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === 'all' || doc.project === selectedProject;
    return matchesSearch && matchesProject;
  });

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'folder':
        return <FolderOpen className="w-5 h-5 text-warning" />;
      case 'spreadsheet':
        return <FileText className="w-5 h-5 text-success" />;
      case 'presentation':
        return <FileText className="w-5 h-5 text-warning" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-destructive" />;
      default:
        return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  const getSyncIcon = (source: Document['syncSource']) => {
    if (source === 'google') {
      return (
        <div className="w-4 h-4 rounded-full bg-[#4285F4] flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">G</span>
        </div>
      );
    }
    if (source === 'onedrive') {
      return (
        <div className="w-4 h-4 rounded-full bg-[#0078D4] flex items-center justify-center">
          <Cloud className="w-2.5 h-2.5 text-white" />
        </div>
      );
    }
    return <CloudOff className="w-4 h-4 text-muted-foreground" />;
  };

  const getSyncStatus = (status: Document['syncStatus']) => {
    switch (status) {
      case 'synced':
        return <Badge variant="outline" className="text-success border-success/30 bg-success/10">Synced</Badge>;
      case 'syncing':
        return (
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Syncing
          </Badge>
        );
      case 'error':
        return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Sync Error</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Offline</Badge>;
    }
  };

  const handleSyncAll = () => {
    setSyncingAll(true);
    toast({ title: 'Syncing', description: 'Syncing all documents with cloud storage...' });
    setTimeout(() => {
      setSyncingAll(false);
      toast({ title: 'Sync Complete', description: 'All documents are up to date.' });
    }, 2000);
  };

  const toggleStar = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, starred: !doc.starred } : doc))
    );
  };

  const categories = [...new Set(mockTemplates.map((t) => t.category))];

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: Template['category']) => {
    switch (category) {
      case 'planning':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'meeting':
        return 'bg-success/10 text-success border-success/30';
      case 'communication':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'tracking':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'reporting':
        return 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleUseTemplate = (template: Template) => {
    toast({
      title: 'Template Created',
      description: `New document created from "${template.name}" template`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="masira-fade-in">
        <h2 className="text-2xl font-bold text-foreground">Documents</h2>
        <p className="text-muted-foreground">Project files synced with Google Drive & OneDrive</p>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="documents" className="data-[state=active]:bg-background">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-background">
            <LayoutTemplate className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6 mt-6">
          {/* Sync Status Bar */}
          <div className="masira-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4285F4]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#4285F4]">G</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Google Drive</p>
                  <p className="text-xs text-success">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0078D4]/10 flex items-center justify-center">
                  <Cloud className="w-4 h-4 text-[#0078D4]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">OneDrive</p>
                  <p className="text-xs text-success">Connected</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSyncAll} disabled={syncingAll}>
                <RefreshCw className={cn('w-4 h-4 mr-2', syncingAll && 'animate-spin')} />
                {syncingAll ? 'Syncing...' : 'Sync All'}
              </Button>
              <Button size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Documents Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className="masira-card p-4 hover:border-primary/30 transition-all cursor-pointer masira-slide-up group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(doc.type)}
                      {getSyncIcon(doc.syncSource)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleStar(doc.id)} className="text-muted-foreground hover:text-warning">
                        {doc.starred ? (
                          <Star className="w-4 h-4 fill-warning text-warning" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <h4 className="font-medium text-foreground truncate mb-1">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{doc.project}</p>
                  <div className="flex items-center justify-between">
                    {getSyncStatus(doc.syncStatus)}
                    <span className="text-xs text-muted-foreground">{doc.lastModified}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="nexus-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Project</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Source</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Modified</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Size</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-border hover:bg-secondary/30 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleStar(doc.id)} className="text-muted-foreground hover:text-warning">
                            {doc.starred ? (
                              <Star className="w-4 h-4 fill-warning text-warning" />
                            ) : (
                              <StarOff className="w-4 h-4" />
                            )}
                          </button>
                          {getTypeIcon(doc.type)}
                          <span className="font-medium text-foreground">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{doc.project}</td>
                      <td className="p-4">{getSyncIcon(doc.syncSource)}</td>
                      <td className="p-4">{getSyncStatus(doc.syncStatus)}</td>
                      <td className="p-4 text-sm text-muted-foreground">{doc.lastModified}</td>
                      <td className="p-4 text-sm text-muted-foreground">{doc.size}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 mt-6">
          {/* Templates Header */}
          <div className="nexus-card p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Project Templates</h3>
              <p className="text-sm text-muted-foreground">Standardized templates for project documentation</p>
            </div>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Template
            </Button>
          </div>

          {/* Template Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((template, index) => (
              <div
                key={template.id}
                className="nexus-card p-5 hover:border-primary/30 transition-all cursor-pointer nexus-slide-up group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {template.icon}
                  </div>
                  <Badge variant="outline" className={cn('capitalize text-xs', getCategoryColor(template.category))}>
                    {template.category}
                  </Badge>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{template.name}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Used {template.usageCount} times</span>
                  <span>Last: {template.lastUsed}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsView;
