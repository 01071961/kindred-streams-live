import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Users, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  content: string;
  user: string;
  created_at: string;
}

interface LiveChatAdvancedProps {
  liveId: string;
  isLive?: boolean;
  viewerCount?: number;
  className?: string;
}

export function LiveChatAdvanced({ 
  liveId, 
  isLive = true, 
  viewerCount = 0,
  className = ''
}: LiveChatAdvancedProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      content: newMessage.trim(),
      user: 'Você',
      created_at: new Date().toISOString(),
    }]);
    setNewMessage('');
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col bg-card rounded-lg border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Chat ao Vivo
        </h2>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {viewerCount}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 h-[300px]">
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 p-2 rounded-lg hover:bg-muted/50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{msg.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{msg.user}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(msg.created_at)}</span>
                  </div>
                  <p className="text-sm break-words">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm">Seja o primeiro a comentar!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      {isLive && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Enviar mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveChatAdvanced;
