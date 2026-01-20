import { Play, Users, Zap } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full border border-border">
              <span className="w-2 h-2 bg-destructive rounded-full live-pulse" />
              <span className="text-sm text-muted-foreground">+50K lives acontecendo agora</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Sua <span className="gradient-text">plataforma</span> de lives favorita
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Assista, interaja e conecte-se com milhões de criadores ao redor do mundo em tempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="gradient" size="xl" className="gap-3">
                <Play className="w-5 h-5" />
                Começar a Assistir
              </Button>
              <Button variant="outline" size="xl" className="gap-3">
                <Zap className="w-5 h-5" />
                Criar Conta
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">10M+</div>
                <div className="text-sm text-muted-foreground">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">500K+</div>
                <div className="text-sm text-muted-foreground">Criadores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">1B+</div>
                <div className="text-sm text-muted-foreground">Horas Assistidas</div>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative float-animation">
              {/* Phone Frame */}
              <div className="w-72 h-[580px] bg-card rounded-[3rem] border-4 border-muted p-3 shadow-2xl glow">
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-b from-muted to-card rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-full" />
                  
                  {/* Live Preview */}
                  <div className="absolute inset-4 top-10 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30">
                    {/* Live Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="px-2 py-1 bg-destructive rounded-md text-xs font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full live-pulse" />
                        LIVE
                      </div>
                      <div className="px-2 py-1 bg-background/50 backdrop-blur-sm rounded-md text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        12.5K
                      </div>
                    </div>

                    {/* Streamer Info */}
                    <div className="absolute bottom-4 left-3 right-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                        <div>
                          <div className="font-semibold text-sm">@streamer_top</div>
                          <div className="text-xs text-muted-foreground">Jogando Valorant</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="absolute top-1/3 -left-8 w-14 h-14 bg-secondary rounded-xl flex items-center justify-center shadow-lg" style={{ animationDelay: "0.5s" }}>
                <span className="text-xl">❤️</span>
              </div>
              <div className="absolute bottom-1/4 -right-6 w-12 h-12 bg-accent rounded-lg flex items-center justify-center shadow-lg" style={{ animationDelay: "1s" }}>
                <span className="text-lg">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
