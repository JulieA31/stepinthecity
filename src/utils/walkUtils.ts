import { Step } from "@/types/walk";

const generatePointsOfInterest = (type: string, center: { lat: number; lng: number }, duration: string): Step[] => {
  // Ajuster le rayon en fonction de la durée
  const durationMap = {
    "30min": 0.003, // ~300m
    "1h": 0.005,    // ~500m
    "2h": 0.008,    // ~800m
    "3h": 0.01      // ~1km
  };
  
  const radius = durationMap[duration as keyof typeof durationMap] || 0.005;
  
  const points: { [key: string]: Step[] } = {
    historical: [
      {
        title: "Monument historique",
        description: "Un lieu chargé d'histoire",
        duration: duration === "30min" ? "15min" : "45min",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 4),
          lng: center.lng + radius * Math.sin(Math.PI / 4)
        }
      },
      {
        title: "Site archéologique",
        description: "Vestiges anciens",
        duration: duration === "30min" ? "15min" : "30min",
        position: {
          lat: center.lat + radius * Math.cos(3 * Math.PI / 4),
          lng: center.lng + radius * Math.sin(3 * Math.PI / 4)
        }
      }
    ],
    cultural: [
      {
        title: "Musée local",
        description: "Collections d'art et d'histoire",
        duration: duration === "30min" ? "15min" : "1h",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 3),
          lng: center.lng + radius * Math.sin(Math.PI / 3)
        }
      },
      {
        title: "Galerie d'art",
        description: "Expositions contemporaines",
        duration: duration === "30min" ? "15min" : "45min",
        position: {
          lat: center.lat + radius * Math.cos(2 * Math.PI / 3),
          lng: center.lng + radius * Math.sin(2 * Math.PI / 3)
        }
      }
    ],
    nature: [
      {
        title: "Parc municipal",
        description: "Espace vert et détente",
        duration: duration === "30min" ? "15min" : "30min",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 6),
          lng: center.lng + radius * Math.sin(Math.PI / 6)
        }
      },
      {
        title: "Jardin botanique",
        description: "Collection de plantes",
        duration: duration === "30min" ? "15min" : "45min",
        position: {
          lat: center.lat + radius * Math.cos(5 * Math.PI / 6),
          lng: center.lng + radius * Math.sin(5 * Math.PI / 6)
        }
      }
    ],
    food: [
      {
        title: "Restaurant local",
        description: "Cuisine traditionnelle",
        duration: duration === "30min" ? "15min" : "1h",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 2),
          lng: center.lng + radius * Math.sin(Math.PI / 2)
        }
      },
      {
        title: "Marché couvert",
        description: "Produits frais et locaux",
        duration: duration === "30min" ? "15min" : "45min",
        position: {
          lat: center.lat + radius * Math.cos(3 * Math.PI / 2),
          lng: center.lng + radius * Math.sin(3 * Math.PI / 2)
        }
      }
    ]
  };

  if (type === "all") {
    return Object.values(points).flat().slice(0, duration === "30min" ? 2 : 3);
  }

  return points[type] || [];
};

export const generateStepsForType = (type: string, startLocation: { lat: number; lng: number }, duration: string): Step[] => {
  return generatePointsOfInterest(type, startLocation, duration);
};