import { useState, useRef } from 'react';
import { Upload, Video, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

type VideoType = 'video' | 'short';

interface VideoUploaderProps {
  type?: VideoType;
  onUploadComplete?: (video: { id: string; url: string; thumbnailUrl: string }) => void;
  trigger?: React.ReactNode;
  maxSizeMB?: number;
}

export function VideoUploader({ 
  type = 'video',
  onUploadComplete, 
  trigger,
  maxSizeMB = 500 
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    // Simulate upload - full implementation requires videos table
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      setIsUploading(false);
      setProgress(100);
      setIsOpen(false);
      toast.success('Vídeo enviado! (demonstração)');
      onUploadComplete?.({ 
        id: crypto.randomUUID(), 
        url: 'simulated-url', 
        thumbnailUrl: '' 
      });
    }, 2500);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleUpload}
        className="hidden"
      />
      
      {trigger ? (
        <div onClick={() => inputRef.current?.click()}>
          {trigger}
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <Progress value={progress} className="max-w-xs mx-auto" />
              <p className="text-sm text-muted-foreground">Enviando... {progress}%</p>
            </div>
          ) : (
            <>
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">Arraste ou clique para enviar</p>
              <p className="text-sm text-muted-foreground">Máximo {maxSizeMB}MB</p>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default VideoUploader;