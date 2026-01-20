import { Button } from "./ui/button";
import { UserPlus, CheckCircle } from "lucide-react";

const streamers = [
  { name: "@top_streamer", followers: "2.5M", avatar: "", verified: true },
  { name: "@queen_games", followers: "1.8M", avatar: "", verified: true },
  { name: "@arte_brasil", followers: "980K", avatar: "", verified: true },
  { name: "@music_live", followers: "1.2M", avatar: "", verified: true },
  { name: "@chef_master", followers: "750K", avatar: "", verified: false },
  { name: "@fitness_pro", followers: "620K", avatar: "", verified: true },
];

const FeaturedStreamers = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Criadores em <span className="gradient-text">alta</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Siga os melhores criadores e nunca perca uma live
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {streamers.map((streamer, index) => (
            <div 
              key={streamer.name}
              className="group bg-card rounded-2xl p-4 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Avatar */}
              <div className="relative mx-auto w-20 h-20 mb-4">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-0.5">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
                {streamer.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="font-semibold text-sm truncate">{streamer.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{streamer.followers} seguidores</p>

              {/* Follow Button */}
              <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                <UserPlus className="w-4 h-4 mr-1" />
                Seguir
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStreamers;
