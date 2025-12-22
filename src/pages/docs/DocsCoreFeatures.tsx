import DocsLayout from '@/components/docs/DocsLayout';

const DocsCoreFeatures = () => {
  return (
    <DocsLayout 
      currentPage={2} 
      totalPages={7} 
      title="Core Features"
      prevPath="/docs/executive-summary"
      nextPath="/docs/technical-specs"
    >
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
    </DocsLayout>
  );
};

export default DocsCoreFeatures;
