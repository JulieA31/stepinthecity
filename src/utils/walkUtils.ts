import { Step } from "@/types/walk";

const generatePointsOfInterest = (type: string, center: { lat: number; lng: number }, duration: string): Step[] => {
  // Convertir la durée en nombre de points d'intérêt
  const pointsCount = {
    "30min": 2,
    "1h": 3,
    "2h": 4,
    "3h": 5
  }[duration] || 3;

  // Ajuster le rayon en fonction de la durée
  const radiusMap = {
    "30min": 0.003, // ~300m
    "1h": 0.005,    // ~500m
    "2h": 0.008,    // ~800m
    "3h": 0.01      // ~1km
  };
  
  const radius = radiusMap[duration as keyof typeof radiusMap] || 0.005;
  
  const pointsByType = {
    historical: [
      {
        title: "Monument historique",
        description: "Un lieu chargé d'histoire à découvrir",
        duration: "30min",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 4),
          lng: center.lng + radius * Math.sin(Math.PI / 4)
        }
      },
      {
        title: "Site archéologique",
        description: "Vestiges anciens remarquables",
        duration: "30min",
        position: {
          lat: center.lat + radius * Math.cos(3 * Math.PI / 4),
          lng: center.lng + radius * Math.sin(3 * Math.PI / 4)
        }
      },
      {
        title: "Musée d'histoire",
        description: "Collections historiques fascinantes",
        duration: "45min",
        position: {
          lat: center.lat + radius * Math.cos(5 * Math.PI / 4),
          lng: center.lng + radius * Math.sin(5 * Math.PI / 4)
        }
      }
    ],
    cultural: [
      {
        title: "Musée d'art",
        description: "Collections d'art exceptionnelles",
        duration: "45min",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 3),
          lng: center.lng + radius * Math.sin(Math.PI / 3)
        }
      },
      {
        title: "Galerie d'art contemporain",
        description: "Expositions d'art moderne",
        duration: "30min",
        position: {
          lat: center.lat + radius * Math.cos(2 * Math.PI / 3),
          lng: center.lng + radius * Math.sin(2 * Math.PI / 3)
        }
      },
      {
        title: "Théâtre historique",
        description: "Lieu culturel emblématique",
        duration: "30min",
        position: {
          lat: center.lat + radius * Math.cos(4 * Math.PI / 3),
          lng: center.lng + radius * Math.sin(4 * Math.PI / 3)
        }
      }
    ],
    nature: [
      {
        title: "Jardin public",
        description: "Espace vert paisible",
        duration: "30min",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 6),
          lng: center.lng + radius * Math.sin(Math.PI / 6)
        }
      },
      {
        title: "Parc botanique",
        description: "Collection de plantes remarquables",
        duration: "45min",
        position: {
          lat: center.lat + radius * Math.cos(5 * Math.PI / 6),
          lng: center.lng + radius * Math.sin(5 * Math.PI / 6)
        }
      },
      {
        title: "Point de vue naturel",
        description: "Panorama sur la ville",
        duration: "20min",
        position: {
          lat: center.lat + radius * Math.cos(7 * Math.PI / 6),
          lng: center.lng + radius * Math.sin(7 * Math.PI / 6)
        }
      }
    ],
    food: [
      {
        title: "Restaurant traditionnel",
        description: "Cuisine locale authentique",
        duration: "1h",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 2),
          lng: center.lng + radius * Math.sin(Math.PI / 2)
        }
      },
      {
        title: "Marché local",
        description: "Produits frais et spécialités",
        duration: "45min",
        position: {
          lat: center.lat + radius * Math.cos(3 * Math.PI / 2),
          lng: center.lng + radius * Math.sin(3 * Math.PI / 2)
        }
      },
      {
        title: "Pâtisserie artisanale",
        description: "Délices sucrés traditionnels",
        duration: "20min",
        position: {
          lat: center.lat + radius * Math.cos(0),
          lng: center.lng + radius * Math.sin(0)
        }
      }
    ]
  };

  let selectedPoints = type === "all" 
    ? Object.values(pointsByType).flat()
    : pointsByType[type as keyof typeof pointsByType] || [];

  // Sélectionner aléatoirement le bon nombre de points
  return selectedPoints
    .sort(() => Math.random() - 0.5)
    .slice(0, pointsCount);
};

export const generateStepsForType = (type: string, startLocation: { lat: number; lng: number }, duration: string): Step[] => {
  return generatePointsOfInterest(type, startLocation, duration);
};