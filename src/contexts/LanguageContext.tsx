import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Header
    "home": "Accueil",
    "predefinedRoutes": "Parcours prédéfinis",
    "customRoute": "Parcours personnalisé",
    "myRouteBook": "Mon Carnet de Route",
    "login": "Se connecter / S'inscrire",
    "logout": "Se déconnecter",
    
    // Index page
    "exploreCity": "Explore la ville autrement",
    "customItinerary": "Itinéraire Personnalisé",
    "createCustomRoute": "Crée ton parcours idéal en fonction de tes préférences et de ton temps.",
    "predefinedItineraries": "Parcours Prédéfinis",
    "discoverRoutes": "Découvre nos sélections d'itinéraires thématiques soigneusement préparés.",
    "howItWorks": "Comment ça marche ?",
    "chooseStyle": "Choisis ton style",
    "selectWalkType": "Sélectionne le type de balade qui te correspond",
    "customize": "Personnalise",
    "adjustDuration": "Ajuste la durée et les points d'intérêt",
    "explore": "Explore",
    "letGuide": "Laisse-toi guider à travers la ville",
    "start": "Commencer",
    
    // Predefined page
    "chooseThematicRoute": "Choisir ton parcours thématique",
    "selectCity": "Sélectionner une ville",
    
    // Common
    "duration": "Durée",
    "difficulty": "Difficulté",
    "easy": "Facile",
    "moderate": "Modéré",
    "hard": "Difficile",
    "saveToBook": "Enregistrer dans mon Carnet",
    "saving": "Enregistrement...",
    "routeSteps": "Étapes du parcours",
    "audioNotAvailable": "La narration audio n'est pas disponible pour ce parcours.",
    "loginRequired": "Connexion requise",
    "loginToAccess": "Veuillez vous connecter pour accéder à votre carnet de route",
    "routeAlreadySaved": "Ce parcours est déjà enregistré dans votre carnet",
    "routeSaved": "Le parcours a été ajouté à votre carnet de route",
    "errorSaving": "Impossible d'enregistrer le parcours"
  },
  en: {
    // Header
    "home": "Home",
    "predefinedRoutes": "Predefined Routes",
    "customRoute": "Custom Route",
    "myRouteBook": "My Route Book",
    "login": "Login / Sign up",
    "logout": "Logout",
    
    // Index page
    "exploreCity": "Explore the city differently",
    "customItinerary": "Custom Itinerary",
    "createCustomRoute": "Create your ideal route based on your preferences and time.",
    "predefinedItineraries": "Predefined Itineraries",
    "discoverRoutes": "Discover our carefully prepared selection of thematic routes.",
    "howItWorks": "How it works?",
    "chooseStyle": "Choose your style",
    "selectWalkType": "Select the type of walk that suits you",
    "customize": "Customize",
    "adjustDuration": "Adjust duration and points of interest",
    "explore": "Explore",
    "letGuide": "Let yourself be guided through the city",
    "start": "Start",
    
    // Predefined page
    "chooseThematicRoute": "Choose your thematic route",
    "selectCity": "Select a city",
    
    // Common
    "duration": "Duration",
    "difficulty": "Difficulty",
    "easy": "Easy",
    "moderate": "Moderate",
    "hard": "Hard",
    "saveToBook": "Save to my Book",
    "saving": "Saving...",
    "routeSteps": "Route steps",
    "audioNotAvailable": "Audio narration is not available for this route.",
    "loginRequired": "Login required",
    "loginToAccess": "Please login to access your route book",
    "routeAlreadySaved": "This route is already saved in your book",
    "routeSaved": "The route has been added to your book",
    "errorSaving": "Unable to save the route"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};