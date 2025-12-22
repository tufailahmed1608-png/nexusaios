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
      
      pdf.setFontSize(18);
      pdf.setTextColor(165, 180, 252);
      pdf.text('Intelligence, Not Execution', pageWidth / 2, 148, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setTextColor(148, 163, 184);
      pdf.text('PMO Intelligence Layer for Executives & Decision Makers', pageWidth / 2, 165, { align: 'center' });
      
      pdf.setFontSize(11);
      pdf.text('Product Documentation & Technical Specifications', pageWidth / 2, 185, { align: 'center' });
      
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
        { title: 'Executive Summary', page: 3, desc: 'Intelligence layer overview and core philosophy' },
        { title: 'Core Intelligence Features', page: 4, desc: 'Meeting Hub, Executive Reporting, Decision Log & more' },
        { title: 'Technical Specifications', page: 5, desc: 'Technology stack, security, and integrations' },
        { title: 'AI & Governance', page: 6, desc: 'Human-in-the-loop AI with full explainability' },
        { title: 'Positioning', page: 7, desc: 'Nexus vs traditional PM tools comparison' },
        { title: 'Roles & User Journeys', page: 8, desc: 'PMO, Executive, and PM workflows' },
        { title: 'Market Position', page: 9, desc: 'Target market and go-to-market strategy' },
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
      addTitle('Intelligence, Not Execution');
      
      addParagraph('Nexus Project OS is a PMO Intelligence Layer designed for executives and decision makers. Unlike traditional PM tools that focus on task execution, Nexus observes your existing delivery systems and converts meetings and delivery signals into structured intelligence—supporting decision-making, not replacing your tools.');
      
      yPos += 4;
      addSubtitle('How Nexus Works');
      addBullet('Observe: Connect to existing systems (Jira, M365, email, meetings) without replacing them');
      addBullet('Analyze: AI converts meetings and delivery signals into structured intelligence with full explainability');
      addBullet('Decide: Executives and PMO receive approved, auditable intelligence. Humans remain accountable');
      
      yPos += 4;
      addSubtitle('Target Users');
      addParagraph('PMO teams, Executives, and Program Managers who need intelligence for decision support—not another task tracker.');
      
      addSubtitle('Core Philosophy');
      addParagraph('Nexus complements Jira, M365, Asana, Monday.com—it does not replace them. AI assists preparation and analysis; humans approve, decide, and remain accountable. No autonomous decision-making.');
      
      yPos += 4;
      addSubtitle('Key Differentiators');
      addBullet('Intelligence layer for decision support, not task execution tracking');
      addBullet('Works alongside existing tools, zero tool replacement required');
      addBullet('Human-in-the-loop governance with full AI output lifecycle');

      // Page 2: Core Intelligence Features
      pdf.addPage();
      addHeader('Core Intelligence Features', 3);
      addTitle('Primary Value Proposition');
      
      addParagraph('These features define Nexus. Meeting intelligence, executive reporting, decision tracking, and governance enforcement.');

      const features = [
        { name: 'Meeting Intelligence Hub', desc: 'Automated MoM generation, extraction of actions, decisions, and risks from meetings.' },
        { name: 'Executive & PMO Reporting', desc: 'Auto-generated weekly, monthly, and executive reports with portfolio summaries.' },
        { name: 'Executive Dashboard', desc: 'Portfolio health, KPI heatmaps, and risk concentration views for leadership.' },
        { name: 'Decision Log', desc: 'Capture decisions from meetings with approval workflow and source traceability.' },
        { name: 'Strategy View', desc: 'Strategic pillar alignment, initiative contribution, and high-level ROI indicators.' },
        { name: 'Governance & Accountability', desc: 'Human-in-the-loop enforcement with AI output lifecycle and explainability.' },
      ];

      features.forEach((feature, idx) => {
        if (checkPageBreak(20)) addHeader('Core Intelligence Features', 3);
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

      // Page 4: AI & Governance
      pdf.addPage();
      addHeader('AI & Governance', 5);
      addTitle('Human Accountability, AI-Powered Intelligence');

      addSubtitle('Trustworthy AI Principles');
      addBullet('AI assists preparation and analysis');
      addBullet('Humans approve, decide, and remain accountable');
      addBullet('No autonomous decision-making');
      addBullet('Every AI output has Draft → Reviewed → Approved → Published lifecycle');

      yPos += 4;
      addSubtitle('AI Output Lifecycle');
      addParagraph('All AI-generated content follows a controlled workflow: Draft (AI generates) → Reviewed (human reviews) → Approved (authorized sign-off) → Published (ready for use). Full audit trail included.');

      yPos += 4;
      addSubtitle('Full Explainability');
      addParagraph('Every AI insight shows source, rationale, confidence score, and approval status. No black-box decisions.');

      yPos += 4;
      addSubtitle('AI Capabilities');
      addBullet('Meeting Intelligence: Transcript analysis, MoM generation, action extraction');
      addBullet('Executive Reporting: Auto-generated summaries from delivery signals');
      addBullet('Decision Support: Structured decision capture with source traceability');
      addBullet('Risk Detection: Pattern recognition across portfolio for early warnings');

      // Page 5: Positioning
      pdf.addPage();
      addHeader('Positioning', 6);
      addTitle('Nexus vs Traditional PM Tools');

      addSubtitle('Key Positioning');
      addParagraph('Nexus is not another PM tool. It is an intelligence layer that works WITH your existing tools.');

      yPos += 4;
      addSubtitle('Comparison');
      addBullet('Primary Purpose: Intelligence layer for decision support vs. task execution tracking');
      addBullet('Relationship to Tools: Observes existing systems (Jira, M365) vs. replaces them');
      addBullet('AI Role: Assists analysis, humans decide vs. automation focus');
      addBullet('Target Users: PMO, Executives, Program Managers vs. Project teams');
      addBullet('Meeting Intelligence: Auto MoM, action extraction, decisions vs. manual notes');
      addBullet('Reporting: AI-generated executive summaries vs. manual report creation');
      addBullet('Decision Tracking: Structured log with audit trail vs. scattered in emails');
      addBullet('Governance: Human-in-the-loop enforcement vs. process-dependent');

      yPos += 6;
      addSubtitle('What Nexus Does NOT Do');
      addBullet('Replace task or email systems');
      addBullet('Score or rank individuals');
      addBullet('Perform autonomous task assignment');
      addBullet('Make decisions without humans');
      addBullet('Act as a system of record');

      // Page 6: Roles & User Journeys
      pdf.addPage();
      addHeader('Roles & User Journeys', 7);
      addTitle('Roles & User Journeys');

      addSubtitle('Target User Roles');
      addBullet('Executive: Portfolio overview, strategic dashboards, AI summaries');
      addBullet('PMO: Cross-project reporting, governance, resource management');
      addBullet('Program Manager: Program health, dependencies, milestone tracking');
      addBullet('Project Manager: Project delivery, team coordination, risk tracking');

      yPos += 4;
      addSubtitle('User Journey: Executive');
      addParagraph('Login → Executive Dashboard → Review portfolio KPIs → Check Decision Log → Approve AI outputs → View Strategy → Receive weekly digest');
      addParagraph('Value: Structured intelligence for faster, better-informed decisions');

      yPos += 4;
      addSubtitle('User Journey: PMO');
      addParagraph('Login → Portfolio Dashboard → Review cross-project reports → Audit AI outputs → Configure governance rules → Generate executive summaries');
      addParagraph('Value: Single source of truth with full explainability');

      yPos += 4;
      addSubtitle('Pilot Program');
      addBullet('6-8 week time-boxed access with limited scope');
      addBullet('Full audit trail and governance included');
      addBullet('Role-based demo to see exactly what you will use');
      addBullet('Clean exit guaranteed');

      // Page 7: Market Position
      pdf.addPage();
      addHeader('Market Position', 8);
      addTitle('Market Position & Strategy');

      addSubtitle('Market Opportunity');
      addBullet('$8.2B: Project Management Software Market (2024)');
      addBullet('15.7%: CAGR Growth Rate (2024-2030)');
      addBullet('Gap: No incumbent focuses on PMO intelligence layer');

      yPos += 4;
      addSubtitle('Target Customers');
      addParagraph('Primary: Enterprise PMO & Executives in Fortune 500 companies needing decision intelligence, not more task tracking.');
      addParagraph('Secondary: Mid-market organizations scaling governance and reporting.');

      yPos += 4;
      addSubtitle('Go-To-Market Strategy');
      addBullet('Phase 1 (Current): Controlled pilot with select enterprise customers');
      addBullet('Phase 2: Partner with delivery tool vendors (Jira, M365 integrations)');
      addBullet('Phase 3: Self-service mid-market tier and API platform');

      yPos += 4;
      addSubtitle('Why Now');
      addParagraph('AI maturity enables reliable meeting transcription and summarization. Remote work increased meeting volume. Executives demand structured intelligence, not more tools.');

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
          Intelligence, Not Execution
        </p>
        
        <p className="text-lg text-slate-400 mb-4">
          PMO Intelligence Layer for Executives & Decision Makers
        </p>
        
        <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto my-8 rounded-full" />
        
        <p className="text-base text-slate-500 mb-12 max-w-xl mx-auto">
          Observes your existing delivery systems and converts meetings and delivery signals into structured intelligence—supporting decision-making, not replacing your tools.
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
          <span>Complete 7-page documentation bundle with clickable Table of Contents</span>
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
            4. AI & Governance
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <button 
            onClick={() => navigate('/docs/competitive-analysis')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            5. Positioning
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
