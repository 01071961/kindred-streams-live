import { Users, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface LiveCardProps {
  streamer: string;
  title: string;
  category: string;
  viewers: string;
  avatar: string;
  thumbnail: string;
  isLive?: boolean;
}

const LiveCard = ({ streamer, title, category, viewers, avatar, thumbnail, isLive = true }: LiveCardProps) => {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10">
      {/* Thumbnail */}
      <div className="relative aspect-[9/12] overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40"
          style={{ 
            backgroundImage: `url(${thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="px-2 py-1 bg-destructive rounded-md text-xs font-bold flex items-center gap-1 shadow-lg">
              <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full live-pulse" />
              LIVE
            </div>
          </div>
        )}

        {/* Viewers */}
        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 bg-background/70 backdrop-blur-sm rounded-md text-xs flex items-center gap-1">
            <Users className="w-3 h-3" />
            {viewers}
          </div>
        </div>

        {/* Like Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute bottom-16 right-3 w-10 h-10 bg-background/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
        >
          <Heart className="w-5 h-5" />
        </Button>

        {/* Streamer Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-primary flex-shrink-0"
              style={{
                backgroundImage: `url(${avatar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{streamer}</div>
              <div className="text-xs text-muted-foreground truncate">{title}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tag */}
      <div className="p-3 pt-0">
        <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
          {category}
        </span>
      </div>
    </div>
  );
};

export default LiveCard;
