import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Menu, X, Home, MapPin, Map, Book, Languages } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "./ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

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
        title: t("loginRequired"),
        description: t("loginToAccess"),
      });
      navigate("/login");
    } else {
      navigate("/my-walks");
    }
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
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
        {t("home")}
      </Link>
      <Link
        to="/predefined"
        onClick={() => setIsOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
          location.pathname === "/predefined" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <MapPin className="h-4 w-4" />
        {t("predefinedRoutes")}
      </Link>
      <Link
        to="/custom"
        onClick={() => setIsOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
          location.pathname === "/custom" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Map className="h-4 w-4" />
        {t("customRoute")}
      </Link>
      <button
        onClick={handleCarnetClick}
        className={`text-sm font-medium transition-colors hover:text-primary text-left flex items-center gap-2 ${
          location.pathname === "/my-walks" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Book className="h-4 w-4" />
        {t("myRouteBook")}
      </button>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-24">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/1d570795-c96a-447c-a27a-1b240ba72131.png" 
              alt="Step In The City Logo" 
              className="h-16 w-auto object-contain -mt-1"
            />
          </Link>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="mr-2"
            >
              <Languages className="h-5 w-5" />
            </Button>
            
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                className="flex items-center gap-2" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="default">
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
            >
              <Languages className="h-5 w-5" />
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                      {t("logout")}
                    </Button>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="default" className="w-full">
                        {t("login")}
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;