import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

// Simplified SocialFeed - requires additional database tables
export function SocialFeed() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold mb-2">Feed Social</h3>
        <p className="text-sm text-muted-foreground">
          Este recurso requer configuração adicional do banco de dados.
        </p>
      </CardContent>
    </Card>
  );
}

export default SocialFeed;