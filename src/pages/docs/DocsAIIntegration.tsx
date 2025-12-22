import DocsLayout from '@/components/docs/DocsLayout';
import { Brain, Users, Lock, Shield, ArrowRight, Eye, GitBranch } from 'lucide-react';

const DocsAIIntegration = () => {
  return (
    <DocsLayout 
      currentPage={4} 
      totalPages={7} 
      title="AI & Governance"
      prevPath="/docs/technical-specs"
      nextPath="/docs/competitive-analysis"
    >
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">AI Operating Principles</h2>
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <p className="text-slate-700"><strong>Human Accountability, AI-Powered Intelligence.</strong> Nexus enforces human-in-the-loop governance. AI assists analysis, humans approve and decide.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">AI Assists Analysis</h3>
              <p className="text-slate-600 text-sm">AI prepares insights, drafts, and recommendations for human review.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Humans Approve & Decide</h3>
              <p className="text-slate-600 text-sm">Final decisions always require human approval and accountability.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">No Autonomous Decisions</h3>
              <p className="text-slate-600 text-sm">Nexus never makes decisions on its own—humans remain in control.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Controlled Lifecycle</h3>
              <p className="text-slate-600 text-sm">Every AI output follows Draft → Reviewed → Approved → Published.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">AI Output Lifecycle</h2>
        
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-slate-800">Every AI Output Follows This Workflow</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-4 py-2 rounded-full bg-slate-200 text-sm font-medium text-slate-600">Draft</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="px-4 py-2 rounded-full bg-amber-100 text-sm font-medium text-amber-700">Reviewed</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="px-4 py-2 rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">Approved</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="px-4 py-2 rounded-full bg-emerald-100 text-sm font-medium text-emerald-700">Published</span>
          </div>
        </div>

        <table className="w-full text-sm border-collapse mb-8">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-3 text-left">Stage</th>
              <th className="border border-slate-300 p-3 text-left">Description</th>
              <th className="border border-slate-300 p-3 text-left">Who Acts</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border border-slate-300 p-3 font-medium">Draft</td><td className="border border-slate-300 p-3">AI generates initial output based on data analysis</td><td className="border border-slate-300 p-3">AI System</td></tr>
            <tr><td className="border border-slate-300 p-3 font-medium">Reviewed</td><td className="border border-slate-300 p-3">Human reviews AI output for accuracy and completeness</td><td className="border border-slate-300 p-3">PMO / Manager</td></tr>
            <tr><td className="border border-slate-300 p-3 font-medium">Approved</td><td className="border border-slate-300 p-3">Authorized stakeholder approves for distribution</td><td className="border border-slate-300 p-3">Executive / PMO</td></tr>
            <tr><td className="border border-slate-300 p-3 font-medium">Published</td><td className="border border-slate-300 p-3">Output becomes official and visible to stakeholders</td><td className="border border-slate-300 p-3">System</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Explainability & Transparency</h2>
        
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-slate-800">Full Explainability</span>
          </div>
          <p className="text-slate-700 mb-4">Every AI insight shows source, rationale, confidence, and approval status.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-slate-800 mb-2">Source Attribution</h4>
              <p className="text-slate-600 text-sm">Every insight links back to the original data—meetings, emails, or documents.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-slate-800 mb-2">Confidence Scores</h4>
              <p className="text-slate-600 text-sm">AI outputs include confidence levels so reviewers can prioritize verification.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-slate-800 mb-2">Reasoning Display</h4>
              <p className="text-slate-600 text-sm">Understand why AI made specific recommendations or flagged certain items.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-slate-800 mb-2">Audit Trail</h4>
              <p className="text-slate-600 text-sm">Complete history of changes, reviews, and approvals for compliance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Key Metrics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-lg text-white text-center">
            <div className="text-2xl font-bold">Zero</div>
            <div className="text-indigo-100 text-sm">Tool replacement</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-lg text-white text-center">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-emerald-100 text-sm">Human accountability</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white text-center">
            <div className="text-2xl font-bold">Full</div>
            <div className="text-purple-100 text-sm">Explainability</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-lg text-white text-center">
            <div className="text-2xl font-bold">Complete</div>
            <div className="text-amber-100 text-sm">Audit trail</div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
};

export default DocsAIIntegration;
