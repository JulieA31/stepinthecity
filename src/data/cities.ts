import { franceItineraries } from './itineraries/france';
import { italyItineraries } from './itineraries/italy';
import { portugalItineraries } from './itineraries/portugal';

export const touristicCities = {
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
  Italy: ["Rome", "Venise", "Florence"],
  Portugal: ["Lisbonne"]
};

export const cityItineraries = {
  Paris: franceItineraries.Paris,
  Marseille: franceItineraries.Marseille,
  Lyon: franceItineraries.Lyon,
  Toulouse: franceItineraries.Toulouse,
  Nice: franceItineraries.Nice,
  Rome: italyItineraries.Rome,
  Venise: italyItineraries.Venise,
  Florence: italyItineraries.Florence,
  Lisbonne: portugalItineraries.Lisbonne
};