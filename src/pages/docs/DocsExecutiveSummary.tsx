import DocsLayout from '@/components/docs/DocsLayout';

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

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Key Value Propositions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2">Unified Workspace</h3>
            <p className="text-slate-600 text-sm">Single platform for emails, meetings, tasks, and reports—no more context switching.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2">AI-Powered Insights</h3>
            <p className="text-slate-600 text-sm">Automatic sentiment analysis, task extraction, and risk prediction from all communications.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2">Real-Time Intelligence</h3>
            <p className="text-slate-600 text-sm">Live dashboards with KPIs, budget tracking, and portfolio health visualization.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2">Automated Reporting</h3>
            <p className="text-slate-600 text-sm">Generate comprehensive status reports with a single click using AI.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Platform Overview</h2>
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">9+</div>
              <div className="text-sm text-slate-600">Core Modules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">2</div>
              <div className="text-sm text-slate-600">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">AI</div>
              <div className="text-sm text-slate-600">Powered</div>
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
};

export default DocsExecutiveSummary;
