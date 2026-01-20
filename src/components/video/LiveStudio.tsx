import { useState, useRef, useEffect } from 'react';
import { Radio, Video, VideoOff, Mic, MicOff, Eye, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/auth';
import { LiveChatAdvanced } from './LiveChatAdvanced';

export function LiveStudio() {
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [liveId] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (videoEnabled || audioEnabled) {
      startPreview();
    }
    return () => stopPreview();
  }, [videoEnabled, audioEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => setDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing media:', error);
      toast.error('Erro ao acessar câmera/microfone');
    }
  };

  const stopPreview = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  const startLive = async () => {
    if (!user || !title.trim()) {
      toast.error('Digite um título para a live');
      return;
    }

    setIsStarting(true);
    
    // Simulated - full implementation requires videos table
    setTimeout(() => {
      setIsLive(true);
      setIsStarting(false);
      setDuration(0);
      toast.success('Live iniciada!');
    }, 1000);
  };

  const endLive = async () => {
    setIsLive(false);
    toast.success('Live encerrada!');
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {isLive && (
                  <div className="absolute top-4 left-4 flex items-center gap-3">
                    <Badge variant="destructive" className="animate-pulse gap-1">
                      <Radio className="h-3 w-3" />
                      AO VIVO
                    </Badge>
                    <Badge variant="secondary">{formatDuration(duration)}</Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Eye className="h-3 w-3" />
                      0
                    </Badge>
                  </div>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <Button
                    size="icon"
                    variant={videoEnabled ? 'secondary' : 'destructive'}
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant={audioEnabled ? 'secondary' : 'destructive'}
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>

            {!isLive ? (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Título da Live *</Label>
                    <Input
                      placeholder="Ex: Live de perguntas e respostas"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder="Sobre o que é essa live?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Privacidade</Label>
                    <Select value={privacy} onValueChange={setPrivacy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público</SelectItem>
                        <SelectItem value="unlisted">Não listado</SelectItem>
                        <SelectItem value="private">Privado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={startLive}
                    disabled={isStarting || !title.trim()}
                  >
                    {isStarting ? (
                      <>Iniciando...</>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Iniciar Live
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-full"
                    onClick={endLive}
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Encerrar Live
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat */}
          <div className="lg:block">
            <LiveChatAdvanced
              liveId={liveId || 'preview'}
              isLive={isLive}
              viewerCount={0}
              className="h-[600px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}