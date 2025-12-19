import DocsLayout from '@/components/docs/DocsLayout';

const DocsAIIntegration = () => {
  return (
    <DocsLayout 
      currentPage={4} 
      totalPages={5} 
      title="AI Integration"
      prevPath="/docs/technical-specs"
      nextPath="/docs/competitive-analysis"
    >
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">AI Integration</h2>
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <p className="text-slate-700"><strong>Powered by Google Gemini</strong> - Advanced AI capabilities integrated throughout the platform.</p>
        </div>
        
        <table className="w-full text-sm border-collapse mb-8">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-3 text-left">Feature</th>
              <th className="border border-slate-300 p-3 text-left">AI Function</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border border-slate-300 p-3">Smart Inbox</td><td className="border border-slate-300 p-3">Sentiment analysis, escalation determination, task extraction</td></tr>
            <tr><td className="border border-slate-300 p-3">Meeting Hub</td><td className="border border-slate-300 p-3">Transcript analysis, summary generation, action item extraction</td></tr>
            <tr><td className="border border-slate-300 p-3">Reports</td><td className="border border-slate-300 p-3">Auto-generation from project data</td></tr>
            <tr><td className="border border-slate-300 p-3">Smart Reply</td><td className="border border-slate-300 p-3">Context-aware email response generation</td></tr>
            <tr><td className="border border-slate-300 p-3">Risk Prediction</td><td className="border border-slate-300 p-3">AI-powered risk assessment and mitigation suggestions</td></tr>
            <tr><td className="border border-slate-300 p-3">Task Suggestions</td><td className="border border-slate-300 p-3">Intelligent task recommendations based on context</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">AI Capabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2">Natural Language Processing</h3>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• Sentiment detection with confidence scores</li>
              <li>• Entity extraction from communications</li>
              <li>• Context-aware response generation</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2">Document Analysis</h3>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• Meeting transcript processing</li>
              <li>• Action item identification</li>
              <li>• Key decision extraction</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2">Predictive Analytics</h3>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• Risk assessment and prediction</li>
              <li>• Project health forecasting</li>
              <li>• Resource optimization suggestions</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2">Automated Workflows</h3>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• Task auto-generation</li>
              <li>• Priority classification</li>
              <li>• Escalation routing</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Security & Privacy</h2>
        
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-medium text-slate-700">End-to-End Encryption</div>
              <p className="text-xs text-slate-500 mt-1">All data encrypted in transit and at rest</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="font-medium text-slate-700">Data Isolation</div>
              <p className="text-xs text-slate-500 mt-1">Strict tenant separation</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-medium text-slate-700">Compliance Ready</div>
              <p className="text-xs text-slate-500 mt-1">Built for enterprise requirements</p>
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
};

export default DocsAIIntegration;
