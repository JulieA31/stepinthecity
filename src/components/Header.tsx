import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LocationSelector from "./LocationSelector";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleCitySelect = (city: string) => {
    // Dispatch un événement personnalisé pour la sélection de ville
    const event = new CustomEvent('citySelected', { detail: city });
    window.dispatchEvent(event);
  };

  // N'affiche le sélecteur que sur la page des parcours prédéfinis
  const showLocationSelector = location.pathname === '/predefined';

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-text">
            <img 
              src="/lovable-uploads/18a323e4-8732-4bd7-8a15-069876a74b4a.png" 
              alt="Silhouette Charlie Chaplin"
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-display text-text">StepInTheCity</span>
          </Link>
          
          {showLocationSelector && (
            <div className="hidden md:block">
              <LocationSelector onCitySelect={handleCitySelect} />
            </div>
          )}
          
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center">
            {isOpen ? <X /> : <Menu />}
          </button>

          <nav className={`${isOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full bg-white shadow-lg`}>
            {showLocationSelector && (
              <div className="md:hidden">
                <LocationSelector onCitySelect={handleCitySelect} />
              </div>
            )}
            <ul className="flex flex-col gap-4 p-4">
              <li>
                <Link 
                  to="/custom" 
                  className="text-text hover:text-primary transition-colors block text-center"
                  onClick={handleNavClick}
                >
                  Parcours personnalisé
                </Link>
              </li>
              <li>
                <Link 
                  to="/predefined" 
                  className="text-text hover:text-primary transition-colors block text-center"
                  onClick={handleNavClick}
                >
                  Parcours prédéfinis
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-text hover:text-primary transition-colors justify-center"
                  onClick={handleNavClick}
                >
                  <User size={18} />
                  Connexion
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;