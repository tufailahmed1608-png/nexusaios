import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Loader2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

const DocsCover = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const generateFullPDF = async () => {
    setIsExporting(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = margin;

      const addHeader = (title: string, pageNum: number, totalPages: number = 8) => {
        pdf.setFillColor(79, 70, 229);
        pdf.rect(0, 0, pageWidth, 25, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Nexus Project OS', margin, 16);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 20, 16);
        pdf.setTextColor(0, 0, 0);
        yPos = 35;
      };

      const addTitle = (text: string) => {
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 41, 59);
        pdf.text(text, margin, yPos);
        yPos += 12;
      };

      const addSubtitle = (text: string) => {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(79, 70, 229);
        pdf.text(text, margin, yPos);
        yPos += 8;
      };

      const addParagraph = (text: string) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 65, 85);
        const lines = pdf.splitTextToSize(text, contentWidth);
        pdf.text(lines, margin, yPos);
        yPos += lines.length * 5 + 4;
      };

      const addBullet = (text: string) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 65, 85);
        const lines = pdf.splitTextToSize(text, contentWidth - 8);
        pdf.text('•', margin, yPos);
        pdf.text(lines, margin + 6, yPos);
        yPos += lines.length * 5 + 2;
      };

      const checkPageBreak = (needed: number) => {
        if (yPos + needed > pageHeight - margin) {
          pdf.addPage();
          return true;
        }
        return false;
      };

      // Cover Page
      pdf.setFillColor(30, 27, 75);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setFillColor(79, 70, 229);
      pdf.roundedRect(pageWidth / 2 - 20, 60, 40, 40, 8, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('N', pageWidth / 2 - 7, 88);
      
      pdf.setFontSize(36);
      pdf.text('Nexus Project OS', pageWidth / 2, 130, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(165, 180, 252);
      pdf.text('AI-First Project Management Operating System', pageWidth / 2, 145, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(148, 163, 184);
      pdf.text('Product Documentation & Technical Specifications', pageWidth / 2, 165, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text('Document Version: 1.0 | December 2025', pageWidth / 2, pageHeight - 30, { align: 'center' });

      // Table of Contents Page
      pdf.addPage();
      pdf.setFillColor(79, 70, 229);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Nexus Project OS', margin, 16);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Table of Contents', pageWidth - margin - 30, 16);
      
      yPos = 45;
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Table of Contents', margin, yPos);
      
      yPos += 20;
      
      // TOC entries with clickable links
      const tocEntries = [
        { title: 'Executive Summary', page: 3, desc: 'Overview of Nexus Project OS and key value propositions' },
        { title: 'Core Features', page: 4, desc: 'Smart Inbox, Meeting Hub, Dashboard, Task Board & more' },
        { title: 'Technical Specifications', page: 5, desc: 'Technology stack, security, and integrations' },
        { title: 'AI Integration', page: 6, desc: 'Google Gemini capabilities and intelligent automation' },
        { title: 'Competitive Analysis', page: 7, desc: 'Market comparison and key differentiators' },
        { title: 'Roles & User Journeys', page: 8, desc: 'Role hierarchy, permissions, and user workflows' },
        { title: 'Market Position', page: 9, desc: 'Market overview, target segments, and go-to-market strategy' },
      ];

      tocEntries.forEach((entry, idx) => {
        const entryY = yPos;
        
        // Chapter number circle
        pdf.setFillColor(79, 70, 229);
        pdf.circle(margin + 5, entryY - 2, 5, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${idx + 1}`, margin + 3, entryY);
        
        // Title (clickable)
        pdf.setTextColor(79, 70, 229);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const titleX = margin + 15;
        pdf.textWithLink(entry.title, titleX, entryY, { pageNumber: entry.page });
        
        // Page number
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        const pageText = `Page ${entry.page - 1}`;
        const pageTextWidth = pdf.getTextWidth(pageText);
        pdf.textWithLink(pageText, pageWidth - margin - pageTextWidth, entryY, { pageNumber: entry.page });
        
        // Dotted line
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineDashPattern([1, 2], 0);
        const titleWidth = pdf.getTextWidth(entry.title);
        pdf.line(titleX + titleWidth + 5, entryY - 1, pageWidth - margin - pageTextWidth - 5, entryY - 1);
        pdf.setLineDashPattern([], 0);
        
        // Description
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(entry.desc, titleX, entryY + 6);
        
        yPos += 22;
      });

      // Add click instruction
      yPos += 15;
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(margin, yPos - 5, contentWidth, 20, 3, 3, 'F');
      pdf.setTextColor(71, 85, 105);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Click on any chapter title or page number to navigate directly to that section.', margin + 10, yPos + 5);

      // Page 1: Executive Summary
      pdf.addPage();
      addHeader('Executive Summary', 2);
      addTitle('Executive Summary');
      
      addParagraph('Nexus Project OS is an AI-first Project Management Operating System designed to consolidate communication, strategy, and execution into a single interface. Unlike traditional tools (Jira, Asana, Monday.com), Nexus uses AI to actively analyze incoming data—emails, meeting transcripts, and documents—to automatically generate tasks, assess sentiment, and predict risks.');
      
      yPos += 4;
      addSubtitle('Target Users');
      addParagraph('Enterprise project managers, PMO teams, and executives who need unified visibility across communication and project execution.');
      
      addSubtitle('Core Philosophy');
      addParagraph('Nexus is designed to be the single point of work for project managers, eliminating context switching between emails, spreadsheets, PowerPoint presentations, and multiple PMO tools.');
      
      yPos += 4;
      addSubtitle('Key Value Propositions');
      addBullet('Unified Workspace: Single platform for emails, meetings, tasks, and reports');
      addBullet('AI-Powered Insights: Automatic sentiment analysis, task extraction, and risk prediction');
      addBullet('Real-Time Intelligence: Live dashboards with KPIs and portfolio health');
      addBullet('Automated Reporting: Generate comprehensive status reports with a single click');

      // Page 2: Core Features
      pdf.addPage();
      addHeader('Core Features', 3);
      addTitle('Core Features');

      const features = [
        { name: 'Smart Inbox', desc: 'AI-powered email intelligence with sentiment analysis, escalation matrix, and task extraction' },
        { name: 'Meeting Hub', desc: 'Intelligent meeting management with transcript analysis and auto-generated minutes' },
        { name: 'Executive Dashboard', desc: 'Real-time portfolio intelligence with KPIs, budget tracking, and velocity charts' },
        { name: 'Task Board', desc: 'AI-enhanced Kanban task management with auto-generated tasks' },
        { name: 'Strategy View', desc: 'Strategic alignment dashboards with ROI tracking and portfolio analytics' },
        { name: 'Stakeholder Management', desc: 'Comprehensive stakeholder tracking with communication planning' },
        { name: 'Auto-Generated Reports', desc: 'AI-powered status reporting with one-click generation' },
        { name: 'Documents & Templates', desc: 'Centralized document management with cloud sync' },
        { name: 'Smart Notifications', desc: 'AI-prioritized alerts for critical project events' },
      ];

      features.forEach((feature, idx) => {
        if (checkPageBreak(20)) addHeader('Core Features', 3);
        addSubtitle(`${idx + 1}. ${feature.name}`);
        addParagraph(feature.desc);
        yPos += 2;
      });

      // Page 3: Technical Specifications
      pdf.addPage();
      addHeader('Technical Specifications', 4);
      addTitle('Technical Specifications');

      addSubtitle('Technology Stack');
      addBullet('Frontend: React with TypeScript');
      addBullet('Styling: Tailwind CSS');
      addBullet('Backend: Supabase (PostgreSQL, Edge Functions)');
      addBullet('AI: Google Gemini integration');

      yPos += 4;
      addSubtitle('Multi-Language Support');
      addBullet('English (LTR): Full interface support');
      addBullet('Arabic (RTL): Complete RTL layout with Cairo font');
      addBullet('Dynamic Switching: Runtime language toggle');

      yPos += 4;
      addSubtitle('Security Features');
      addBullet('Row Level Security (RLS) on all data tables');
      addBullet('JWT Authentication with session management');
      addBullet('End-to-end encryption for data transmission');
      addBullet('Role-based access control');

      yPos += 4;
      addSubtitle('Integrations');
      addBullet('Cloud Storage: Google Drive, OneDrive');
      addBullet('Project Tools: Jira, Slack widgets');
      addBullet('Email: Gmail, Outlook (planned)');

      // Page 4: AI Integration
      pdf.addPage();
      addHeader('AI Integration', 5);
      addTitle('AI Integration');

      addSubtitle('Powered by Google Gemini');
      addParagraph('Nexus leverages advanced AI capabilities integrated throughout the platform for intelligent automation and insights.');

      yPos += 4;
      addSubtitle('AI Capabilities');
      addBullet('Smart Inbox: Sentiment analysis, escalation determination, task extraction');
      addBullet('Meeting Hub: Transcript analysis, summary generation, action item extraction');
      addBullet('Reports: Auto-generation from project data');
      addBullet('Smart Reply: Context-aware email response generation');
      addBullet('Risk Prediction: AI-powered risk assessment and mitigation suggestions');
      addBullet('Task Suggestions: Intelligent recommendations based on context');

      yPos += 4;
      addSubtitle('Natural Language Processing');
      addBullet('Sentiment detection with confidence scores');
      addBullet('Entity extraction from communications');
      addBullet('Context-aware response generation');

      yPos += 4;
      addSubtitle('Predictive Analytics');
      addBullet('Risk assessment and prediction');
      addBullet('Project health forecasting');
      addBullet('Resource optimization suggestions');

      // Page 5: Competitive Analysis
      pdf.addPage();
      addHeader('Competitive Analysis', 6);
      addTitle('Competitive Analysis');

      addSubtitle('Key Differentiators');
      addBullet('AI-First Architecture: Built from ground up with AI at its core');
      addBullet('Unified Communication Hub: Email, meetings, and tasks in one place');
      addBullet('Automated Intelligence: Tasks and insights generated automatically');
      addBullet('Enterprise-Ready: Built for PMO teams with executive dashboards');

      yPos += 4;
      addSubtitle('Feature Comparison');
      addParagraph('Nexus offers unique capabilities not found in competitors like Jira, Asana, or Monday.com:');
      addBullet('AI Sentiment Analysis: ✓ Nexus only');
      addBullet('Auto Task Extraction: ✓ Nexus only');
      addBullet('Meeting Transcript Analysis: ✓ Nexus only');
      addBullet('AI Report Generation: ✓ Nexus only');
      addBullet('Escalation Matrix: ✓ Nexus only');

      // Page 6: Roles & User Journeys
      pdf.addPage();
      addHeader('Roles & User Journeys', 7);
      addTitle('Roles & User Journeys');

      addSubtitle('Role Hierarchy');
      addBullet('Executive: Strategic oversight, governance, decision approval');
      addBullet('PMO: Portfolio governance, reporting, AI controls');
      addBullet('Program Manager: Cross-project oversight, risk prediction, stakeholders');
      addBullet('Project Manager: Task execution, inbox management, meetings');
      addBullet('User (Pilot): Meeting Hub access, scoped dashboard, feedback');

      yPos += 4;
      addSubtitle('User Journey: Executive');
      addParagraph('Login → Executive Dashboard → Review KPIs → Check Decision Log → Approve Decisions → View Strategy → Generate Report');
      addParagraph('Time saved: 2+ hours/week on status meetings and report review');

      yPos += 4;
      addSubtitle('User Journey: Project Manager');
      addParagraph('Login → Smart Inbox → Process Emails → Extract Tasks → Update Task Board → Meeting Hub → Generate Minutes');
      addParagraph('Time saved: 8+ hours/week on email processing and documentation');

      // Page 7: Market Position
      pdf.addPage();
      addHeader('Market Position', 8);
      addTitle('Market Position & Strategy');

      addSubtitle('Market Overview');
      addBullet('$8.2B: Project Management Software Market (2024)');
      addBullet('15.7%: CAGR Growth Rate (2024-2030)');
      addBullet('$20.6B: Projected Market Size (2030)');

      yPos += 4;
      addSubtitle('Target Market');
      addParagraph('Primary: Enterprise PMO & Executives - Fortune 500 companies with complex portfolios');
      addParagraph('Secondary: Mid-Market Project Teams - Growing companies with 100-1000 employees');

      yPos += 4;
      addSubtitle('Go-To-Market Strategy');
      addBullet('Phase 1 (Current): Limited pilot with select enterprise customers');
      addBullet('Phase 2 (Q2 2025): Expand to 50+ customers, launch partner program');
      addBullet('Phase 3 (Q4 2025): General availability, API platform, global expansion');

      yPos += 4;
      addSubtitle('Key Success Metrics');
      addBullet('60% reduction in email processing time');
      addBullet('8+ hours saved per PM per week');
      addBullet('90% accuracy in task extraction');
      addBullet('40% faster status reporting');

      // Save the PDF
      pdf.save('Nexus-Project-OS-Complete-Documentation.pdf');
      
      toast({
        title: 'PDF Downloaded',
        description: 'Complete 9-page documentation with Table of Contents has been exported.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-white">N</span>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
          Nexus Project OS
        </h1>
        
        <p className="text-2xl text-indigo-300 font-medium mb-2">
          AI-First Project Management Operating System
        </p>
        
        <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto my-8 rounded-full" />
        
        <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto">
          Product Documentation & Technical Specifications
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            size="lg" 
            onClick={() => navigate('/docs/executive-summary')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            Start Reading
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={generateFullPDF}
            disabled={isExporting}
            className="border-indigo-400 text-indigo-300 hover:bg-indigo-900/50 px-8"
          >
            {isExporting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            {isExporting ? 'Generating...' : 'Download Full PDF'}
          </Button>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 mb-8 inline-flex items-center gap-3 text-sm text-slate-400">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span>Complete 7-page documentation bundle with cover page</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <button 
            onClick={() => navigate('/docs/executive-summary')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            1. Executive Summary
          </button>
          <button 
            onClick={() => navigate('/docs/core-features')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            2. Core Features
          </button>
          <button 
            onClick={() => navigate('/docs/technical-specs')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            3. Technical Specs
          </button>
          <button 
            onClick={() => navigate('/docs/ai-integration')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            4. AI Integration
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <button 
            onClick={() => navigate('/docs/competitive-analysis')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            5. Competitive Analysis
          </button>
          <button 
            onClick={() => navigate('/docs/roles-user-journeys')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            6. Roles & User Journeys
          </button>
          <button 
            onClick={() => navigate('/docs/market-position')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            7. Market Position
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-700 text-slate-500 text-sm">
          <p>Document Version: 1.0 | December 2025</p>
          <p className="mt-1">© 2025 Nexus Project OS - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default DocsCover;
