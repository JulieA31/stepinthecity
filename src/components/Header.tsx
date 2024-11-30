import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Menu, X, Home, MapPin, Map, Book } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "./ui/use-toast";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    setIsOpen(false);
  };

  const handleCarnetClick = () => {
    if (!isLoggedIn) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder à votre carnet de route",
      });
      navigate("/login");
    } else {
      navigate("/my-walks");
    }
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        onClick={() => setIsOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
          location.pathname === "/" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Home className="h-4 w-4" />
        Accueil
      </Link>
      <Link
        to="/predefined"
        onClick={() => setIsOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
          location.pathname === "/predefined" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <MapPin className="h-4 w-4" />
        Parcours prédéfinis
      </Link>
      <Link
        to="/custom"
        onClick={() => setIsOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
          location.pathname === "/custom" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Map className="h-4 w-4" />
        Parcours personnalisé
      </Link>
      <button
        onClick={handleCarnetClick}
        className={`text-sm font-medium transition-colors hover:text-primary text-left flex items-center gap-2 ${
          location.pathname === "/my-walks" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Book className="h-4 w-4" />
        Mon Carnet de Route
      </button>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/1d570795-c96a-447c-a27a-1b240ba72131.png" 
              alt="Step In The City Logo" 
              className="h-15 w-auto"
            />
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12">
                {isOpen ? <X className="h-6 w-6 md:h-8 md:w-8" /> : <Menu className="h-6 w-6 md:h-8 md:w-8" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px]">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
                {isLoggedIn ? (
                  <Button 
                    variant="ghost" 
                    className="justify-start px-2" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Se déconnecter
                  </Button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full">
                      Se connecter / S'inscrire
                    </Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;