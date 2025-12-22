import DocsLayout from '@/components/docs/DocsLayout';

const DocsTechnicalSpecs = () => {
  return (
    <DocsLayout 
      currentPage={3} 
      totalPages={7} 
      title="Technical Specifications"
      prevPath="/docs/core-features"
      nextPath="/docs/ai-integration"
    >
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Technical Specifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">Multi-Language Support</h4>
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• English (LTR) - Full support</li>
              <li>• Arabic (RTL) - Complete RTL layout</li>
              <li>• Runtime language toggle</li>
              <li>• Persistent preferences</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">Theme Support</h4>
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• Light Mode (default)</li>
              <li>• Dark Mode</li>
              <li>• Instant theme switching</li>
              <li>• Consistent design across themes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Architecture Overview</h2>
        
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-lg mb-6">
          <h4 className="font-semibold text-slate-800 mb-4">Technology Stack</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-indigo-600 font-semibold">React</div>
              <div className="text-xs text-slate-500">Frontend</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-indigo-600 font-semibold">TypeScript</div>
              <div className="text-xs text-slate-500">Language</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-indigo-600 font-semibold">Tailwind CSS</div>
              <div className="text-xs text-slate-500">Styling</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-indigo-600 font-semibold">Supabase</div>
              <div className="text-xs text-slate-500">Backend</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">Security Features</h4>
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• Row Level Security (RLS)</li>
              <li>• JWT Authentication</li>
              <li>• Input Validation</li>
              <li>• Encrypted data transmission</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">Performance</h4>
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• Real-time data sync</li>
              <li>• Optimized queries</li>
              <li>• Lazy loading</li>
              <li>• Edge function deployment</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Design System</h2>
        
        <div className="bg-slate-50 p-6 rounded-lg">
          <h4 className="font-semibold text-slate-800 mb-4">Color Palette</h4>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-indigo-600"></div>
              <span className="text-sm text-slate-600">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-purple-600"></div>
              <span className="text-sm text-slate-600">Accent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-500"></div>
              <span className="text-sm text-slate-600">Success</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-amber-500"></div>
              <span className="text-sm text-slate-600">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-red-500"></div>
              <span className="text-sm text-slate-600">Error</span>
            </div>
          </div>
          
          <h4 className="font-semibold text-slate-800 mb-2">Typography</h4>
          <p className="text-slate-700 text-sm">Primary font family with consistent sizing scale across all components.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Integrations</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">📁</div>
            <div className="font-medium text-slate-700">Google Drive</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">☁️</div>
            <div className="font-medium text-slate-700">OneDrive</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium text-slate-700">Jira</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="font-medium text-slate-700">Slack</div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
};

export default DocsTechnicalSpecs;
