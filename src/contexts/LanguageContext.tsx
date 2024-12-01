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
    "downloadPDF": "Télécharger en PDF",
    "sendByEmail": "Envoyer par email",
    "seeOnGoogleMaps": "Voir sur Google Maps",
    "routeDetails": "Détails du parcours",
    "routeSteps": "Étapes du parcours",
    "duration": "Durée",
    "difficulty": "Difficulté",
    "easy": "Facile",
    "moderate": "Modéré",
    "hard": "Difficile",
    "audioGuide": "Guide audio",
    "audioAvailable": "Guide audio disponible",
    "audioNotAvailable": "Guide audio non disponible",
    
    // Custom page
    "createYourRoute": "Créer ton parcours",
    "startPoint": "Point de départ",
    "endPoint": "Point d'arrivée",
    "selectOnMap": "Sélectionner sur la carte",
    "routeType": "Type de parcours",
    "loopRoute": "Boucle",
    "pointToPoint": "Point à point",
    "targetDuration": "Durée souhaitée",
    "generateRoute": "Générer le parcours",
    "yourItinerary": "Votre itinéraire",
    "seeOnGoogleMaps": "Voir sur Google Maps",
    "step": "Étape",
    "selectStartPoint": "Sélectionnez un point de départ",
    "selectEndPoint": "Sélectionnez un point d'arrivée",
    "hours": "heures",
    "minutes": "minutes",
    
    // MyWalks page
    "myRoutes": "Mes parcours",
    "noSavedRoutes": "Vous n'avez pas encore de parcours enregistrés",
    "startExploring": "Commencer à explorer",
    "deleteRoute": "Supprimer ce parcours",
    "addMemory": "Ajouter un souvenir",
    "shareAlbum": "Partager l'album",
    "savedOn": "Enregistré le",
    "addPhoto": "Ajouter une photo",
    "description": "Description",
    "save": "Enregistrer",
    "photoAdded": "Photo ajoutée avec succès",
    "errorAddingPhoto": "Erreur lors de l'ajout de la photo",
    "confirmDeleteRoute": "Êtes-vous sûr de vouloir supprimer ce parcours ?",
    "routeDeleted": "Parcours supprimé avec succès",
    "errorDeletingRoute": "Erreur lors de la suppression du parcours",
    "createAlbum": "Créer un album",
    "albumTitle": "Titre de l'album",
    "albumDescription": "Description de l'album",
    "albumLocation": "Lieu",
    "albumCreated": "Album créé avec succès",
    "errorCreatingAlbum": "Erreur lors de la création de l'album",
    "shareViaEmail": "Partager par email",
    "recipientEmail": "Email du destinataire",
    "send": "Envoyer",
    "emailSent": "Email envoyé avec succès",
    "errorSendingEmail": "Erreur lors de l'envoi de l'email",
    
    // Common
    "saveToBook": "Enregistrer dans mon Carnet",
    "saving": "Enregistrement...",
    "loginRequired": "Connexion requise",
    "loginToAccess": "Veuillez vous connecter pour accéder à votre carnet de route",
    "routeAlreadySaved": "Ce parcours est déjà enregistré dans votre carnet",
    "routeSaved": "Le parcours a été ajouté à votre carnet de route",
    "errorSaving": "Impossible d'enregistrer le parcours",
    "confirmDelete": "Confirmer la suppression",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "success": "Succès",
    "error": "Erreur"
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
    "downloadPDF": "Download PDF",
    "sendByEmail": "Send by email",
    "seeOnGoogleMaps": "See on Google Maps",
    "routeDetails": "Route details",
    "routeSteps": "Route steps",
    "duration": "Duration",
    "difficulty": "Difficulty",
    "easy": "Easy",
    "moderate": "Moderate",
    "hard": "Hard",
    "audioGuide": "Audio guide",
    "audioAvailable": "Audio guide available",
    "audioNotAvailable": "Audio guide not available",
    
    // Custom page
    "createYourRoute": "Create your route",
    "startPoint": "Starting point",
    "endPoint": "End point",
    "selectOnMap": "Select on map",
    "routeType": "Route type",
    "loopRoute": "Loop",
    "pointToPoint": "Point to point",
    "targetDuration": "Target duration",
    "generateRoute": "Generate route",
    "yourItinerary": "Your itinerary",
    "seeOnGoogleMaps": "See on Google Maps",
    "step": "Step",
    "selectStartPoint": "Select a starting point",
    "selectEndPoint": "Select an end point",
    "hours": "hours",
    "minutes": "minutes",
    
    // MyWalks page
    "myRoutes": "My routes",
    "noSavedRoutes": "You don't have any saved routes yet",
    "startExploring": "Start exploring",
    "deleteRoute": "Delete this route",
    "addMemory": "Add a memory",
    "shareAlbum": "Share album",
    "savedOn": "Saved on",
    "addPhoto": "Add photo",
    "description": "Description",
    "save": "Save",
    "photoAdded": "Photo added successfully",
    "errorAddingPhoto": "Error adding photo",
    "confirmDeleteRoute": "Are you sure you want to delete this route?",
    "routeDeleted": "Route deleted successfully",
    "errorDeletingRoute": "Error deleting route",
    "createAlbum": "Create album",
    "albumTitle": "Album title",
    "albumDescription": "Album description",
    "albumLocation": "Location",
    "albumCreated": "Album created successfully",
    "errorCreatingAlbum": "Error creating album",
    "shareViaEmail": "Share via email",
    "recipientEmail": "Recipient email",
    "send": "Send",
    "emailSent": "Email sent successfully",
    "errorSendingEmail": "Error sending email",
    
    // Common
    "saveToBook": "Save to my Book",
    "saving": "Saving...",
    "loginRequired": "Login required",
    "loginToAccess": "Please login to access your route book",
    "routeAlreadySaved": "This route is already saved in your book",
    "routeSaved": "The route has been added to your book",
    "errorSaving": "Unable to save the route",
    "confirmDelete": "Confirm deletion",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "success": "Success",
    "error": "Error"
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
