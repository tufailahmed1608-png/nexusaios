import DocsLayout from '@/components/docs/DocsLayout';
import { TrendingUp, Target, Zap, BarChart3, Globe, Rocket, CheckCircle, ArrowUpRight } from 'lucide-react';

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
          <h2 className="text-2xl font-bold text-slate-900">Market Position</h2>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white mb-6">
          <blockquote className="text-xl font-light italic text-center leading-relaxed">
            "Intelligence layer for PMO and executives—observing existing delivery systems, 
            not replacing them."
          </blockquote>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-indigo-600 mb-2">PMO & Executives</h3>
            <p className="text-indigo-700 text-sm">Primary target users</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-emerald-600 mb-2">Zero Replacement</h3>
            <p className="text-emerald-700 text-sm">Works with existing tools</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-amber-600 mb-2">100% Human</h3>
            <p className="text-amber-700 text-sm">Accountability guaranteed</p>
          </div>
        </div>
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
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-bold text-indigo-900">Primary Target</h3>
            </div>
            <h4 className="text-xl font-semibold text-indigo-800 mb-3">Enterprise PMO & Executives</h4>
            <ul className="space-y-2 text-indigo-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Organizations with complex project portfolios</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Teams using multiple delivery tools (Jira, M365, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Need for unified visibility without tool replacement</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Governance and audit requirements</span>
              </li>
            </ul>
          </div>

          {/* Secondary Target */}
          <div className="border-2 border-emerald-500 bg-emerald-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-900">Secondary Target</h3>
            </div>
            <h4 className="text-xl font-semibold text-emerald-800 mb-3">Program Managers</h4>
            <ul className="space-y-2 text-emerald-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Managing multiple related initiatives</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Cross-project dependency tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Stakeholder communication needs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Risk prediction and mitigation</span>
              </li>
            </ul>
          </div>
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

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Intelligence Layer</h3>
            <p className="text-indigo-700 text-sm">
              Observes existing systems, doesn't replace them. Works alongside Jira, M365, and your current tools.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">Meeting-First Intelligence</h3>
            <p className="text-emerald-700 text-sm">
              Automated MoM generation, decision extraction, and action tracking from every meeting.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">Human-in-the-Loop</h3>
            <p className="text-amber-700 text-sm">
              AI assists analysis, humans approve and decide. Full explainability and audit trail.
            </p>
          </div>
        </div>
      </div>

      {/* Pilot Program */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Pilot Program</h2>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-blue-800 mb-4">Limited Pilot Access Available</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-3">What's Included</h4>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Full access to Meeting Intelligence Hub</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Executive Dashboard and reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Decision Log with audit trail</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Dedicated onboarding support</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-3">Pilot Benefits</h4>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Direct feedback to product team</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Preferential pricing at launch</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Integration support</span>
                </li>
              </ul>
            </div>
          </div>
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
            <h4 className="text-indigo-300 font-semibold mb-3">Near Term</h4>
            <ul className="space-y-2 text-indigo-100">
              <li>• Enhanced meeting intelligence</li>
              <li>• Additional integration connectors</li>
              <li>• Mobile application</li>
              <li>• Advanced risk prediction</li>
            </ul>
          </div>
          <div>
            <h4 className="text-indigo-300 font-semibold mb-3">Long Term</h4>
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
