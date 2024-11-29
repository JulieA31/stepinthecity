import { LampFloor, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    navigate("/");
  };

  if (location.pathname === "/login") return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LampFloor className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-display text-text">StepInTheCity</h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-4">
              <Link to="/custom" className="text-text hover:text-primary transition-colors">
                Parcours personnalisé
              </Link>
              <Link to="/predefined" className="text-text hover:text-primary transition-colors">
                Parcours prédéfinis
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-text hover:text-primary transition-colors"
                >
                  Déconnexion
                </button>
              ) : (
                <Link to="/login" className="text-text hover:text-primary transition-colors">
                  Connexion
                </Link>
              )}
            </nav>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <nav className="absolute top-full right-0 w-64 bg-white shadow-lg rounded-lg mt-2 py-4 z-50">
              <div className="flex flex-col items-start px-4">
                <Link 
                  to="/custom" 
                  className="w-full text-left py-2 text-text hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Parcours personnalisé
                </Link>
                <Link 
                  to="/predefined" 
                  className="w-full text-left py-2 text-text hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Parcours prédéfinis
                </Link>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-text hover:text-primary transition-colors"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full text-left py-2 text-text hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;