import DocsLayout from '@/components/docs/DocsLayout';
import { Users, UserCheck, ArrowRight, Shield, Eye, Star, Briefcase, Crown, Settings2 } from 'lucide-react';

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
          <h2 className="text-2xl font-bold text-slate-900">Role Hierarchy & Permissions</h2>
        </div>
        <p className="text-slate-600">
          Nexus implements a comprehensive role-based access control system designed for enterprise governance,
          ensuring users see only what's relevant to their responsibilities.
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
          
          {/* PMO/Admin Level */}
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 border-2 border-purple-400 px-6 py-3 rounded-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Admin / PMO</span>
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
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="bg-emerald-100 border-2 border-emerald-400 px-6 py-3 rounded-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">Senior PM</span>
            </div>
            <div className="bg-emerald-100 border-2 border-emerald-400 px-6 py-3 rounded-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">Project Manager</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
          
          {/* User Level */}
          <div className="bg-slate-100 border-2 border-slate-400 px-6 py-3 rounded-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-800">User (Pilot/Evaluator)</span>
          </div>
        </div>
      </div>

      {/* Detailed Role Definitions */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Detailed Role Definitions</h3>
        
        <div className="space-y-6">
          {/* Executive */}
          <div className="border-l-4 border-amber-500 bg-amber-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-amber-600" />
              <h4 className="text-lg font-bold text-amber-800">Executive</h4>
            </div>
            <p className="text-amber-900 mb-4">
              C-suite and senior leadership focused on strategic oversight and governance.
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
                <h5 className="font-semibold text-amber-800 mb-2">Core Value</h5>
                <p className="text-sm text-amber-700">
                  Strategic oversight, governance decisions, portfolio health visibility
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
              Central governance team responsible for portfolio standards and reporting.
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
                <h5 className="font-semibold text-purple-800 mb-2">Core Value</h5>
                <p className="text-sm text-purple-700">
                  Portfolio truth, leadership confidence, standards enforcement
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
              Cross-project oversight role managing multiple related initiatives.
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
                <h5 className="font-semibold text-blue-800 mb-2">Core Value</h5>
                <p className="text-sm text-blue-700">
                  Cross-project visibility, risk mitigation, stakeholder alignment
                </p>
              </div>
            </div>
          </div>

          {/* Project Manager */}
          <div className="border-l-4 border-emerald-500 bg-emerald-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <UserCheck className="w-6 h-6 text-emerald-600" />
              <h4 className="text-lg font-bold text-emerald-800">Project Manager / Senior PM</h4>
            </div>
            <p className="text-emerald-900 mb-4">
              Day-to-day project execution and team coordination.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-emerald-800 mb-2">Primary Access</h5>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Smart Inbox</li>
                  <li>• Task Board</li>
                  <li>• Meeting Hub</li>
                  <li>• Calendar & Documents</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-emerald-800 mb-2">Core Value</h5>
                <p className="text-sm text-emerald-700">
                  Execution efficiency, task automation, communication consolidation
                </p>
              </div>
            </div>
          </div>

          {/* User */}
          <div className="border-l-4 border-slate-500 bg-slate-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-slate-600" />
              <h4 className="text-lg font-bold text-slate-800">User (Pilot/Evaluator)</h4>
            </div>
            <p className="text-slate-900 mb-4">
              New users and evaluators experiencing Nexus capabilities.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-slate-800 mb-2">Primary Access</h5>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Meeting Hub</li>
                  <li>• Scoped Dashboard</li>
                  <li>• Draft Reports</li>
                  <li>• Feedback Submission</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-slate-800 mb-2">Core Value</h5>
                <p className="text-sm text-slate-700">
                  Immediate wow factor, psychological safety, hands-on evaluation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Access Matrix */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Feature Access Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-3 text-left font-semibold">Feature</th>
                <th className="border border-slate-300 p-3 text-center font-semibold">Executive</th>
                <th className="border border-slate-300 p-3 text-center font-semibold">PMO</th>
                <th className="border border-slate-300 p-3 text-center font-semibold">Program Mgr</th>
                <th className="border border-slate-300 p-3 text-center font-semibold">PM</th>
                <th className="border border-slate-300 p-3 text-center font-semibold">User</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Executive Dashboard', '⭐', '⭐', '⭐', '◽', '◽'],
                ['Decision Log', '⭐', '⭐', '🚫', '🚫', '🚫'],
                ['Auto Reports', '⭐', '⭐', '⭐', '◽', '◽'],
                ['Meeting Hub', '🚫', '⭐', '◽', '⭐', '⭐'],
                ['Strategy View', '⭐', '⭐', '🚫', '🚫', '🚫'],
                ['Stakeholders', '🚫', '⭐', '⭐', '🚫', '🚫'],
                ['Risk Prediction', '🚫', '◽', '⭐', '🚫', '🚫'],
                ['Task Board', '🚫', '◽', '◽', '⭐', '🚫'],
                ['Smart Inbox', '🚫', '🚫', '◽', '⭐', '🚫'],
                ['Calendar', '🚫', '◽', '◽', '⭐', '🚫'],
                ['Activity Feed', '⭐', '⭐', '◽', '◽', '🚫'],
                ['AI Controls', '🚫', '◽', '🚫', '🚫', '🚫'],
              ].map(([feature, ...roles], idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-300 p-3 font-medium">{feature}</td>
                  {roles.map((access, i) => (
                    <td key={i} className="border border-slate-300 p-3 text-center text-lg">
                      {access}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-6 text-sm text-slate-600">
          <span><span className="text-lg">⭐</span> Primary value</span>
          <span><span className="text-lg">◽</span> Secondary access</span>
          <span><span className="text-lg">🚫</span> Restricted</span>
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
              {['Login', 'Executive Dashboard', 'Review KPIs', 'Check Decision Log', 'Approve Decisions', 'View Strategy', 'Generate Report'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-amber-200 px-3 py-1 rounded-full text-sm font-medium text-amber-800">
                    {idx + 1}. {step}
                  </div>
                  {idx < 6 && <ArrowRight className="w-4 h-4 text-amber-400" />}
                </div>
              ))}
            </div>
            <p className="text-amber-900 text-sm">
              <strong>Time saved:</strong> 2+ hours/week on status meetings and report review
            </p>
          </div>
        </div>

        {/* PMO Journey */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-purple-700 mb-4">PMO User Journey</h3>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {['Login', 'Portfolio Dashboard', 'Review Stakeholders', 'Audit AI Outputs', 'Configure Settings', 'Generate Reports', 'Export Data'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-purple-200 px-3 py-1 rounded-full text-sm font-medium text-purple-800">
                    {idx + 1}. {step}
                  </div>
                  {idx < 6 && <ArrowRight className="w-4 h-4 text-purple-400" />}
                </div>
              ))}
            </div>
            <p className="text-purple-900 text-sm">
              <strong>Time saved:</strong> 5+ hours/week on data consolidation and reporting
            </p>
          </div>
        </div>

        {/* Project Manager Journey */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-emerald-700 mb-4">Project Manager User Journey</h3>
          <div className="bg-emerald-50 p-6 rounded-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {['Login', 'Smart Inbox', 'Process Emails', 'Extract Tasks', 'Update Task Board', 'Meeting Hub', 'Generate Minutes'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-emerald-200 px-3 py-1 rounded-full text-sm font-medium text-emerald-800">
                    {idx + 1}. {step}
                  </div>
                  {idx < 6 && <ArrowRight className="w-4 h-4 text-emerald-400" />}
                </div>
              ))}
            </div>
            <p className="text-emerald-900 text-sm">
              <strong>Time saved:</strong> 8+ hours/week on email processing and meeting documentation
            </p>
          </div>
        </div>

        {/* Pilot User Journey */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Pilot User Journey</h3>
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {['Request Demo', 'Get Account', 'Explore Dashboard', 'Try Meeting Hub', 'Submit Feedback', 'Request Upgrade'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-slate-200 px-3 py-1 rounded-full text-sm font-medium text-slate-800">
                    {idx + 1}. {step}
                  </div>
                  {idx < 5 && <ArrowRight className="w-4 h-4 text-slate-400" />}
                </div>
              ))}
            </div>
            <p className="text-slate-900 text-sm">
              <strong>Goal:</strong> Experience AI-powered capabilities with psychological safety
            </p>
          </div>
        </div>
      </div>

      {/* Role Request Workflow */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Role Request Workflow</h3>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'New User', desc: 'Starts with Pilot access' },
              { step: '2', title: 'Request', desc: 'User requests elevated role' },
              { step: '3', title: 'Review', desc: 'Admin reviews request' },
              { step: '4', title: 'Approve', desc: 'Approval with notes' },
              { step: '5', title: 'Access', desc: 'Instant new permissions' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-indigo-900">{item.title}</h4>
                <p className="text-sm text-indigo-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Accounts */}
      <div className="bg-slate-100 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Test Accounts for Demonstration</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left py-2 font-semibold">Email</th>
                <th className="text-left py-2 font-semibold">Role</th>
                <th className="text-left py-2 font-semibold">Password</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {[
                ['pm@nexusaios.com', 'Project Manager', 'Jan@2026*'],
                ['spm@nexusaios.com', 'Senior Project Manager', 'Jan@2026*'],
                ['pgm@nexusaios.com', 'Program Manager', 'Jan@2026*'],
                ['pmo@nexusaios.com', 'PMO', 'Jan@2026*'],
                ['exc@nexusaios.com', 'Executive', 'Jan@2026*'],
                ['admin@nexusaios.com', 'Admin', 'Jan@2026*'],
              ].map(([email, role, password], idx) => (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="py-2">{email}</td>
                  <td className="py-2">{role}</td>
                  <td className="py-2">{password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DocsLayout>
  );
};

export default DocsRolesUserJourneys;