import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface StartLiveCardProps {
  affiliateId: string | null;
  userName?: string;
  onLiveStarted?: (liveData: { url: string; title: string }) => void;
  onLiveEnded?: () => void;
}

// Simplified StartLiveCard
export function StartLiveCard({ affiliateId, userName, onLiveStarted, onLiveEnded }: StartLiveCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Iniciar Live
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Comece uma transmissão ao vivo para seus seguidores
        </p>
        <Button onClick={() => navigate('/studio')} className="w-full">
          <Video className="h-4 w-4 mr-2" />
          Ir para o Estúdio
        </Button>
      </CardContent>
    </Card>
  );
}

export default StartLiveCard;