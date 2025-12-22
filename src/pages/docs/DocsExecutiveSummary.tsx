import DocsLayout from '@/components/docs/DocsLayout';
import { Brain, Users, Shield, Eye, Gavel, ArrowRight } from 'lucide-react';

const DocsExecutiveSummary = () => {
  return (
    <DocsLayout 
      currentPage={1} 
      totalPages={7} 
      title="Executive Summary"
      prevPath="/docs"
      nextPath="/docs/core-features"
    >
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Executive Summary</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          Nexus Project OS is the intelligence layer for PMO and executives. Unlike traditional project management tools 
          that focus on task and project execution tracking, Nexus observes your existing delivery systems—Jira, Microsoft 365, 
          email, and meetings—and converts signals into structured intelligence for decision-making.
        </p>
        <div className="bg-indigo-50 p-4 rounded-lg mb-4">
          <p className="text-slate-700"><strong>Target Users:</strong> PMO teams, executives, and program managers who need unified visibility across portfolios without replacing their existing delivery tools.</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-slate-700"><strong>Core Philosophy:</strong> Intelligence, not execution. AI assists analysis, humans approve and decide. Every AI output follows a Draft → Reviewed → Approved lifecycle.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">How Nexus Works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-indigo-800 mb-2">01. Observe</h3>
            <p className="text-slate-600 text-sm">Connect to your existing delivery systems—Jira, M365, email, meetings—without replacing them.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-indigo-800 mb-2">02. Analyze</h3>
            <p className="text-slate-600 text-sm">AI converts meetings and delivery signals into structured intelligence with full explainability.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
              <Gavel className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-indigo-800 mb-2">03. Decide</h3>
            <p className="text-slate-600 text-sm">Executives and PMO receive approved, auditable intelligence. Humans remain accountable.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">AI Operating Principles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">AI Assists Analysis</h3>
              <p className="text-slate-600 text-sm">AI prepares insights and recommendations for human review.</p>
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
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">No Autonomous Decisions</h3>
              <p className="text-slate-600 text-sm">Nexus never makes decisions on its own—humans remain in control.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Controlled Lifecycle</h3>
              <p className="text-slate-600 text-sm">Every AI output follows Draft → Reviewed → Approved → Published.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Platform Overview</h2>
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">Zero</div>
              <div className="text-sm text-slate-600">Tool Replacement</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">100%</div>
              <div className="text-sm text-slate-600">Human Accountability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">Full</div>
              <div className="text-sm text-slate-600">Explainability</div>
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
};

export default DocsExecutiveSummary;
