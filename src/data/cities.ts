import { franceItineraries } from './itineraries/france';
import { italyItineraries } from './itineraries/italy';
import { portugalItineraries } from './itineraries/portugal';

export const touristicCities = {
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
  Italy: ["Rome", "Venise", "Florence"],
  Portugal: ["Lisbonne"]
};

export const cityItineraries = {
  ...franceItineraries.Paris,
  ...franceItineraries.Marseille,
  ...franceItineraries.Lyon,
  ...franceItineraries.Toulouse,
  ...franceItineraries.Nice,
  ...italyItineraries.Rome,
  ...italyItineraries.Venise,
  ...italyItineraries.Florence,
  ...portugalItineraries.Lisbonne
};