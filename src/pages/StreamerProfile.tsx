import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Users, Heart, Video, Play, Share2, Bell, 
  ExternalLink, Instagram, Twitter, Youtube,
  MessageSquare, Eye, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface StreamerData {
  id: string;
  user_id: string;
  stream_title: string | null;
  stream_category: string | null;
  is_live: boolean;
  viewer_count: number;
  follower_count: number;
  total_likes: number;
  social_links: Record<string, string>;
  rules: string | null;
  profile: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  } | null;
}

const StreamerProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [streamer, setStreamer] = useState<StreamerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (username) {
      fetchStreamer();
    }
  }, [username]);

  useEffect(() => {
    if (user && streamer) {
      checkFollowStatus();
    }
  }, [user, streamer]);

  const fetchStreamer = async () => {
    // First get the profile by username
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url, bio")
      .eq("username", username)
      .maybeSingle();

    if (profileError || !profileData) {
      setLoading(false);
      return;
    }

    // Then get the streamer data
    const { data: streamerData, error: streamerError } = await supabase
      .from("streamers")
      .select("*")
      .eq("user_id", profileData.user_id)
      .maybeSingle();

    if (streamerError) {
      console.error("Error fetching streamer:", streamerError);
    }

    if (streamerData) {
      setStreamer({
        ...streamerData,
        social_links: (streamerData.social_links as Record<string, string>) || {},
        profile: profileData,
      });
    } else {
      // User exists but is not a streamer - show basic profile
      setStreamer({
        id: "",
        user_id: profileData.user_id,
        stream_title: null,
        stream_category: null,
        is_live: false,
        viewer_count: 0,
        follower_count: 0,
        total_likes: 0,
        social_links: {},
        rules: null,
        profile: profileData,
      });
    }
    
    setLoading(false);
  };

  const checkFollowStatus = async () => {
    if (!user || !streamer) return;

    const { data } = await supabase
      .from("followers")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", streamer.user_id)
      .maybeSingle();

    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Entre para seguir",
        description: "Faça login para seguir este streamer",
        variant: "destructive",
      });
      return;
    }

    if (!streamer) return;

    if (isFollowing) {
      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", streamer.user_id);
      setIsFollowing(false);
      toast({ title: "Deixou de seguir" });
    } else {
      await supabase
        .from("followers")
        .insert({ follower_id: user.id, following_id: streamer.user_id });
      setIsFollowing(true);
      toast({ title: "Seguindo!" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!streamer || !streamer.profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Streamer não encontrado</h1>
            <p className="text-muted-foreground mb-6">O usuário @{username} não existe ou não é um streamer.</p>
            <Link to="/">
              <Button variant="gradient">Voltar ao início</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const profile = streamer.profile;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Live Banner / Cover */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30">
          {streamer.is_live ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Badge className="bg-destructive text-destructive-foreground mb-4 animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  AO VIVO
                </Badge>
                <h2 className="text-2xl font-bold mb-2">{streamer.stream_title || "Live em andamento"}</h2>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {streamer.viewer_count} assistindo
                  </span>
                  <span>{streamer.stream_category}</span>
                </div>
                <Button variant="glow" className="mt-4">
                  <Play className="w-4 h-4 mr-2" />
                  Assistir Live
                </Button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Este streamer não está ao vivo no momento</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-4xl">
                  {profile.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{profile.display_name || profile.username}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
                
                <div className="flex items-center justify-center md:justify-start gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{streamer.follower_count}</p>
                    <p className="text-sm text-muted-foreground">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{streamer.total_likes}</p>
                    <p className="text-sm text-muted-foreground">Curtidas</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant={isFollowing ? "outline" : "gradient"} 
                  onClick={handleFollow}
                >
                  {isFollowing ? (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Seguindo
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Seguir
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="about" className="pb-16">
            <TabsList className="w-full justify-start bg-card border border-border p-1 mb-6">
              <TabsTrigger value="about">Sobre</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
              <TabsTrigger value="replays">Replays</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Bio</h3>
                  <p className="text-muted-foreground">
                    {profile.bio || "Nenhuma bio adicionada."}
                  </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Redes Sociais</h3>
                  <div className="space-y-3">
                    {streamer.social_links?.instagram && (
                      <SocialLink icon={Instagram} label="Instagram" url={streamer.social_links.instagram} />
                    )}
                    {streamer.social_links?.twitter && (
                      <SocialLink icon={Twitter} label="Twitter" url={streamer.social_links.twitter} />
                    )}
                    {streamer.social_links?.youtube && (
                      <SocialLink icon={Youtube} label="YouTube" url={streamer.social_links.youtube} />
                    )}
                    {Object.keys(streamer.social_links || {}).length === 0 && (
                      <p className="text-muted-foreground">Nenhuma rede social adicionada.</p>
                    )}
                  </div>
                </div>

                {streamer.rules && (
                  <div className="bg-card border border-border rounded-2xl p-6 md:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Regras do Chat</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{streamer.rules}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Nenhum vídeo publicado ainda.</p>
              </div>
            </TabsContent>

            <TabsContent value="replays">
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Nenhum replay disponível.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const SocialLink = ({ icon: Icon, label, url }: { icon: any; label: string; url: string }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
    <ExternalLink className="w-4 h-4 ml-auto" />
  </a>
);

export default StreamerProfile;
