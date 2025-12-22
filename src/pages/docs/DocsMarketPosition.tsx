import DocsLayout from '@/components/docs/DocsLayout';
import { TrendingUp, Target, Zap, Award, BarChart3, Globe, Rocket, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';

const DocsMarketPosition = () => {
  return (
    <DocsLayout
      title="Market Position & Strategy"
      currentPage={7}
      totalPages={7}
      prevPath="/docs/roles-user-journeys"
      nextPath={null}
    >
      {/* Market Overview */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Market Overview</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white">
            <h3 className="text-3xl font-bold mb-2">$8.2B</h3>
            <p className="text-indigo-100">Project Management Software Market (2024)</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white">
            <h3 className="text-3xl font-bold mb-2">15.7%</h3>
            <p className="text-emerald-100">CAGR Growth Rate (2024-2030)</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white">
            <h3 className="text-3xl font-bold mb-2">$20.6B</h3>
            <p className="text-amber-100">Projected Market Size (2030)</p>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed">
          The project management software market is experiencing rapid growth driven by digital transformation, 
          remote work adoption, and increasing demand for AI-powered automation. Enterprise customers are 
          actively seeking solutions that consolidate multiple tools and reduce context switching.
        </p>
      </div>

      {/* Target Market Segments */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Target Market Segments</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary Target */}
          <div className="border-2 border-indigo-500 bg-indigo-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-bold text-indigo-900">Primary Target</h3>
            </div>
            <h4 className="text-xl font-semibold text-indigo-800 mb-3">Enterprise PMO & Executives</h4>
            <ul className="space-y-2 text-indigo-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Fortune 500 companies with complex project portfolios</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Organizations with 50+ concurrent projects</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Teams struggling with tool fragmentation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Budget: $50K-$500K annually</span>
              </li>
            </ul>
          </div>

          {/* Secondary Target */}
          <div className="border-2 border-emerald-500 bg-emerald-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-900">Secondary Target</h3>
            </div>
            <h4 className="text-xl font-semibold text-emerald-800 mb-3">Mid-Market Project Teams</h4>
            <ul className="space-y-2 text-emerald-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Growing companies with 100-1000 employees</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Professional services and consulting firms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Technology companies with product teams</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Budget: $10K-$50K annually</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Competitive Landscape */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Competitive Landscape</h2>
        </div>

        {/* Competitive Matrix */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="border border-slate-600 p-3 text-left">Capability</th>
                <th className="border border-slate-600 p-3 text-center bg-indigo-700">Nexus</th>
                <th className="border border-slate-600 p-3 text-center">Jira</th>
                <th className="border border-slate-600 p-3 text-center">Asana</th>
                <th className="border border-slate-600 p-3 text-center">Monday</th>
                <th className="border border-slate-600 p-3 text-center">MS Project</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['AI Sentiment Analysis', true, false, false, false, false],
                ['Auto Task Extraction', true, false, false, false, false],
                ['Meeting Transcript AI', true, false, false, false, false],
                ['Email Integration', true, 'partial', 'partial', 'partial', 'partial'],
                ['AI Report Generation', true, false, false, false, false],
                ['Escalation Matrix', true, false, false, false, false],
                ['Decision Audit Trail', true, false, false, false, 'partial'],
                ['Role-Based Dashboards', true, 'partial', 'partial', true, true],
                ['Stakeholder Management', true, false, 'partial', 'partial', false],
                ['RTL Language Support', true, true, true, true, true],
              ].map(([feature, ...values], idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-300 p-3 font-medium">{feature}</td>
                  {values.map((val, i) => (
                    <td key={i} className={`border border-slate-300 p-3 text-center ${i === 0 ? 'bg-indigo-50' : ''}`}>
                      {val === true ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : val === false ? (
                        <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-amber-600 text-xs">Partial</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unique Value Proposition */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Unique Value Proposition</h2>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-8 rounded-xl text-white mb-6">
          <blockquote className="text-2xl font-light italic text-center leading-relaxed">
            "The single point of work for project managers—eliminating context switching 
            between emails, spreadsheets, and multiple PMO tools through AI automation."
          </blockquote>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-indigo-900 mb-2">AI-First Architecture</h3>
            <p className="text-indigo-700 text-sm">
              Built from ground up with AI at the core, not as an afterthought add-on.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">Consolidated Interface</h3>
            <p className="text-emerald-700 text-sm">
              One platform for email, meetings, tasks, strategy, and reporting.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">Role-Specific Value</h3>
            <p className="text-amber-700 text-sm">
              Tailored experiences for executives, PMO, and project managers.
            </p>
          </div>
        </div>
      </div>

      {/* Go-To-Market Strategy */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Go-To-Market Strategy</h2>
        </div>

        <div className="space-y-6">
          {/* Phase 1 */}
          <div className="border-l-4 border-indigo-500 bg-indigo-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-lg font-bold text-indigo-800">Phase 1: Pilot Program (Current)</h3>
            </div>
            <ul className="text-indigo-700 space-y-2 ml-11">
              <li>• Limited pilot with select enterprise customers</li>
              <li>• Focus on PMO and executive use cases</li>
              <li>• Gather feedback and refine AI capabilities</li>
              <li>• Build case studies and testimonials</li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="border-l-4 border-emerald-500 bg-emerald-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-lg font-bold text-emerald-800">Phase 2: Controlled Expansion (Q2 2025)</h3>
            </div>
            <ul className="text-emerald-700 space-y-2 ml-11">
              <li>• Expand to 50+ enterprise customers</li>
              <li>• Launch partner/reseller program</li>
              <li>• Industry-specific templates and workflows</li>
              <li>• Mobile application release</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="border-l-4 border-amber-500 bg-amber-50 p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-lg font-bold text-amber-800">Phase 3: Scale (Q4 2025)</h3>
            </div>
            <ul className="text-amber-700 space-y-2 ml-11">
              <li>• General availability launch</li>
              <li>• API platform for integrations</li>
              <li>• Self-service mid-market tier</li>
              <li>• Global expansion</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Revenue Model */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Revenue Model</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-slate-200 p-6 rounded-xl">
            <h4 className="text-lg font-bold text-slate-800 mb-2">Starter</h4>
            <p className="text-3xl font-bold text-indigo-600 mb-2">$49<span className="text-lg text-slate-500">/user/mo</span></p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Core PM features</li>
              <li>• Basic AI automation</li>
              <li>• 5 projects</li>
            </ul>
          </div>
          
          <div className="border-2 border-indigo-500 bg-indigo-50 p-6 rounded-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
              POPULAR
            </div>
            <h4 className="text-lg font-bold text-indigo-800 mb-2">Professional</h4>
            <p className="text-3xl font-bold text-indigo-600 mb-2">$99<span className="text-lg text-slate-500">/user/mo</span></p>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Full AI capabilities</li>
              <li>• Unlimited projects</li>
              <li>• Role-based access</li>
              <li>• Priority support</li>
            </ul>
          </div>
          
          <div className="border border-slate-200 p-6 rounded-xl">
            <h4 className="text-lg font-bold text-slate-800 mb-2">Enterprise</h4>
            <p className="text-3xl font-bold text-indigo-600 mb-2">Custom</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Custom integrations</li>
              <li>• Dedicated support</li>
              <li>• SLA guarantees</li>
              <li>• On-premise option</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Key Success Metrics</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { metric: '60%', label: 'Reduction in email processing time' },
            { metric: '8+ hrs', label: 'Saved per PM per week' },
            { metric: '90%', label: 'Accuracy in task extraction' },
            { metric: '40%', label: 'Faster status reporting' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-100 to-slate-50 p-6 rounded-xl text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">{item.metric}</p>
              <p className="text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-xl text-white">
        <div className="flex items-center gap-3 mb-6">
          <ArrowUpRight className="w-6 h-6 text-indigo-300" />
          <h3 className="text-xl font-bold">Product Roadmap</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-indigo-300 font-semibold mb-3">Q1-Q2 2025</h4>
            <ul className="space-y-2 text-indigo-100">
              <li>• Google OAuth & SSO integration</li>
              <li>• Real-time collaboration features</li>
              <li>• Mobile application (iOS/Android)</li>
              <li>• Advanced AI predictions</li>
            </ul>
          </div>
          <div>
            <h4 className="text-indigo-300 font-semibold mb-3">Q3-Q4 2025</h4>
            <ul className="space-y-2 text-indigo-100">
              <li>• Custom workflow automation</li>
              <li>• Public API platform</li>
              <li>• Marketplace for integrations</li>
              <li>• Multi-language AI support</li>
            </ul>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
};

export default DocsMarketPosition;