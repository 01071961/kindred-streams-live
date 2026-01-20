import { Video, Search, Bell, User, Menu, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
              <Video className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">LiveNow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground font-medium hover:text-primary transition-colors">
              Início
            </Link>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Explorar
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Categorias
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Seguindo
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar lives, criadores..."
                className="w-full h-10 pl-10 pr-4 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="w-5 h-5" />
            </Button>
            
            {user ? (
              <>
                <Link to="/streamer/setup">
                  <Button variant="glow" className="hidden sm:flex">
                    Iniciar Live
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden md:flex rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xs">
                          {user.email?.[0].toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="glow" className="hidden sm:flex" onClick={() => navigate("/auth")}>
                  Iniciar Live
                </Button>
                <Link to="/auth">
                  <Button variant="outline" size="icon" className="hidden md:flex">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-2 text-foreground font-medium hover:bg-muted rounded-lg transition-colors">
                Início
              </Link>
              <a href="#" className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                Explorar
              </a>
              <a href="#" className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                Categorias
              </a>
              <a href="#" className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                Seguindo
              </a>
              {user ? (
                <>
                  <Link to="/profile" className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                    Meu Perfil
                  </Link>
                  <div className="px-4 pt-2">
                    <Button variant="glow" className="w-full" onClick={() => navigate("/streamer/setup")}>
                      Iniciar Live
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-4 pt-2">
                  <Button variant="glow" className="w-full" onClick={() => navigate("/auth")}>
                    Entrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
