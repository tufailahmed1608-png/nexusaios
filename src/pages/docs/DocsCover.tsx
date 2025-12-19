import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocsCover = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-white">N</span>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
          Nexus Project OS
        </h1>
        
        <p className="text-2xl text-indigo-300 font-medium mb-2">
          AI-First Project Management Operating System
        </p>
        
        <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto my-8 rounded-full" />
        
        <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto">
          Product Documentation & Technical Specifications
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            onClick={() => navigate('/docs/executive-summary')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            Start Reading
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <button 
            onClick={() => navigate('/docs/executive-summary')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            1. Executive Summary
          </button>
          <button 
            onClick={() => navigate('/docs/core-features')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            2. Core Features
          </button>
          <button 
            onClick={() => navigate('/docs/technical-specs')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            3. Technical Specs
          </button>
          <button 
            onClick={() => navigate('/docs/ai-integration')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            4. AI Integration
          </button>
          <button 
            onClick={() => navigate('/docs/competitive-analysis')}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            5. Competitive Analysis
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-700 text-slate-500 text-sm">
          <p>Document Version: 1.0 | December 2025</p>
          <p className="mt-1">© 2025 Nexus Project OS - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default DocsCover;
