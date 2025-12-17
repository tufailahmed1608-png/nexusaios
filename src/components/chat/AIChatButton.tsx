import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AIChat from './AIChat';
import { useLanguage } from '@/hooks/useLanguage';

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isRTL } = useLanguage();

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-20 z-50 w-[380px] h-[500px] transition-all duration-300 ease-in-out',
          isRTL ? 'left-4' : 'right-4',
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <AIChat onClose={() => setIsOpen(false)} />
      </div>

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-200',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          isRTL ? 'left-4' : 'right-4'
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </>
  );
};

export default AIChatButton;
