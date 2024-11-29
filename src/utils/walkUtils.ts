import { Step } from "@/types/walk";

const generatePointsOfInterest = (type: string, center: { lat: number; lng: number }): Step[] => {
  const radius = 0.005; // Environ 500m
  const points: { [key: string]: Step[] } = {
    historical: [
      {
        title: "Monument historique",
        description: "Un lieu chargé d'histoire",
        duration: "45min",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 4),
          lng: center.lng + radius * Math.sin(Math.PI / 4)
        }
      },
      {
        title: "Site archéologique",
        description: "Vestiges anciens",
        duration: "30min",
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
        duration: "1h",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 3),
          lng: center.lng + radius * Math.sin(Math.PI / 3)
        }
      },
      {
        title: "Galerie d'art",
        description: "Expositions contemporaines",
        duration: "45min",
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
        duration: "30min",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 6),
          lng: center.lng + radius * Math.sin(Math.PI / 6)
        }
      },
      {
        title: "Jardin botanique",
        description: "Collection de plantes",
        duration: "45min",
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
        duration: "1h",
        position: {
          lat: center.lat + radius * Math.cos(Math.PI / 2),
          lng: center.lng + radius * Math.sin(Math.PI / 2)
        }
      },
      {
        title: "Marché couvert",
        description: "Produits frais et locaux",
        duration: "45min",
        position: {
          lat: center.lat + radius * Math.cos(3 * Math.PI / 2),
          lng: center.lng + radius * Math.sin(3 * Math.PI / 2)
        }
      }
    ]
  };

  if (type === "all") {
    return Object.values(points).flat().slice(0, 3);
  }

  return points[type] || [];
};

export const generateStepsForType = (type: string, startLocation: { lat: number; lng: number }): Step[] => {
  return generatePointsOfInterest(type, startLocation);
};