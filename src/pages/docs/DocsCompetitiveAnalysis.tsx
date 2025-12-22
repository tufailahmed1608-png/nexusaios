import DocsLayout from '@/components/docs/DocsLayout';
import { Check, X } from 'lucide-react';

const DocsCompetitiveAnalysis = () => {
  const comparisonData = [
    { category: 'Primary Purpose', nexus: 'Intelligence layer for decision support', traditional: 'Task & project execution tracking' },
    { category: 'Relationship to Tools', nexus: 'Observes existing systems (Jira, M365, etc.)', traditional: 'Replaces or competes with other tools' },
    { category: 'AI Role', nexus: 'Assists analysis, humans decide', traditional: 'Automation focus, limited intelligence' },
    { category: 'Target Users', nexus: 'PMO, Executives, Program Managers', traditional: 'Project Managers, Team Members' },
    { category: 'Meeting Intelligence', nexus: 'Auto MoM, action extraction, decisions', traditional: 'Manual notes or basic transcription' },
    { category: 'Reporting', nexus: 'AI-generated executive summaries', traditional: 'Manual report creation' },
    { category: 'Decision Tracking', nexus: 'Structured log with audit trail', traditional: 'Scattered in emails/docs' },
    { category: 'Governance', nexus: 'Human-in-the-loop enforcement', traditional: 'Process-dependent' },
  ];

  const notDoList = [
    'Replace Jira, Asana, or Monday.com',
    'Manage individual task assignments',
    'Run daily standups or sprints',
    'Automate decisions without human approval',
    'Operate independently of your existing tools',
  ];

  return (
    <DocsLayout 
      currentPage={5} 
      totalPages={7} 
      title="Positioning"
      prevPath="/docs/ai-integration"
      nextPath="/docs/roles-user-journeys"
    >
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Nexus vs Traditional PM Tools</h2>
        <p className="text-slate-600 mb-6">
          Nexus is not another PM tool. It's an intelligence layer that works with your existing tools.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border border-slate-300 p-3 text-left font-semibold">Category</th>
                <th className="border border-slate-300 p-3 text-left font-semibold bg-indigo-200">Nexus</th>
                <th className="border border-slate-300 p-3 text-left font-semibold">Traditional PM Tools</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-300 p-3 font-medium">{row.category}</td>
                  <td className="border border-slate-300 p-3 text-indigo-700 bg-indigo-50">{row.nexus}</td>
                  <td className="border border-slate-300 p-3 text-slate-600">{row.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">What Nexus Does NOT Do</h2>
        <p className="text-slate-600 mb-4">
          Clarity on boundaries. Nexus focuses on intelligence, not execution.
        </p>
        
        <div className="bg-red-50 p-6 rounded-lg border border-red-100">
          <div className="grid md:grid-cols-2 gap-3">
            {notDoList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Key Differentiators</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Intelligence Layer</h3>
            <p className="text-slate-600 text-sm">Observes your existing systems and provides structured intelligence—doesn't replace your tools.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Meeting-First Intelligence</h3>
            <p className="text-slate-600 text-sm">Automated MoM generation, decision extraction, and action item tracking from every meeting.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Human-in-the-Loop Governance</h3>
            <p className="text-slate-600 text-sm">AI assists analysis, humans approve and decide. Every output has a controlled lifecycle.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Executive & PMO Focus</h3>
            <p className="text-slate-600 text-sm">Built for portfolio oversight and strategic decision-making, not task execution.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Integration Philosophy</h2>
        
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔗</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Connect</h4>
              <p className="text-slate-600 text-sm">Integrate with Jira, M365, Teams, Slack, Confluence</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👁️</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Observe</h4>
              <p className="text-slate-600 text-sm">Monitor signals from your existing delivery systems</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🧠</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Analyze</h4>
              <p className="text-slate-600 text-sm">Convert signals into structured intelligence for decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>Document Version: 1.0 | Last Updated: December 2025</p>
        <p className="mt-1">© 2025 Nexus Project OS - All Rights Reserved</p>
      </div>
    </DocsLayout>
  );
};

export default DocsCompetitiveAnalysis;
