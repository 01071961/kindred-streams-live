import { useState } from "react";
import { Gamepad2, Music, Palette, GraduationCap, Utensils, Dumbbell, MessageCircle, Sparkles } from "lucide-react";

const categories = [
  { id: "all", label: "Todos", icon: Sparkles },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "music", label: "Música", icon: Music },
  { id: "art", label: "Arte", icon: Palette },
  { id: "education", label: "Educação", icon: GraduationCap },
  { id: "food", label: "Culinária", icon: Utensils },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "chat", label: "Bate-papo", icon: MessageCircle },
];

const CategoryFilter = () => {
  const [active, setActive] = useState("all");

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              isActive 
                ? "bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-lg shadow-primary/25" 
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
