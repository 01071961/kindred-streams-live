import { useState, useEffect } from 'react';
import {
  Radio,
  Heart,
  Share2,
  Users,
  User,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/auth';
import { VideoPlayer } from './VideoPlayer';
import { LiveChatAdvanced } from './LiveChatAdvanced';

interface LiveData {
  id: string;
  title: string;
  description: string;
  storage_url: string;
  status: string;
  views_count: number;
  likes_count: number;
  live_started_at: string;
  user?: {
    name: string;
    avatar_url: string;
  };
}

interface LiveViewerProps {
  liveId: string;
}

// LocalStorage keys (fallback since video tables don't exist)
const LIKES_KEY = 'video_likes_storage';
const VIEWS_KEY = 'video_views_storage';
const LIVES_KEY = 'live_videos_storage';

function getLivesStorage(): Record<string, LiveData> {
  try {
    return JSON.parse(localStorage.getItem(LIVES_KEY) || '{}');
  } catch {
    return {};
  }
}

function getLikesStorage(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLike(videoId: string, userId: string) {
  const storage = getLikesStorage();
  if (!storage[videoId]) storage[videoId] = [];
  if (!storage[videoId].includes(userId)) {
    storage[videoId].push(userId);
  }
  localStorage.setItem(LIKES_KEY, JSON.stringify(storage));
}

function removeLike(videoId: string, userId: string) {
  const storage = getLikesStorage();
  if (storage[videoId]) {
    storage[videoId] = storage[videoId].filter(id => id !== userId);
    localStorage.setItem(LIKES_KEY, JSON.stringify(storage));
  }
}

function isLiked(videoId: string, userId: string): boolean {
  const storage = getLikesStorage();
  return storage[videoId]?.includes(userId) || false;
}

function getLikesCount(videoId: string): number {
  const storage = getLikesStorage();
  return storage[videoId]?.length || 0;
}

export function LiveViewer({ liveId }: LiveViewerProps) {
  const { user } = useAuth();
  const [live, setLive] = useState<LiveData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    fetchLive();
  }, [liveId]);

  const fetchLive = async () => {
    try {
      // Try to get from localStorage (mock data)
      const storedLives = getLivesStorage();
      const storedLive = storedLives[liveId];
      
      if (storedLive) {
        setLive(storedLive);
        setLikesCount(getLikesCount(liveId));
        if (user) {
          setHasLiked(isLiked(liveId, user.id));
        }
      } else {
        // Create mock live data
        const mockLive: LiveData = {
          id: liveId,
          title: 'Live Demo',
          description: 'Esta é uma demonstração de live streaming',
          storage_url: '',
          status: 'live',
          views_count: 0,
          likes_count: 0,
          live_started_at: new Date().toISOString(),
          user: {
            name: 'Streamer',
            avatar_url: '',
          },
        };
        setLive(mockLive);
      }
    } catch (error) {
      console.error('Error fetching live:', error);
      toast.error('Live não encontrada');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Faça login para curtir');
      return;
    }

    try {
      if (hasLiked) {
        removeLike(liveId, user.id);
        setLikesCount(prev => prev - 1);
      } else {
        saveLike(liveId, user.id);
        setLikesCount(prev => prev + 1);
      }
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: live?.title,
          url,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    }
  };

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    
    const hrs = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    
    if (hrs > 0) return `${hrs}h ${mins}min`;
    return `${mins}min`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!live) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-8 text-center">
        <p className="text-xl mb-4">Live não encontrada</p>
        <Button onClick={() => window.history.back()}>Voltar</Button>
      </div>
    );
  }

  const isLiveNow = live.status === 'live';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-3 gap-0">
          {/* Video Area */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black">
              {isLiveNow && live.storage_url ? (
                <video
                  src={live.storage_url}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : live.storage_url ? (
                <VideoPlayer src={live.storage_url} title={live.title} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white">Stream não disponível</p>
                </div>
              )}

              {/* Live Badge */}
              {isLiveNow && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge variant="destructive" className="animate-pulse gap-1">
                    <Radio className="h-3 w-3" />
                    AO VIVO
                  </Badge>
                  <Badge variant="secondary">
                    {formatDuration(live.live_started_at)}
                  </Badge>
                </div>
              )}

              {/* Viewer Count */}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {live.views_count}
                </Badge>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-xl font-bold mb-2">{live.title}</h1>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={live.user?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{live.user?.name || 'Usuário'}</p>
                      <p className="text-sm text-muted-foreground">
                        {isLiveNow ? 'Transmitindo agora' : 'Gravação'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={hasLiked ? 'default' : 'outline'}
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
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

              {live.description && (
                <p className="text-muted-foreground">{live.description}</p>
              )}
            </div>
          </div>

          {/* Chat Sidebar - Using Advanced Chat Component */}
          <div className={`lg:block ${isChatOpen ? 'block' : 'hidden'} lg:border-l`}>
            <LiveChatAdvanced
              liveId={liveId}
              isLive={isLiveNow}
              viewerCount={viewerCount}
              className="h-[600px] lg:h-screen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
