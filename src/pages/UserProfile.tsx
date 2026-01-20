import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, Settings, History, Heart, Users, MessageSquare, 
  Video, BarChart3, Edit, Camera, Bell, Lock, LogOut,
  ChevronRight, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  date_of_birth: string | null;
}

const UserProfile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
      setFormData({
        display_name: data.display_name || "",
        bio: data.bio || "",
      });
    }
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: formData.display_name,
        bio: formData.bio,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Perfil atualizado!" });
      setEditing(false);
      fetchProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl">
                    {profile?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                {editing ? (
                  <div className="space-y-4">
                    <Input
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      placeholder="Nome de exibição"
                    />
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Sua bio..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button variant="gradient" onClick={handleUpdateProfile}>
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{profile?.display_name || profile?.username}</h1>
                    <p className="text-muted-foreground">@{profile?.username}</p>
                    <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                    {profile?.bio && <p className="mt-3 text-foreground">{profile.bio}</p>}
                    <Button variant="outline" className="mt-4" onClick={() => setEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList className="w-full justify-start bg-card border border-border p-1">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configurações</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
              <TabsTrigger value="streamer" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Streamer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <div className="bg-card border border-border rounded-2xl divide-y divide-border">
                <SettingItem icon={Lock} title="Alterar senha" description="Atualize sua senha de acesso" />
                <SettingItem icon={Bell} title="Notificações" description="Configure suas preferências" />
                <SettingItem icon={Users} title="Privacidade" description="Gerencie quem pode ver seu perfil" />
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-destructive"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Sair</p>
                      <p className="text-sm text-muted-foreground">Encerrar sessão</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="space-y-6">
                  <HistorySection icon={History} title="Lives assistidas" count={0} />
                  <HistorySection icon={Heart} title="Lives curtidas" count={0} />
                  <HistorySection icon={Users} title="Criadores seguidos" count={0} />
                  <HistorySection icon={MessageSquare} title="Comentários feitos" count={0} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="streamer">
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Torne-se um Streamer</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Comece a fazer lives e conecte-se com seu público. Configure seu perfil de streamer para começar.
                </p>
                <Link to="/streamer/setup">
                  <Button variant="gradient">
                    <Play className="w-4 h-4 mr-2" />
                    Configurar Perfil de Streamer
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const SettingItem = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="text-left">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-muted-foreground" />
  </button>
);

const HistorySection = ({ icon: Icon, title, count }: { icon: any; title: string; count: number }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <span className="font-medium">{title}</span>
    </div>
    <span className="text-muted-foreground">{count}</span>
  </div>
);

export default UserProfile;
