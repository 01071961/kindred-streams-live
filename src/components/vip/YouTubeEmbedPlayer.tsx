interface YouTubeEmbedPlayerProps {
  videoUrl: string;
  title?: string;
  description?: string;
  postId?: string;
  authorName?: string;
  authorAvatar?: string;
  createdAt?: string;
  viewCount?: number;
  likeCount?: number;
  onLike?: () => void;
  isLiked?: boolean;
  showComments?: boolean;
}

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/,
    /youtube\.com\/shorts\/([^&?\/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function YouTubeEmbedPlayer({ 
  videoUrl, 
  title = 'YouTube video',
  description,
  authorName,
  viewCount = 0,
  likeCount = 0,
}: YouTubeEmbedPlayerProps) {
  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">URL de vídeo inválida</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
      
      {title && (
        <div>
          <h3 className="font-semibold">{title}</h3>
          {authorName && <p className="text-sm text-muted-foreground">por {authorName}</p>}
          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
            <span>{viewCount} visualizações</span>
            <span>{likeCount} curtidas</span>
          </div>
        </div>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export default YouTubeEmbedPlayer;