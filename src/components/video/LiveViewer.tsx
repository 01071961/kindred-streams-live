import { useState } from 'react';
import { Radio, Heart, Share2, Users, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LiveChatAdvanced } from './LiveChatAdvanced';

interface LiveViewerProps {
  liveId: string;
}

export function LiveViewer({ liveId }: LiveViewerProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [likesCount, setLikesCount] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Live', url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-3 gap-0">
          {/* Video Area */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <p className="text-white">Stream ID: {liveId}</p>

              {/* Live Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant="destructive" className="animate-pulse gap-1">
                  <Radio className="h-3 w-3" />
                  AO VIVO
                </Badge>
              </div>

              {/* Viewer Count */}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  0
                </Badge>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-xl font-bold mb-2">Live Stream</h1>
                  <p className="text-muted-foreground">Transmitindo agora</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isLiked ? 'default' : 'outline'}
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {likesCount}
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className={`lg:block ${isChatOpen ? 'block' : 'hidden'} lg:border-l`}>
            <LiveChatAdvanced
              liveId={liveId}
              isLive={true}
              viewerCount={0}
              className="h-[600px] lg:h-screen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
