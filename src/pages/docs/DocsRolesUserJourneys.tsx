import DocsLayout from '@/components/docs/DocsLayout';
import { Users, UserCheck, ArrowRight, Shield, Briefcase, Crown, Settings2 } from 'lucide-react';

const DocsRolesUserJourneys = () => {
  return (
    <DocsLayout
      title="Roles & User Journeys"
      currentPage={6}
      totalPages={7}
      prevPath="/docs/competitive-analysis"
      nextPath="/docs/market-position"
    >
      {/* Section Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Target User Roles</h2>
        </div>
        <p className="text-slate-600">
          Nexus is designed for PMO, executives, and program managers who need unified visibility 
          across portfolios without replacing their existing delivery tools.
        </p>
      </div>

      {/* Role Hierarchy Visual */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-8 rounded-xl mb-10">
        <h3 className="text-lg font-semibold text-slate-900 mb-6 text-center">Organizational Role Hierarchy</h3>
        <div className="flex flex-col items-center gap-4">
          {/* Executive Level */}
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 border-2 border-amber-400 px-6 py-3 rounded-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-800">Executive</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
          
          {/* PMO Level */}
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 border-2 border-purple-400 px-6 py-3 rounded-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">PMO</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
          
          {/* Program Manager Level */}
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 border-2 border-blue-400 px-6 py-3 rounded-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Program Manager</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
          
          {/* Project Manager Level */}
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 border-2 border-emerald-400 px-6 py-3 rounded-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">Project Manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Role Definitions */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Role-Specific Value</h3>
        
        <div className="space-y-6">
          {/* Executive */}
          <div className="border-l-4 border-amber-500 bg-amber-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-amber-600" />
              <h4 className="text-lg font-bold text-amber-800">Executive</h4>
            </div>
            <p className="text-amber-900 mb-4">
              Strategic oversight, governance decisions, portfolio health visibility.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-amber-800 mb-2">Primary Access</h5>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Executive Dashboard with KPIs</li>
                  <li>• Decision Log & Approvals</li>
                  <li>• Strategy View</li>
                  <li>• Approved Reports</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-amber-800 mb-2">Key Benefit</h5>
                <p className="text-sm text-amber-700">
                  Portfolio overview, strategic dashboards, AI summaries—without manual report compilation.
                </p>
              </div>
            </div>
          </div>

          {/* PMO */}
          <div className="border-l-4 border-purple-500 bg-purple-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <Settings2 className="w-6 h-6 text-purple-600" />
              <h4 className="text-lg font-bold text-purple-800">PMO (Project Management Office)</h4>
            </div>
            <p className="text-purple-900 mb-4">
              Cross-project reporting, governance, resource management.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-purple-800 mb-2">Primary Access</h5>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Executive Dashboard</li>
                  <li>• All Reports & Audit Trails</li>
                  <li>• Strategy & Stakeholder Views</li>
                  <li>• AI Controls & Explainability</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-purple-800 mb-2">Key Benefit</h5>
                <p className="text-sm text-purple-700">
                  Portfolio truth, leadership confidence, standards enforcement across all projects.
                </p>
              </div>
            </div>
          </div>

          {/* Program Manager */}
          <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-bold text-blue-800">Program Manager</h4>
            </div>
            <p className="text-blue-900 mb-4">
              Program health, dependencies, milestone tracking.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-800 mb-2">Primary Access</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Executive Dashboard</li>
                  <li>• Risk Prediction</li>
                  <li>• Stakeholder Management</li>
                  <li>• Cross-Project Reports</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-800 mb-2">Key Benefit</h5>
                <p className="text-sm text-blue-700">
                  Cross-project visibility, risk mitigation, stakeholder alignment across programs.
                </p>
              </div>
            </div>
          </div>

          {/* Project Manager */}
          <div className="border-l-4 border-emerald-500 bg-emerald-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <UserCheck className="w-6 h-6 text-emerald-600" />
              <h4 className="text-lg font-bold text-emerald-800">Project Manager</h4>
            </div>
            <p className="text-emerald-900 mb-4">
              Project delivery, team coordination, risk tracking.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-emerald-800 mb-2">Primary Access</h5>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Meeting Hub</li>
                  <li>• Task Board</li>
                  <li>• Calendar & Documents</li>
                  <li>• Project Reports</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-emerald-800 mb-2">Key Benefit</h5>
                <p className="text-sm text-emerald-700">
                  Automated meeting minutes, action extraction, status report generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Journeys */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">User Journeys</h2>
        </div>

        {/* Executive Journey */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-amber-700 mb-4">Executive User Journey</h3>
          <div className="bg-amber-50 p-6 rounded-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {['Login', 'Executive Dashboard', 'Review KPIs', 'Check Decision Log', 'Approve Decisions', 'View Strategy'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-amber-200 px-3 py-1 rounded-full text-sm font-medium text-amber-800">
                    {idx + 1}. {step}
                  </div>
                  {idx < 5 && <ArrowRight className="w-4 h-4 text-amber-400" />}
                </div>
              ))}
            </div>
            <p className="text-amber-900 text-sm">
              <strong>Value:</strong> Strategic oversight with AI-generated intelligence, no manual report review.
            </p>
          </div>
        </div>

        {/* PMO Journey */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-purple-700 mb-4">PMO User Journey</h3>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {['Login', 'Portfolio Dashboard', 'Review Stakeholders', 'Audit AI Outputs', 'Generate Reports', 'Export Data'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-purple-200 px-3 py-1 rounded-full text-sm font-medium text-purple-800">
                    {idx + 1}. {step}
                  </div>
                  {idx < 5 && <ArrowRight className="w-4 h-4 text-purple-400" />}
                </div>
              ))}
            </div>
            <p className="text-purple-900 text-sm">
              <strong>Value:</strong> Cross-project governance with full audit trail and explainability.
            </p>
          </div>
        </div>

        {/* Program Manager Journey */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-700 mb-4">Program Manager User Journey</h3>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {['Login', 'Program Dashboard', 'Check Dependencies', 'Review Risks', 'Update Stakeholders', 'Generate Report'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-blue-200 px-3 py-1 rounded-full text-sm font-medium text-blue-800">
                    {idx + 1}. {step}
                  </div>
                  {idx < 5 && <ArrowRight className="w-4 h-4 text-blue-400" />}
                </div>
              ))}
            </div>
            <p className="text-blue-900 text-sm">
              <strong>Value:</strong> Program health visibility with risk prediction across projects.
            </p>
          </div>
        </div>

        {/* Project Manager Journey */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-emerald-700 mb-4">Project Manager User Journey</h3>
          <div className="bg-emerald-50 p-6 rounded-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {['Login', 'Meeting Hub', 'Upload Transcript', 'Review AI Minutes', 'Extract Actions', 'Update Board'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-emerald-200 px-3 py-1 rounded-full text-sm font-medium text-emerald-800">
                    {idx + 1}. {step}
                  </div>
                  {idx < 5 && <ArrowRight className="w-4 h-4 text-emerald-400" />}
                </div>
              ))}
            </div>
            <p className="text-emerald-900 text-sm">
              <strong>Value:</strong> Automated meeting intelligence with action extraction.
            </p>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
};

export default DocsRolesUserJourneys;
