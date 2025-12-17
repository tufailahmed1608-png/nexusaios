import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

const ProductDocumentation = () => {
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('document-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      pdf.save('Nexus-Project-OS-Product-Details.pdf');
      toast({
        title: 'PDF Exported',
        description: 'Product document has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">Product Documentation</h1>
            </div>
          </div>
          <Button onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export PDF
          </Button>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div
          id="document-content"
          className="bg-white text-slate-900 p-12 rounded-lg shadow-lg prose prose-slate max-w-none"
        >
          {/* Title */}
          <div className="text-center mb-12 pb-8 border-b-2 border-indigo-500">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Nexus Project OS</h1>
            <p className="text-xl text-indigo-600 font-medium">AI-First Project Management Operating System</p>
          </div>

          {/* Executive Summary */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Executive Summary</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Nexus Project OS is an AI-first Project Management Operating System designed to consolidate communication, 
              strategy, and execution into a single interface. Unlike traditional tools (Jira, Asana, Monday.com), 
              Nexus uses AI to actively analyze incoming data—emails, meeting transcripts, and documents—to automatically 
              generate tasks, assess sentiment, and predict risks.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <p className="text-slate-700"><strong>Target Users:</strong> Enterprise project managers, PMO teams, and executives who need unified visibility across communication and project execution.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700"><strong>Core Philosophy:</strong> Nexus is designed to be the single point of work for project managers, eliminating context switching between emails, spreadsheets, PowerPoint presentations, and multiple PMO tools.</p>
            </div>
          </section>

          {/* Core Features */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">Core Features</h2>
            
            {/* Smart Inbox */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">1. Smart Inbox</h3>
              <p className="text-slate-600 italic mb-3">AI-Powered Email Intelligence</p>
              <p className="text-slate-700 mb-3">The Smart Inbox is a master view combining email reading with AI analytics, unifying communication analysis in a single interface.</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li><strong>Sentiment Analysis:</strong> Real-time visualization of email emotion with confidence scores</li>
                <li><strong>Escalation Matrix:</strong> AI determines email priority from L1 (Operational) to L4 (Executive)</li>
                <li><strong>Task Extraction:</strong> One-click conversion of email content to Kanban tasks</li>
                <li><strong>AI Smart Reply:</strong> Generate contextually appropriate email responses using AI</li>
              </ul>
            </div>

            {/* Meeting Hub */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">2. Meeting Hub</h3>
              <p className="text-slate-600 italic mb-3">Intelligent Meeting Management</p>
              <p className="text-slate-700 mb-3">Meeting Hub enables users to process transcripts and generate structured meeting documentation on the fly.</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li><strong>Transcript Analyzer:</strong> Converts raw meeting text into structured outputs</li>
                <li><strong>Auto-Generated Minutes:</strong> AI creates Summaries, Decisions, and Action Items</li>
                <li><strong>Task Extraction:</strong> Automatically identify and extract actionable items</li>
              </ul>
            </div>

            {/* Executive Dashboard */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">3. Executive Dashboard</h3>
              <p className="text-slate-600 italic mb-3">Real-Time Portfolio Intelligence</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li><strong>KPI Cards:</strong> Real-time metrics display with trend indicators</li>
                <li><strong>Portfolio Health Charts:</strong> Visual representation of project status</li>
                <li><strong>Budget vs. Actuals:</strong> Financial tracking and variance analysis</li>
                <li><strong>Velocity Tracking:</strong> Team performance and delivery metrics</li>
              </ul>
            </div>

            {/* Task Board */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">4. Task Board</h3>
              <p className="text-slate-600 italic mb-3">AI-Enhanced Task Management</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li><strong>Kanban View:</strong> Visual task organization by status</li>
                <li><strong>Auto-Generated Tasks:</strong> Tasks created from emails and meeting transcripts</li>
                <li><strong>Priority Management:</strong> Critical, High, Medium, Low priority levels</li>
              </ul>
            </div>

            {/* Strategy View */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">5. Strategy View</h3>
              <p className="text-slate-600 italic mb-3">Strategic Alignment & ROI Tracking</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li><strong>ROI Tracking:</strong> Return on investment analysis by project/initiative</li>
                <li><strong>Budget vs. Actuals:</strong> Detailed financial comparison views</li>
                <li><strong>Strategic Pillar Alignment:</strong> Map projects to organizational objectives</li>
              </ul>
            </div>

            {/* Stakeholder Management */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">6. Stakeholder Management</h3>
              <p className="text-slate-600 italic mb-3">Intelligent Stakeholder Engagement</p>
              <table className="w-full text-sm border-collapse mb-4">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-2 text-left">Category</th>
                    <th className="border border-slate-300 p-2 text-left">Influence</th>
                    <th className="border border-slate-300 p-2 text-left">Interest</th>
                    <th className="border border-slate-300 p-2 text-left">Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-300 p-2">Key Players</td><td className="border border-slate-300 p-2">High</td><td className="border border-slate-300 p-2">High</td><td className="border border-slate-300 p-2">Engage closely</td></tr>
                  <tr><td className="border border-slate-300 p-2">Keep Satisfied</td><td className="border border-slate-300 p-2">High</td><td className="border border-slate-300 p-2">Low</td><td className="border border-slate-300 p-2">Keep informed of major decisions</td></tr>
                  <tr><td className="border border-slate-300 p-2">Keep Informed</td><td className="border border-slate-300 p-2">Low</td><td className="border border-slate-300 p-2">High</td><td className="border border-slate-300 p-2">Regular updates</td></tr>
                  <tr><td className="border border-slate-300 p-2">Monitor</td><td className="border border-slate-300 p-2">Low</td><td className="border border-slate-300 p-2">Low</td><td className="border border-slate-300 p-2">Minimal effort</td></tr>
                </tbody>
              </table>
            </div>

            {/* Auto-Generated Reports */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">7. Auto-Generated Reports</h3>
              <p className="text-slate-600 italic mb-3">AI-Powered Status Reporting</p>
              <p className="text-slate-700 mb-2">Report Types:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li>Weekly Status Report</li>
                <li>Monthly Summary</li>
                <li>Stakeholder Update</li>
                <li>Risk Assessment</li>
                <li>Team Performance</li>
              </ul>
            </div>

            {/* Documents & Templates */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">8. Documents & Templates</h3>
              <p className="text-slate-600 italic mb-3">Centralized Document Management</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li>Cloud Sync with Google Drive and OneDrive</li>
                <li>Pre-built templates: Project Kickoff, MOM, RACI Matrix, Risk Register, Project Charter</li>
                <li>Searchable template library with category filtering</li>
              </ul>
            </div>

            {/* Smart Notifications */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">9. Smart Notifications</h3>
              <p className="text-slate-600 italic mb-3">AI-Prioritized Alerts</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li>Deadline alerts, risk notifications, project updates</li>
                <li>Priority levels: Critical, High, Medium, Low</li>
                <li>Unread count badges and notification history</li>
              </ul>
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Technical Specifications</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Multi-Language Support</h4>
                <ul className="text-slate-700 text-sm space-y-1">
                  <li>• English (LTR) - Full support</li>
                  <li>• Arabic (RTL) - Complete RTL layout</li>
                  <li>• Runtime language toggle</li>
                  <li>• Persistent preferences</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Theme Support</h4>
                <ul className="text-slate-700 text-sm space-y-1">
                  <li>• Light Mode (default)</li>
                  <li>• Dark Mode</li>
                  <li>• Instant theme switching</li>
                  <li>• Consistent design across themes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* AI Integration */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">AI Integration</h2>
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <p className="text-slate-700"><strong>Powered by Google Gemini</strong></p>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left">Feature</th>
                  <th className="border border-slate-300 p-2 text-left">AI Function</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-slate-300 p-2">Smart Inbox</td><td className="border border-slate-300 p-2">Sentiment analysis, escalation determination, task extraction</td></tr>
                <tr><td className="border border-slate-300 p-2">Meeting Hub</td><td className="border border-slate-300 p-2">Transcript analysis, summary generation, action item extraction</td></tr>
                <tr><td className="border border-slate-300 p-2">Reports</td><td className="border border-slate-300 p-2">Auto-generation from project data</td></tr>
                <tr><td className="border border-slate-300 p-2">Smart Reply</td><td className="border border-slate-300 p-2">Context-aware email response generation</td></tr>
              </tbody>
            </table>
          </section>

          {/* Competitive Advantages */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Competitive Advantages</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="border border-slate-300 p-2 text-left">Feature</th>
                  <th className="border border-slate-300 p-2 text-center">Nexus</th>
                  <th className="border border-slate-300 p-2 text-center">Jira</th>
                  <th className="border border-slate-300 p-2 text-center">Asana</th>
                  <th className="border border-slate-300 p-2 text-center">Monday</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-slate-300 p-2">AI Sentiment Analysis</td><td className="border border-slate-300 p-2 text-center text-green-600">✓</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td></tr>
                <tr><td className="border border-slate-300 p-2">Auto Task Extraction</td><td className="border border-slate-300 p-2 text-center text-green-600">✓</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td></tr>
                <tr><td className="border border-slate-300 p-2">Email Integration</td><td className="border border-slate-300 p-2 text-center text-green-600">✓</td><td className="border border-slate-300 p-2 text-center text-amber-500">Limited</td><td className="border border-slate-300 p-2 text-center text-amber-500">Limited</td><td className="border border-slate-300 p-2 text-center text-amber-500">Limited</td></tr>
                <tr><td className="border border-slate-300 p-2">Meeting Transcript Analysis</td><td className="border border-slate-300 p-2 text-center text-green-600">✓</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td></tr>
                <tr><td className="border border-slate-300 p-2">Escalation Matrix</td><td className="border border-slate-300 p-2 text-center text-green-600">✓</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td></tr>
                <tr><td className="border border-slate-300 p-2">AI Report Generation</td><td className="border border-slate-300 p-2 text-center text-green-600">✓</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td><td className="border border-slate-300 p-2 text-center text-red-500">✗</td></tr>
              </tbody>
            </table>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm">
            <p>Document Version: 1.0 | Last Updated: December 2024</p>
            <p className="mt-1">© Nexus Project OS - All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDocumentation;
