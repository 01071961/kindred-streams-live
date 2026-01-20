import { memo } from "react";
import { Bot, User, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

interface ChatMessageProps {
  id?: string;
  conversationId?: string;
  role: "user" | "assistant" | "admin" | "system";
  content: string;
  timestamp?: string;
  isAiResponse?: boolean;
  showFeedback?: boolean;
}

export const ChatMessage = memo(({
  role,
  content,
  timestamp,
  isAiResponse,
}: ChatMessageProps) => {
  const isUser = role === "user";
  const isAdmin = role === "admin";
  const isSystem = role === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center my-4"
      >
        <span className="text-xs text-muted-foreground bg-muted/40 px-5 py-2 rounded-full">
          {content}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar for non-user messages */}
      {!isUser && (
        <div className="relative flex-shrink-0">
          <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
            isAdmin 
              ? "bg-green-500/20 border border-green-400/30" 
              : "bg-primary/20 border border-primary/30"
          }`}>
            {isAdmin ? (
              <UserCheck className="h-4 w-4 text-green-400" />
            ) : (
              <Bot className="h-4 w-4 text-primary" />
            )}
          </div>
        </div>
      )}
      
      {/* Message bubble */}
      <div
        className={`relative max-w-[80%] px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
            : isAdmin
            ? "bg-green-500/10 border border-green-400/20 rounded-2xl rounded-bl-sm"
            : "bg-muted rounded-2xl rounded-bl-sm"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        
        {timestamp && (
          <div className={`text-[11px] mt-2 ${isUser ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            {format(new Date(timestamp), "HH:mm", { locale: ptBR })}
            {isAiResponse && " • IA"}
            {isAdmin && " • Admin"}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";