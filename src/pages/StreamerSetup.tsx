import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Instagram, Twitter, Youtube, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { externalSupabase as supabase } from "@/integrations/supabase/externalClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const StreamerSetup = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasStreamerProfile, setHasStreamerProfile] = useState(false);
  const [formData, setFormData] = useState({
    stream_title: "",
    stream_category: "",
    rules: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkStreamerProfile();
    }
  }, [user]);

  const checkStreamerProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("streamers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setHasStreamerProfile(true);
      const socialLinks = (data.social_links as Record<string, string>) || {};
      setFormData({
        stream_title: data.stream_title || "",
        stream_category: data.stream_category || "",
        rules: data.rules || "",
        instagram: socialLinks.instagram || "",
        twitter: socialLinks.twitter || "",
        youtube: socialLinks.youtube || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const streamerData = {
      user_id: user.id,
      stream_title: formData.stream_title,
      stream_category: formData.stream_category,
      rules: formData.rules,
      social_links: {
        instagram: formData.instagram,
        twitter: formData.twitter,
        youtube: formData.youtube,
      },
    };

    let error;

    if (hasStreamerProfile) {
      const result = await supabase
        .from("streamers")
        .update(streamerData)
        .eq("user_id", user.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("streamers")
        .insert(streamerData);
      error = result.error;

      // Also add streamer role
      if (!error) {
        await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: "streamer" });
      }
    }

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Perfil de streamer salvo!" });
      
      // Get username to redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        navigate(`/streamer/${profile.username}`);
      }
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Video className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {hasStreamerProfile ? "Editar Perfil de Streamer" : "Configurar Perfil de Streamer"}
                </h1>
                <p className="text-muted-foreground">
                  Preencha as informações para começar a transmitir
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stream_title">Título padrão da live</Label>
                <Input
                  id="stream_title"
                  value={formData.stream_title}
                  onChange={(e) => setFormData({ ...formData, stream_title: e.target.value })}
                  placeholder="Ex: Live de jogos com a galera!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream_category">Categoria principal</Label>
                <Input
                  id="stream_category"
                  value={formData.stream_category}
                  onChange={(e) => setFormData({ ...formData, stream_category: e.target.value })}
                  placeholder="Ex: Games, Música, Conversa..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Regras do chat</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="Ex: Seja respeitoso, sem spam..."
                  rows={4}
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-bold mb-4">Redes Sociais</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-muted-foreground" />
                    <Input
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="Link do Instagram"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-muted-foreground" />
                    <Input
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="Link do Twitter/X"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Youtube className="w-5 h-5 text-muted-foreground" />
                    <Input
                      value={formData.youtube}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      placeholder="Link do YouTube"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Salvando..." : "Salvar Perfil"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StreamerSetup;
