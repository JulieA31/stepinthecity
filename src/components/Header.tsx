import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-display">
            StepInTheCity
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/predefined"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/predefined" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Parcours prédéfinis
            </Link>
            <Link
              to="/custom"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/custom" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Parcours personnalisé
            </Link>
            {isLoggedIn && (
              <Link
                to="/my-walks"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/my-walks" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Mon Carnet de Route
              </Link>
            )}
            {isLoggedIn ? (
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="default">Se connecter</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;