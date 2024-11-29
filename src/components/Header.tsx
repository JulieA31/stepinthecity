import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-display text-text">BaladIA</Link>
          
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>

          <nav className={`${isOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full bg-white shadow-lg md:shadow-none md:block md:static md:w-auto`}>
            <ul className="flex flex-col md:flex-row gap-4 p-4 md:p-0">
              <li>
                <Link to="/custom" className="text-text hover:text-primary transition-colors">
                  Parcours personnalisé
                </Link>
              </li>
              <li>
                <Link to="/predefined" className="text-text hover:text-primary transition-colors">
                  Parcours prédéfinis
                </Link>
              </li>
              <li>
                <Link to="/login" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
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