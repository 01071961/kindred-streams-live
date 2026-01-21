import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Notification sound as data URL (short beep)
const NOTIFICATION_SOUND = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQsNjOvk4LY=";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userName, setUserName] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND);
    audioRef.current.volume = 0.5;
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && isFormSubmitted && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isFormSubmitted]);

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("Por favor, informe seu nome");
      return;
    }
    
    setIsFormSubmitted(true);
    
    // Add welcome message
    const welcomeMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: `Olá ${userName}! 👋 Bem-vindo ao nosso chat. Como posso ajudar você hoje?`,
      created_at: new Date().toISOString(),
    };
    
    setMessages([welcomeMsg]);
  };

  // Handle sending messages
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmedInput,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot response (replace with actual API call if needed)
    setTimeout(() => {
      const botMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: getSimulatedResponse(trimmedInput),
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      playNotificationSound();
    }, 1000 + Math.random() * 1000);
  };

  // Simulated responses
  const getSimulatedResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes("olá") || lowercaseInput.includes("oi") || lowercaseInput.includes("hey")) {
      return `Olá! É um prazer conversar com você, ${userName}! 😊 Como posso ajudar?`;
    }
    
    if (lowercaseInput.includes("live") || lowercaseInput.includes("stream")) {
      return "Temos várias lives acontecendo agora! Você pode explorar a página principal para ver os streamers ao vivo. Quer saber sobre alguma categoria específica?";
    }
    
    if (lowercaseInput.includes("ajuda") || lowercaseInput.includes("help")) {
      return "Estou aqui para ajudar! Posso te auxiliar com:\n\n• Informações sobre lives\n• Como seguir streamers\n• Dúvidas sobre a plataforma\n• Problemas técnicos\n\nSobre o que você gostaria de saber?";
    }
    
    if (lowercaseInput.includes("obrigad")) {
      return "De nada! Fico feliz em ajudar. Se tiver mais alguma dúvida, é só perguntar! 😊";
    }
    
    return "Entendi! Deixa eu verificar isso para você. Enquanto isso, posso ajudar com algo mais específico? Estou aqui para te ajudar! 🚀";
  };

  // Handle close chat
  const handleClose = () => {
    setIsOpen(false);
  };

  // Reset chat
  const handleReset = () => {
    setMessages([]);
    setUserName("");
    setIsFormSubmitted(false);
  };

  return (
    <>
      {/* Chat toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="h-8 w-8 rounded-full bg-white p-1" />
                <div>
                  <h3 className="font-semibold text-primary-foreground">Suporte</h3>
                  <p className="text-xs text-primary-foreground/70">Online agora</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {!isFormSubmitted ? (
                // Pre-chat form
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold">Olá! 👋</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Por favor, informe seu nome para iniciar o chat.
                    </p>
                  </div>
                  <form onSubmit={handleFormSubmit} className="w-full space-y-4">
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full"
                      autoFocus
                    />
                    <Button type="submit" className="w-full">
                      Iniciar Chat
                    </Button>
                  </form>
                </div>
              ) : (
                // Chat messages
                <>
                  <ScrollArea ref={scrollRef} className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-[10px] opacity-60 mt-1">
                              {new Date(message.created_at).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <form onSubmit={handleSend} className="p-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="shrink-0"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;
