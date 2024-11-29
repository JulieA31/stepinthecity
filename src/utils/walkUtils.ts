import { Step } from "@/types/walk";

const generatePointsOfInterest = (type: string, center: { lat: number; lng: number }, duration: string): Step[] => {
  // Convertir la durée en nombre de points d'intérêt
  const pointsCount = {
    "30min": 2,
    "1h": 3,
    "2h": 5,
    "3h": 7
  }[duration] || 3;

  // Ajuster le rayon en fonction de la durée (en degrés, ~1km = 0.01)
  const radiusMap = {
    "30min": 0.01,    // ~1km
    "1h": 0.02,       // ~2km
    "2h": 0.03,       // ~3km
    "3h": 0.04        // ~4km
  };
  
  const radius = radiusMap[duration as keyof typeof radiusMap] || 0.02;
  
  // Points d'intérêt par ville (basé sur les coordonnées du centre)
  const cityPOIs: { [key: string]: any } = {
    // Toulouse (approximativement 43.6045, 1.4440)
    "toulouse": {
      historical: [
        {
          title: "Capitole de Toulouse",
          description: "Hôtel de ville historique et théâtre",
          duration: "45min",
          position: { lat: 43.6045, lng: 1.4440 }
        },
        {
          title: "Basilique Saint-Sernin",
          description: "Plus grande église romane d'Europe",
          duration: "30min",
          position: { lat: 43.6088, lng: 1.4417 }
        },
        {
          title: "Couvent des Jacobins",
          description: "Chef d'œuvre de l'art gothique",
          duration: "40min",
          position: { lat: 43.6033, lng: 1.4402 }
        },
        {
          title: "Musée des Augustins",
          description: "Musée des Beaux-Arts",
          duration: "1h",
          position: { lat: 43.6003, lng: 1.4467 }
        }
      ],
      cultural: [
        {
          title: "Musée des Abattoirs",
          description: "Art moderne et contemporain",
          duration: "1h",
          position: { lat: 43.5989, lng: 1.4308 }
        },
        {
          title: "Théâtre du Capitole",
          description: "Opéra national",
          duration: "45min",
          position: { lat: 43.6043, lng: 1.4437 }
        },
        {
          title: "Halle de La Machine",
          description: "Machines géantes et spectaculaires",
          duration: "1h30",
          position: { lat: 43.5717, lng: 1.4778 }
        }
      ],
      nature: [
        {
          title: "Jardin des Plantes",
          description: "Plus grand jardin public de Toulouse",
          duration: "45min",
          position: { lat: 43.5923, lng: 1.4503 }
        },
        {
          title: "Prairie des Filtres",
          description: "Parc en bord de Garonne",
          duration: "30min",
          position: { lat: 43.5977, lng: 1.4397 }
        },
        {
          title: "Jardin Royal",
          description: "Jardin historique",
          duration: "30min",
          position: { lat: 43.5954, lng: 1.4515 }
        }
      ],
      food: [
        {
          title: "Marché Victor Hugo",
          description: "Plus grand marché couvert",
          duration: "45min",
          position: { lat: 43.6024, lng: 1.4453 }
        },
        {
          title: "Quartier des Carmes",
          description: "Restaurants et épiceries fines",
          duration: "1h",
          position: { lat: 43.5977, lng: 1.4453 }
        }
      ]
    }
    // Ajoutez d'autres villes ici avec leurs points d'intérêt
  };

  // Déterminer la ville en fonction des coordonnées
  const city = "toulouse"; // Pour l'instant fixé à Toulouse, à rendre dynamique plus tard

  // Sélectionner les points d'intérêt en fonction du type
  let availablePoints = type === "all" 
    ? Object.values(cityPOIs[city]).flat()
    : cityPOIs[city][type] || [];

  // Si pas assez de points pour le type spécifique, compléter avec d'autres types
  if (availablePoints.length < pointsCount) {
    const otherPoints = Object.values(cityPOIs[city])
      .flat()
      .filter(point => !availablePoints.includes(point));
    availablePoints = [...availablePoints, ...otherPoints];
  }

  // Sélectionner aléatoirement le nombre de points requis
  return availablePoints
    .sort(() => Math.random() - 0.5)
    .slice(0, pointsCount);
};

export const generateStepsForType = (type: string, startLocation: { lat: number; lng: number }, duration: string): Step[] => {
  return generatePointsOfInterest(type, startLocation, duration);
};