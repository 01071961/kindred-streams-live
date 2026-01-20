import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface TranscriptRendererProps {
  productId?: string;
  showDownload?: boolean;
}

// Simplified TranscriptRenderer - requires database tables to be set up
export function TranscriptRenderer({ productId, showDownload = true }: TranscriptRendererProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold mb-2">Histórico Escolar</h3>
        <p className="text-sm text-muted-foreground">
          Este recurso requer configuração adicional do banco de dados.
        </p>
      </CardContent>
    </Card>
  );
}

export default TranscriptRenderer;
