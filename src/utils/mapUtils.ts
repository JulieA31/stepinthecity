import { Step } from "@/types/walk";

export const getStepPosition = (step: Step, walkTitle: string): google.maps.LatLngLiteral | undefined => {
  const positions: { [key: string]: { [key: string]: google.maps.LatLngLiteral } } = {
    "Sur les pas de Victor Hugo": {
      "Place des Vosges": { lat: 48.8554, lng: 2.3671 },
      "Notre-Dame de Paris": { lat: 48.8530, lng: 2.3499 },
      "Panthéon": { lat: 48.8462, lng: 2.3464 },
      "Café Procope": { lat: 48.8527, lng: 2.3394 }
    },
    "Lisbonne historique": {
      "Château São Jorge": { lat: 38.7139, lng: -9.1334 },
      "Cathédrale de Lisbonne": { lat: 38.7098, lng: -9.1325 },
      "Place du Commerce": { lat: 38.7075, lng: -9.1364 },
      "Tour de Belém": { lat: 38.6916, lng: -9.2159 }
    },
    "Sur les rails du Tram 28": {
      "Praça Martim Moniz": { lat: 38.7157, lng: -9.1365 },
      "Graça": { lat: 38.7164, lng: -9.1307 },
      "Alfama": { lat: 38.7117, lng: -9.1332 },
      "Baixa-Chiado": { lat: 38.7106, lng: -9.1390 }
    },
    "Saveurs portugaises": {
      "Mercado da Ribeira": { lat: 38.7067, lng: -9.1463 },
      "Pastéis de Belém": { lat: 38.6975, lng: -9.2032 },
      "Cervejaria Ramiro": { lat: 38.7208, lng: -9.1355 },
      "Ginjinha": { lat: 38.7147, lng: -9.1394 }
    },
    "Sur les pas de César": {
      "Colisée": { lat: 41.8902, lng: 12.4922 },
      "Arc de Constantin": { lat: 41.8898, lng: 12.4910 },
      "Forum Romain": { lat: 41.8925, lng: 12.4853 },
      "Mont Palatin": { lat: 41.8892, lng: 12.4875 }
    },
    "Rome baroque": {
      "Fontaine de Trevi": { lat: 41.9009, lng: 12.4833 },
      "Panthéon": { lat: 41.8986, lng: 12.4769 },
      "Place Navone": { lat: 41.8992, lng: 12.4730 },
      "Escaliers de la Trinité des Monts": { lat: 41.9060, lng: 12.4833 }
    },
    "Vatican et spiritualité": {
      "Place Saint-Pierre": { lat: 41.9022, lng: 12.4567 },
      "Musées du Vatican": { lat: 41.9067, lng: 12.4526 },
      "Basilique Saint-Pierre": { lat: 41.9022, lng: 12.4533 },
      "Château Saint-Ange": { lat: 41.9031, lng: 12.4663 }
    },
  };

  return positions[walkTitle]?.[step.title];
};

export const calculateDirectionsRoute = (
  directionsService: google.maps.DirectionsService,
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
  waypoints: google.maps.DirectionsWaypoint[]
): Promise<google.maps.DirectionsResult> => {
  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.WALKING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      }
    );
  });
};
