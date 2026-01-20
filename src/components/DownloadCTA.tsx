import { Apple, Smartphone } from "lucide-react";
import { Button } from "./ui/button";

const DownloadCTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Baixe o app e <span className="gradient-text">comece agora</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Disponível para iOS e Android. Leve suas lives favoritas para qualquer lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" className="gap-3 bg-foreground text-background hover:bg-foreground/90">
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-[10px] opacity-80">Baixar na</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </Button>
            <Button variant="default" size="xl" className="gap-3 bg-foreground text-background hover:bg-foreground/90">
              <Smartphone className="w-6 h-6" />
              <div className="text-left">
                <div className="text-[10px] opacity-80">Disponível no</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;
