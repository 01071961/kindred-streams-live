import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShortsFeedProps {
  className?: string;
}

export function ShortsFeed({ className }: ShortsFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Placeholder data - full implementation requires videos table
  const shorts = [
    { id: '1', title: 'Short 1', likes: 100 },
    { id: '2', title: 'Short 2', likes: 250 },
    { id: '3', title: 'Short 3', likes: 50 },
  ];

  const handleScroll = (direction: 'up' | 'down') => {
    const newIndex = direction === 'down' 
      ? Math.min(currentIndex + 1, shorts.length - 1)
      : Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Short', url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    }
  };

  return (
    <div className={cn('relative h-screen bg-black overflow-hidden', className)}>
      {/* Navigation Arrows */}
      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 flex-col gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white"
          onClick={() => handleScroll('up')}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white"
          onClick={() => handleScroll('down')}
          disabled={currentIndex === shorts.length - 1}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>

      {/* Shorts Container */}
      <motion.div
        className="h-full"
        animate={{ y: -currentIndex * 100 + '%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {shorts.map((short, index) => (
          <div
            key={short.id}
            className="relative h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black"
          >
            {/* Placeholder */}
            <div className="text-white text-center">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{short.title}</p>
              <p className="text-sm text-gray-400">Shorts em desenvolvimento</p>
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs mt-1">{short.likes}</span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs mt-1">0</span>
              </button>

              <button onClick={handleShare} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
              </button>

              <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  {isMuted ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
                </div>
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {shorts.map((_, i) => (
                <div
                  key={i}
                  className={cn('h-1 flex-1 rounded-full', i === currentIndex ? 'bg-white' : 'bg-white/30')}
                />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
