import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ArchitectureDiagrams = () => {
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('diagrams-container');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('Masira-Architecture-Diagrams.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Masira Architecture Diagrams</h1>
          </div>
          <Button onClick={exportToPDF} disabled={isExporting} size="lg">
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to PDF
              </>
            )}
          </Button>
        </div>

        <div id="diagrams-container" className="space-y-8 bg-white p-8 rounded-lg">
          {/* System Architecture Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Masira System Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 900 700" className="w-full h-auto" style={{ minHeight: '500px' }}>
                  {/* Frontend Layer */}
                  <rect x="50" y="30" width="800" height="80" rx="8" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" strokeWidth="2"/>
                  <text x="450" y="55" textAnchor="middle" className="font-bold text-lg" fill="#3b82f6">Frontend Layer</text>
                  <rect x="80" y="65" width="120" height="35" rx="4" fill="#3b82f6"/>
                  <text x="140" y="88" textAnchor="middle" fill="white" fontSize="12">React + Vite</text>
                  <rect x="220" y="65" width="120" height="35" rx="4" fill="#3b82f6"/>
                  <text x="280" y="88" textAnchor="middle" fill="white" fontSize="12">Authentication</text>
                  <rect x="360" y="65" width="120" height="35" rx="4" fill="#3b82f6"/>
                  <text x="420" y="88" textAnchor="middle" fill="white" fontSize="12">8-Level RBAC</text>

                  {/* Layer 1: Core Intelligence */}
                  <rect x="50" y="130" width="250" height="130" rx="8" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="2"/>
                  <text x="175" y="155" textAnchor="middle" className="font-bold" fill="#22c55e">Layer 1: Core Intelligence</text>
                  <rect x="70" y="170" width="100" height="30" rx="4" fill="#22c55e"/>
                  <text x="120" y="190" textAnchor="middle" fill="white" fontSize="11">Meeting Hub</text>
                  <rect x="180" y="170" width="100" height="30" rx="4" fill="#22c55e"/>
                  <text x="230" y="190" textAnchor="middle" fill="white" fontSize="11">Dashboard</text>
                  <rect x="70" y="210" width="100" height="30" rx="4" fill="#22c55e"/>
                  <text x="120" y="230" textAnchor="middle" fill="white" fontSize="11">Decision Log</text>
                  <rect x="180" y="210" width="100" height="30" rx="4" fill="#22c55e"/>
                  <text x="230" y="230" textAnchor="middle" fill="white" fontSize="11">Reports</text>

                  {/* Layer 2: Operational Support */}
                  <rect x="320" y="130" width="250" height="130" rx="8" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" strokeWidth="2"/>
                  <text x="445" y="155" textAnchor="middle" className="font-bold" fill="#f59e0b">Layer 2: Operational Support</text>
                  <rect x="340" y="170" width="100" height="30" rx="4" fill="#f59e0b"/>
                  <text x="390" y="190" textAnchor="middle" fill="white" fontSize="11">Task Board</text>
                  <rect x="450" y="170" width="100" height="30" rx="4" fill="#f59e0b"/>
                  <text x="500" y="190" textAnchor="middle" fill="white" fontSize="11">Documents</text>
                  <rect x="340" y="210" width="100" height="30" rx="4" fill="#f59e0b"/>
                  <text x="390" y="230" textAnchor="middle" fill="white" fontSize="11">Stakeholders</text>
                  <rect x="450" y="210" width="100" height="30" rx="4" fill="#f59e0b"/>
                  <text x="500" y="230" textAnchor="middle" fill="white" fontSize="11">Team View</text>

                  {/* Layer 3: Experience & Signal */}
                  <rect x="590" y="130" width="250" height="130" rx="8" fill="#8b5cf6" opacity="0.1" stroke="#8b5cf6" strokeWidth="2"/>
                  <text x="715" y="155" textAnchor="middle" className="font-bold" fill="#8b5cf6">Layer 3: Experience & Signal</text>
                  <rect x="610" y="170" width="100" height="30" rx="4" fill="#8b5cf6"/>
                  <text x="660" y="190" textAnchor="middle" fill="white" fontSize="11">Smart Inbox</text>
                  <rect x="720" y="170" width="100" height="30" rx="4" fill="#8b5cf6"/>
                  <text x="770" y="190" textAnchor="middle" fill="white" fontSize="11">Signal Engine</text>
                  <rect x="610" y="210" width="100" height="30" rx="4" fill="#8b5cf6"/>
                  <text x="660" y="230" textAnchor="middle" fill="white" fontSize="11">Risk Prediction</text>
                  <rect x="720" y="210" width="100" height="30" rx="4" fill="#8b5cf6"/>
                  <text x="770" y="230" textAnchor="middle" fill="white" fontSize="11">Weekly Digest</text>

                  {/* Backend - Lovable Cloud */}
                  <rect x="50" y="290" width="400" height="100" rx="8" fill="#06b6d4" opacity="0.1" stroke="#06b6d4" strokeWidth="2"/>
                  <text x="250" y="315" textAnchor="middle" className="font-bold" fill="#06b6d4">Backend - Lovable Cloud</text>
                  <rect x="70" y="335" width="110" height="40" rx="4" fill="#06b6d4"/>
                  <text x="125" y="360" textAnchor="middle" fill="white" fontSize="11">PostgreSQL + RLS</text>
                  <rect x="195" y="335" width="110" height="40" rx="4" fill="#06b6d4"/>
                  <text x="250" y="360" textAnchor="middle" fill="white" fontSize="11">Edge Functions</text>
                  <rect x="320" y="335" width="110" height="40" rx="4" fill="#06b6d4"/>
                  <text x="375" y="360" textAnchor="middle" fill="white" fontSize="11">File Storage</text>

                  {/* AI Intelligence Layer */}
                  <rect x="470" y="290" width="380" height="100" rx="8" fill="#ec4899" opacity="0.1" stroke="#ec4899" strokeWidth="2"/>
                  <text x="660" y="315" textAnchor="middle" className="font-bold" fill="#ec4899">AI Intelligence Layer</text>
                  <rect x="490" y="335" width="100" height="40" rx="4" fill="#ec4899"/>
                  <text x="540" y="360" textAnchor="middle" fill="white" fontSize="11">AI Gateway</text>
                  <rect x="605" y="335" width="100" height="40" rx="4" fill="#ec4899"/>
                  <text x="655" y="360" textAnchor="middle" fill="white" fontSize="11">RAG Engine</text>
                  <rect x="720" y="335" width="110" height="40" rx="4" fill="#ec4899"/>
                  <text x="775" y="360" textAnchor="middle" fill="white" fontSize="11">Specialized Agents</text>

                  {/* External Integrations */}
                  <rect x="50" y="420" width="800" height="80" rx="8" fill="#64748b" opacity="0.1" stroke="#64748b" strokeWidth="2"/>
                  <text x="450" y="445" textAnchor="middle" className="font-bold" fill="#64748b">External Integrations</text>
                  <rect x="120" y="455" width="120" height="35" rx="4" fill="#64748b"/>
                  <text x="180" y="478" textAnchor="middle" fill="white" fontSize="12">Jira</text>
                  <rect x="270" y="455" width="120" height="35" rx="4" fill="#64748b"/>
                  <text x="330" y="478" textAnchor="middle" fill="white" fontSize="12">Azure DevOps</text>
                  <rect x="420" y="455" width="120" height="35" rx="4" fill="#64748b"/>
                  <text x="480" y="478" textAnchor="middle" fill="white" fontSize="12">Microsoft 365</text>
                  <rect x="570" y="455" width="120" height="35" rx="4" fill="#64748b"/>
                  <text x="630" y="478" textAnchor="middle" fill="white" fontSize="12">ServiceNow</text>

                  {/* Connection arrows */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/>
                    </marker>
                  </defs>
                  <line x1="450" y1="110" x2="450" y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                  <line x1="250" y1="260" x2="250" y2="285" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="260" x2="450" y2="285" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                  <line x1="660" y1="260" x2="660" y2="285" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="390" x2="450" y2="415" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* RBAC Hierarchy Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">8-Level RBAC Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 900 500" className="w-full h-auto" style={{ minHeight: '400px' }}>
                  {/* Role boxes - pyramid structure */}
                  <rect x="375" y="20" width="150" height="45" rx="6" fill="#ef4444"/>
                  <text x="450" y="48" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">🔐 Admin</text>
                  <text x="450" y="58" textAnchor="middle" fill="white" fontSize="9">Level 8 - System Control</text>

                  <rect x="375" y="80" width="150" height="45" rx="6" fill="#f97316"/>
                  <text x="450" y="108" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">🏢 Tenant Admin</text>
                  <text x="450" y="118" textAnchor="middle" fill="white" fontSize="9">Level 7 - Governance</text>

                  <rect x="375" y="140" width="150" height="45" rx="6" fill="#eab308"/>
                  <text x="450" y="168" textAnchor="middle" fill="#000" fontSize="13" fontWeight="bold">👔 Executive</text>
                  <text x="450" y="178" textAnchor="middle" fill="#000" fontSize="9">Level 6 - Strategic View</text>

                  <rect x="375" y="200" width="150" height="45" rx="6" fill="#22c55e"/>
                  <text x="450" y="228" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">📊 PMO</text>
                  <text x="450" y="238" textAnchor="middle" fill="white" fontSize="9">Level 5 - Dept Oversight</text>

                  <rect x="375" y="260" width="150" height="45" rx="6" fill="#14b8a6"/>
                  <text x="450" y="288" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">📋 Program Manager</text>
                  <text x="450" y="298" textAnchor="middle" fill="white" fontSize="9">Level 4 - Multi-Project</text>

                  <rect x="375" y="320" width="150" height="45" rx="6" fill="#3b82f6"/>
                  <text x="450" y="348" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">👥 Senior PM</text>
                  <text x="450" y="358" textAnchor="middle" fill="white" fontSize="9">Level 3 - PM Oversight</text>

                  <rect x="375" y="380" width="150" height="45" rx="6" fill="#8b5cf6"/>
                  <text x="450" y="408" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">📌 Project Manager</text>
                  <text x="450" y="418" textAnchor="middle" fill="white" fontSize="9">Level 2 - Project Lead</text>

                  <rect x="375" y="440" width="150" height="45" rx="6" fill="#6b7280"/>
                  <text x="450" y="468" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">👤 User</text>
                  <text x="450" y="478" textAnchor="middle" fill="white" fontSize="9">Level 1 - Basic Access</text>

                  {/* Connecting lines */}
                  <line x1="450" y1="65" x2="450" y2="80" stroke="#64748b" strokeWidth="2"/>
                  <line x1="450" y1="125" x2="450" y2="140" stroke="#64748b" strokeWidth="2"/>
                  <line x1="450" y1="185" x2="450" y2="200" stroke="#64748b" strokeWidth="2"/>
                  <line x1="450" y1="245" x2="450" y2="260" stroke="#64748b" strokeWidth="2"/>
                  <line x1="450" y1="305" x2="450" y2="320" stroke="#64748b" strokeWidth="2"/>
                  <line x1="450" y1="365" x2="450" y2="380" stroke="#64748b" strokeWidth="2"/>
                  <line x1="450" y1="425" x2="450" y2="440" stroke="#64748b" strokeWidth="2"/>

                  {/* Permission groups on the right */}
                  <rect x="600" y="420" width="250" height="60" rx="6" fill="#f1f5f9" stroke="#94a3b8"/>
                  <text x="725" y="440" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">All Roles Access</text>
                  <text x="725" y="455" textAnchor="middle" fill="#64748b" fontSize="10">Dashboard • Calendar • Documents</text>
                  <text x="725" y="468" textAnchor="middle" fill="#64748b" fontSize="10">Inbox • Tasks</text>

                  <rect x="600" y="350" width="250" height="55" rx="6" fill="#f1f5f9" stroke="#8b5cf6"/>
                  <text x="725" y="370" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">PM+ Access</text>
                  <text x="725" y="385" textAnchor="middle" fill="#64748b" fontSize="10">Projects • Meetings • Stakeholders</text>
                  <text x="725" y="398" textAnchor="middle" fill="#64748b" fontSize="10">Team View</text>

                  <rect x="600" y="290" width="250" height="50" rx="6" fill="#f1f5f9" stroke="#3b82f6"/>
                  <text x="725" y="310" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">Senior PM+ Access</text>
                  <text x="725" y="328" textAnchor="middle" fill="#64748b" fontSize="10">Reports • Risk Prediction • Weekly Digest</text>

                  <rect x="600" y="230" width="250" height="50" rx="6" fill="#f1f5f9" stroke="#14b8a6"/>
                  <text x="725" y="250" textAnchor="middle" fill="#14b8a6" fontSize="11" fontWeight="bold">Program Manager+ Access</text>
                  <text x="725" y="268" textAnchor="middle" fill="#64748b" fontSize="10">Strategy • Activity • Signal Engine</text>

                  <rect x="600" y="170" width="250" height="50" rx="6" fill="#f1f5f9" stroke="#22c55e"/>
                  <text x="725" y="190" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">PMO+ Access</text>
                  <text x="725" y="208" textAnchor="middle" fill="#64748b" fontSize="10">Knowledge Base • Branding</text>

                  <rect x="600" y="80" width="250" height="80" rx="6" fill="#f1f5f9" stroke="#f97316"/>
                  <text x="725" y="100" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="bold">Tenant Admin Access</text>
                  <text x="725" y="118" textAnchor="middle" fill="#64748b" fontSize="10">Feature Toggles • AI Scope Control</text>
                  <text x="725" y="133" textAnchor="middle" fill="#64748b" fontSize="10">Tenant Settings • Governance</text>
                  <text x="725" y="148" textAnchor="middle" fill="#64748b" fontSize="10">Data Access Policies</text>

                  <rect x="600" y="20" width="250" height="50" rx="6" fill="#f1f5f9" stroke="#ef4444"/>
                  <text x="725" y="40" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Admin Only</text>
                  <text x="725" y="58" textAnchor="middle" fill="#64748b" fontSize="10">User Mgmt • Role Assignment • System Config</text>

                  {/* Connection lines to permission groups */}
                  <line x1="525" y1="462" x2="600" y2="450" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4"/>
                  <line x1="525" y1="402" x2="600" y2="377" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4"/>
                  <line x1="525" y1="342" x2="600" y2="315" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4"/>
                  <line x1="525" y1="282" x2="600" y2="255" stroke="#14b8a6" strokeWidth="1" strokeDasharray="4"/>
                  <line x1="525" y1="222" x2="600" y2="195" stroke="#22c55e" strokeWidth="1" strokeDasharray="4"/>
                  <line x1="525" y1="102" x2="600" y2="120" stroke="#f97316" strokeWidth="1" strokeDasharray="4"/>
                  <line x1="525" y1="42" x2="600" y2="45" stroke="#ef4444" strokeWidth="1" strokeDasharray="4"/>

                  {/* Note for Executive */}
                  <rect x="50" y="140" width="280" height="45" rx="6" fill="#fef3c7" stroke="#eab308"/>
                  <text x="190" y="160" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">⚠️ Executive Role Note</text>
                  <text x="190" y="175" textAnchor="middle" fill="#92400e" fontSize="9">Inbox & Tasks hidden to reduce information overload</text>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Permission Matrix Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Role</th>
                      <th className="border p-2 text-center">Dashboard</th>
                      <th className="border p-2 text-center">Inbox</th>
                      <th className="border p-2 text-center">Tasks</th>
                      <th className="border p-2 text-center">Projects</th>
                      <th className="border p-2 text-center">Reports</th>
                      <th className="border p-2 text-center">Signals</th>
                      <th className="border p-2 text-center">Strategy</th>
                      <th className="border p-2 text-center">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 font-medium bg-gray-100">User</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium bg-purple-100">Project Manager</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium bg-blue-100">Senior PM</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium bg-teal-100">Program Manager</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium bg-green-100">PMO</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium bg-yellow-100">Executive</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-gray-400">—</td>
                      <td className="border p-2 text-center text-gray-400">—</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-red-600">❌</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium bg-orange-100">Tenant Admin</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-orange-600">⚙️</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium bg-red-100">Admin</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                      <td className="border p-2 text-center text-green-600">✅</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  — Hidden for Executive role to reduce information overload | ⚙️ Limited admin access (governance only)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagrams;
