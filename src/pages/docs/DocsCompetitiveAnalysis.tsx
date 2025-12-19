import DocsLayout from '@/components/docs/DocsLayout';

const DocsCompetitiveAnalysis = () => {
  return (
    <DocsLayout 
      currentPage={5} 
      totalPages={5} 
      title="Competitive Analysis"
      prevPath="/docs/ai-integration"
      nextPath={null}
    >
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
            <tr><td className="border border-slate-300 p-2">RTL Language Support</td><td className="border border-slate-300 p-2 text-center text-green-600">✓</td><td className="border border-slate-300 p-2 text-center text-amber-500">Limited</td><td className="border border-slate-300 p-2 text-center text-amber-500">Limited</td><td className="border border-slate-300 p-2 text-center text-green-600">✓</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Key Differentiators</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">AI-First Architecture</h3>
            <p className="text-slate-600 text-sm">Built from the ground up with AI at its core, not bolted on as an afterthought.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Unified Communication Hub</h3>
            <p className="text-slate-600 text-sm">Email, meetings, and tasks in one place—eliminating context switching.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Automated Intelligence</h3>
            <p className="text-slate-600 text-sm">Tasks and insights generated automatically from your communications.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Enterprise-Ready</h3>
            <p className="text-slate-600 text-sm">Built for PMO teams with stakeholder management and executive dashboards.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Roadmap</h2>
        
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-slate-700">OAuth integration for major providers</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-slate-700">Real-time collaboration features</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-slate-700">Mobile application (iOS & Android)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-slate-700">Advanced analytics and reporting</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-slate-700">Custom AI model training</span>
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
