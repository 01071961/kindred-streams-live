import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Trash2,
  Star,
  Smile,
  MessageSquare,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { toast } from 'sonner';
import { playNotificationBeep } from '@/lib/notificationSound';
import { useAuth } from '@/auth';

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user?: {
    name: string;
    avatar_url: string;
    plan?: string;
  };
}

interface LiveChatAdvancedProps {
  liveId: string;
  isLive?: boolean;
  viewerCount?: number;
  className?: string;
}

// LocalStorage key for chat messages (fallback since live_chat_messages table doesn't exist)
const CHAT_STORAGE_KEY = 'live_chat_messages_storage';

function getChatStorage(liveId: string): ChatMessage[] {
  try {
    const storage = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    return storage[liveId] || [];
  } catch {
    return [];
  }
}

function saveChatMessage(liveId: string, message: ChatMessage) {
  try {
    const storage = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    if (!storage[liveId]) storage[liveId] = [];
    storage[liveId].push(message);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
}

function deleteChatMessage(liveId: string, messageId: string) {
  try {
    const storage = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    if (storage[liveId]) {
      storage[liveId] = storage[liveId].filter((m: ChatMessage) => m.id !== messageId);
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(storage));
    }
  } catch (error) {
    console.error('Error deleting chat message:', error);
  }
}

export function LiveChatAdvanced({ 
  liveId, 
  isLive = true, 
  viewerCount = 0,
  className = ''
}: LiveChatAdvancedProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userProfile, setUserProfile] = useState<{ plan?: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context for notifications
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Load user profile from localStorage (fallback)
  useEffect(() => {
    if (!user) return;
    // Use a default plan since we can't fetch from profiles table
    setUserProfile({ plan: 'user' });
  }, [user]);

  // Fetch initial messages from localStorage
  useEffect(() => {
    const storedMessages = getChatStorage(liveId);
    setMessages(storedMessages);
  }, [liveId]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      content: newMessage.trim(),
      user_id: user.id,
      created_at: new Date().toISOString(),
      user: {
        name: user.email?.split('@')[0] || 'Usuário',
        avatar_url: '',
        plan: userProfile?.plan,
      },
    };

    // Save to localStorage
    saveChatMessage(liveId, newMsg);
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setIsEmojiPickerOpen(false);
    setSending(false);
  };

  const addEmoji = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  const handleDeleteMessage = async (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    const isOwnMessage = msg?.user_id === user?.id;

    if (!isOwnMessage) {
      toast.error('Sem permissão para apagar esta mensagem');
      return;
    }

    deleteChatMessage(liveId, msgId);
    setMessages(prev => prev.filter(m => m.id !== msgId));
    toast.success('Mensagem apagada');
  };

  const isVIP = (plan?: string) => {
    return plan === 'vip' || plan === 'premium' || plan === 'admin';
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col bg-card ${className}`}>
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
            title={soundEnabled ? 'Desativar som' : 'Ativar som'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => {
              const msgIsVIP = isVIP(msg.user?.plan);
              const isOwn = msg.user_id === user?.id;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex gap-2 p-2 rounded-lg transition-colors group ${
                    msgIsVIP 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={msg.user?.avatar_url} />
                    <AvatarFallback className={msgIsVIP ? 'bg-primary text-primary-foreground' : ''}>
                      {msg.user?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium truncate ${
                        msgIsVIP ? 'text-primary' : 'text-foreground'
                      }`}>
                        {msg.user?.name || 'Anônimo'}
                      </span>
                      
                      {msgIsVIP && (
                        <Badge variant="default" className="h-5 gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-white">
                          <Star className="h-3 w-3 fill-current" />
                          VIP
                        </Badge>
                      )}
                      
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.created_at)}
                      </span>
                      
                      {/* Delete button - visible on hover for own messages */}
                      {user && isOwn && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                          onClick={() => handleDeleteMessage(msg.id)}
                          title="Apagar mensagem"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-sm break-words mt-0.5">{msg.content}</p>
                  </div>
                </motion.div>
              );
            })}
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

      {/* Input Area */}
      {isLive ? (
        <div className="p-4 border-t">
          {user ? (
            <div className="flex gap-2">
              <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Smile className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" side="top" align="start">
                  <EmojiPicker
                    onEmojiClick={addEmoji}
                    theme={Theme.AUTO}
                    lazyLoadEmojis
                    searchPlaceholder="Buscar emoji..."
                    width={300}
                    height={400}
                  />
                </PopoverContent>
              </Popover>
              
              <Input
                placeholder="Enviar mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                disabled={sending}
                className="flex-1"
              />
              
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || sending}
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-2 text-muted-foreground">
              <p className="text-sm">Faça login para participar do chat</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border-t text-center text-muted-foreground">
          <p className="text-sm">Chat encerrado - esta live foi finalizada</p>
        </div>
      )}
    </div>
  );
}
