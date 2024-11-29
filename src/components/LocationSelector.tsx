import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

export const touristicCities = {
  France: ["Paris", "Nice", "Lyon", "Bordeaux", "Marseille"],
  Italy: ["Rome", "Venice", "Florence", "Milan", "Naples"],
  Spain: ["Barcelona", "Madrid", "Seville", "Valencia", "Granada"],
  "United Kingdom": ["London", "Edinburgh", "Bath", "Oxford", "Cambridge"],
  Portugal: ["Lisbon", "Porto"],
};

export const cityItineraries = {
  Paris: [
    {
      title: "Sur les pas de Victor Hugo",
      duration: "2h30",
      difficulty: "Facile",
      description: "Découvrez les lieux qui ont inspiré les plus grandes œuvres de Victor Hugo"
    },
    {
      title: "Les classiques de Paris",
      duration: "3h",
      difficulty: "Moyen",
      description: "Tour Eiffel, Louvre, Notre-Dame... Les incontournables de Paris"
    },
    {
      title: "Balade gastronomique",
      duration: "2h",
      difficulty: "Facile",
      description: "Découvrez les meilleures adresses culinaires de la capitale"
    }
  ],
  Lisbon: [
    {
      title: "Lisbonne historique",
      duration: "3h",
      difficulty: "Moyen",
      description: "Du château São Jorge à la Tour de Belém, découvrez l'histoire de Lisbonne"
    },
    {
      title: "Sur les rails du Tram 28",
      duration: "2h",
      difficulty: "Facile",
      description: "Suivez l'itinéraire du célèbre tramway à travers les quartiers typiques"
    },
    {
      title: "Saveurs portugaises",
      duration: "2h30",
      difficulty: "Facile",
      description: "Des pastéis de nata aux sardines grillées, goûtez aux spécialités locales"
    }
  ],
  Porto: [
    {
      title: "Route des vins",
      duration: "3h",
      difficulty: "Facile",
      description: "Découverte des caves et dégustation des meilleurs portos"
    },
    {
      title: "Porto médiéval",
      duration: "2h30",
      difficulty: "Moyen",
      description: "Exploration du quartier historique de la Ribeira"
    },
    {
      title: "Porto artistique",
      duration: "2h",
      difficulty: "Facile",
      description: "Des azulejos aux street art, l'art dans tous ses états"
    }
  ],
  Rome: [
    {
      title: "Rome antique",
      duration: "3h",
      difficulty: "Moyen",
      description: "Découvrez les vestiges de la Rome antique, du Colisée au Forum Romain"
    },
    {
      title: "Rome baroque",
      duration: "2h30",
      difficulty: "Facile",
      description: "Fontaine de Trevi, Place Navone, Panthéon... Les merveilles de la Rome baroque"
    },
    {
      title: "Vatican et spiritualité",
      duration: "3h",
      difficulty: "Facile",
      description: "Explorez la Cité du Vatican, ses musées et la basilique Saint-Pierre"
    }
  ]
};

type CountryKey = keyof typeof touristicCities;

interface LocationSelectorProps {
  onCitySelect: (city: string) => void;
}

const LocationSelector = ({ onCitySelect }: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey | "">("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value as CountryKey);
    setSelectedCity("");
    // Ne pas appeler onCitySelect ici pour garder le menu ouvert
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onCitySelect(city); // Appeler onCitySelect uniquement quand une ville est sélectionnée
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <MapPin className="w-5 h-5 text-primary" />
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Choisir un pays" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            {Object.keys(touristicCities).map((country) => (
              <SelectItem 
                key={country} 
                value={country}
                className="hover:bg-gray-100 cursor-pointer py-2"
              >
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCity}
          onValueChange={handleCityChange}
          disabled={!selectedCountry}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Choisir une ville" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            {selectedCountry &&
              touristicCities[selectedCountry].map((city) => (
                <SelectItem 
                  key={city} 
                  value={city}
                  className="hover:bg-gray-100 cursor-pointer py-2"
                >
                  {city}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;