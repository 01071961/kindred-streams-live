import LiveCard from "./LiveCard";
import CategoryFilter from "./CategoryFilter";

const liveStreams = [
  {
    streamer: "@gamer_pro",
    title: "Ranqueada até o amanhecer!",
    category: "Games",
    viewers: "24.5K",
    avatar: "",
    thumbnail: "",
  },
  {
    streamer: "@música_ao_vivo",
    title: "Covers e músicas autorais 🎸",
    category: "Música",
    viewers: "8.2K",
    avatar: "",
    thumbnail: "",
  },
  {
    streamer: "@arte_digital",
    title: "Desenhando seus personagens",
    category: "Arte",
    viewers: "5.1K",
    avatar: "",
    thumbnail: "",
  },
  {
    streamer: "@chef_maria",
    title: "Receitas fáceis do dia a dia",
    category: "Culinária",
    viewers: "12.8K",
    avatar: "",
    thumbnail: "",
  },
  {
    streamer: "@fitness_br",
    title: "Treino HIIT ao vivo! 💪",
    category: "Fitness",
    viewers: "3.4K",
    avatar: "",
    thumbnail: "",
  },
  {
    streamer: "@tech_talks",
    title: "Programação para iniciantes",
    category: "Educação",
    viewers: "15.2K",
    avatar: "",
    thumbnail: "",
  },
  {
    streamer: "@bate_papo",
    title: "Conversando sobre tudo",
    category: "Bate-papo",
    viewers: "6.7K",
    avatar: "",
    thumbnail: "",
  },
  {
    streamer: "@speedrun_br",
    title: "Tentando WR em Mario 64",
    category: "Games",
    viewers: "18.9K",
    avatar: "",
    thumbnail: "",
  },
];

const LiveGrid = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Lives em <span className="gradient-text">destaque</span>
            </h2>
            <p className="text-muted-foreground mt-1">
              Descubra os criadores mais populares agora
            </p>
          </div>
          <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Ver todas →
          </a>
        </div>

        {/* Category Filter */}
        <CategoryFilter />

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {liveStreams.map((stream, index) => (
            <div 
              key={stream.streamer} 
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <LiveCard {...stream} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveGrid;
