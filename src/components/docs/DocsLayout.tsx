import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

interface DocsLayoutProps {
  children: React.ReactNode;
  currentPage: number;
  totalPages: number;
  title: string;
  prevPath: string | null;
  nextPath: string | null;
}

const DocsLayout = ({ children, currentPage, totalPages, title, prevPath, nextPath }: DocsLayoutProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('document-content');
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
      
      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Nexus-Project-OS-${title.replace(/\s+/g, '-')}.pdf`);
      toast({
        title: 'PDF Exported',
        description: 'Document page has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/docs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cover
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button onClick={handleExportPDF} disabled={isExporting} size="sm">
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div
          id="document-content"
          className="bg-white text-slate-900 p-12 rounded-lg shadow-lg prose prose-slate max-w-none"
        >
          {/* Title */}
          <div className="text-center mb-12 pb-8 border-b-2 border-indigo-500">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Nexus Project OS</h1>
            <p className="text-xl text-indigo-600 font-medium">{title}</p>
          </div>

          {children}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {prevPath ? (
            <Button variant="outline" onClick={() => navigate(prevPath)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          ) : (
            <div />
          )}
          
          {nextPath ? (
            <Button onClick={() => navigate(nextPath)}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/docs')}>
              Back to Cover
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsLayout;
