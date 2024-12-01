import { franceItineraries } from './itineraries/france';
import { italyItineraries } from './itineraries/italy';
import { portugalItineraries } from './itineraries/portugal';

export const touristicCities = {
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
  Italy: ["Rome", "Venise", "Florence", "Milan"],
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
  ...italyItineraries.Milan
};