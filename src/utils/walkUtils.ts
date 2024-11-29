import { Step } from "@/types/walk";

const getNearbyPoints = (location: { lat: number; lng: number }, type: string): Step[] => {
  // Points d'intérêt autour de la position donnée selon le type
  const points: { [key: string]: Step[] } = {
    historical: [
      {
        title: "Monument historique",
        description: "Un lieu chargé d'histoire",
        duration: "45min",
        position: {
          lat: location.lat + 0.002,
          lng: location.lng + 0.002
        }
      },
      {
        title: "Site archéologique",
        description: "Découverte des vestiges",
        duration: "45min",
        position: {
          lat: location.lat - 0.002,
          lng: location.lng + 0.003
        }
      }
    ],
    cultural: [
      {
        title: "Musée",
        description: "Collections remarquables",
        duration: "1h",
        position: {
          lat: location.lat + 0.003,
          lng: location.lng - 0.002
        }
      },
      {
        title: "Galerie d'art",
        description: "Art contemporain",
        duration: "45min",
        position: {
          lat: location.lat - 0.001,
          lng: location.lng + 0.002
        }
      }
    ],
    nature: [
      {
        title: "Parc",
        description: "Espace vert paisible",
        duration: "45min",
        position: {
          lat: location.lat + 0.001,
          lng: location.lng + 0.001
        }
      },
      {
        title: "Jardin botanique",
        description: "Collection de plantes",
        duration: "45min",
        position: {
          lat: location.lat - 0.002,
          lng: location.lng - 0.001
        }
      }
    ],
    food: [
      {
        title: "Marché local",
        description: "Produits frais et locaux",
        duration: "45min",
        position: {
          lat: location.lat + 0.002,
          lng: location.lng - 0.002
        }
      },
      {
        title: "Restaurant traditionnel",
        description: "Cuisine locale",
        duration: "1h",
        position: {
          lat: location.lat - 0.001,
          lng: location.lng - 0.003
        }
      }
    ]
  };

  return points[type] || [];
};

export const generateStepsForType = (type: string, startLocation: { lat: number; lng: number }): Step[] => {
  if (type === "all") {
    return [
      ...getNearbyPoints(startLocation, "historical"),
      ...getNearbyPoints(startLocation, "cultural"),
      ...getNearbyPoints(startLocation, "nature"),
      ...getNearbyPoints(startLocation, "food")
    ].slice(0, 4); // Limite à 4 points d'intérêt
  }
  
  return getNearbyPoints(startLocation, type);
};