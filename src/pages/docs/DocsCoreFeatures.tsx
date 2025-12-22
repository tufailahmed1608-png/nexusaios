import DocsLayout from '@/components/docs/DocsLayout';
import { Video, FileText, BarChart3, Gavel, TrendingUp, Shield } from 'lucide-react';

const DocsCoreFeatures = () => {
  return (
    <DocsLayout 
      currentPage={2} 
      totalPages={7} 
      title="Core Intelligence Features"
      prevPath="/docs/executive-summary"
      nextPath="/docs/technical-specs"
    >
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">Core Intelligence Features</h2>
        <p className="text-slate-600 mb-6">
          These features define Nexus. Meeting intelligence, executive reporting, decision tracking, and governance enforcement—the primary value proposition for PMO and executives.
        </p>
        
        {/* Meeting Intelligence Hub */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-700">Meeting Intelligence Hub</h3>
          </div>
          <p className="text-slate-600 italic mb-3">Automated MoM Generation & Intelligence Extraction</p>
          <p className="text-slate-700 mb-3">Transform meetings into structured intelligence with automated extraction of actions, decisions, and risks.</p>
          <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
            <li><strong>Auto-Generated Minutes:</strong> AI creates Summaries, Decisions, and Action Items from transcripts</li>
            <li><strong>Decision Extraction:</strong> Automatically identify and log decisions with context</li>
            <li><strong>Risk Identification:</strong> Flag potential risks and blockers from meeting content</li>
            <li><strong>Action Item Tracking:</strong> Extract and assign actionable items to team members</li>
          </ul>
        </div>

        {/* Executive & PMO Reporting */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-700">Executive & PMO Reporting</h3>
          </div>
          <p className="text-slate-600 italic mb-3">Auto-Generated Intelligence Reports</p>
          <p className="text-slate-700 mb-3">Generate weekly, monthly, and executive reports with portfolio summaries—no manual compilation required.</p>
          <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
            <li><strong>Weekly Status Reports:</strong> Automated project status with AI-generated summaries</li>
            <li><strong>Executive Summaries:</strong> High-level portfolio health for leadership review</li>
            <li><strong>Portfolio Analytics:</strong> Cross-project insights and trend analysis</li>
            <li><strong>Approval Workflow:</strong> Draft → Reviewed → Approved lifecycle for all reports</li>
          </ul>
        </div>

        {/* Executive Dashboard */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-700">Executive Dashboard</h3>
          </div>
          <p className="text-slate-600 italic mb-3">Portfolio Health & KPI Visualization</p>
          <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
            <li><strong>Portfolio Health:</strong> Visual representation of project status across the organization</li>
            <li><strong>KPI Heatmaps:</strong> At-a-glance performance indicators for quick assessment</li>
            <li><strong>Risk Concentration:</strong> Identify risk clusters and hotspots across projects</li>
            <li><strong>Trend Analysis:</strong> Track portfolio performance over time</li>
          </ul>
        </div>

        {/* Decision Log */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Gavel className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-700">Decision Log</h3>
          </div>
          <p className="text-slate-600 italic mb-3">Structured Decision Tracking with Audit Trail</p>
          <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
            <li><strong>Capture from Meetings:</strong> Decisions extracted automatically from meeting transcripts</li>
            <li><strong>Approval Workflow:</strong> Route decisions to appropriate stakeholders for approval</li>
            <li><strong>Source Traceability:</strong> Link decisions back to original context and discussions</li>
            <li><strong>Audit Trail:</strong> Complete history of decision changes and approvals</li>
          </ul>
        </div>

        {/* Strategy View */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-700">Strategy View</h3>
          </div>
          <p className="text-slate-600 italic mb-3">Strategic Pillar Alignment & Initiative Tracking</p>
          <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
            <li><strong>Strategic Alignment:</strong> Map projects and initiatives to organizational pillars</li>
            <li><strong>Initiative Contribution:</strong> Track how projects contribute to strategic goals</li>
            <li><strong>ROI Indicators:</strong> High-level return on investment visibility</li>
            <li><strong>Portfolio Balance:</strong> Ensure resource allocation matches strategic priorities</li>
          </ul>
        </div>

        {/* Governance & Accountability */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-700">Governance & Accountability</h3>
          </div>
          <p className="text-slate-600 italic mb-3">Human-in-the-Loop Enforcement</p>
          <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
            <li><strong>AI Output Lifecycle:</strong> Draft → Reviewed → Approved → Published workflow</li>
            <li><strong>Explainability:</strong> Every AI insight shows source, rationale, and confidence</li>
            <li><strong>Approval Requirements:</strong> Critical outputs require human sign-off</li>
            <li><strong>Audit Logging:</strong> Complete trail of all AI-generated content and approvals</li>
          </ul>
        </div>
      </section>
    </DocsLayout>
  );
};

export default DocsCoreFeatures;
