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
  France: ["Paris", "Marseille", "Lyon"],
  Italy: ["Rome"],
  Portugal: ["Lisbonne"]
};

export const cityItineraries: { [key: string]: any[] } = {
  Paris: [
    {
      title: "Sur les pas de Victor Hugo",
      description: "Découvrez les lieux emblématiques qui ont marqué la vie et l'œuvre de Victor Hugo à Paris.",
      duration: "2h30",
      difficulty: "Facile"
    },
    {
      title: "Les classiques de Paris",
      description: "Un parcours incontournable pour découvrir les monuments les plus emblématiques de Paris.",
      duration: "5h",
      difficulty: "Modéré"
    },
    {
      title: "Balade gastronomique",
      description: "Une promenade gourmande à travers les quartiers historiques de Paris.",
      duration: "3h30",
      difficulty: "Facile"
    }
  ],
  Marseille: [
    {
      title: "Sur les traces du passé",
      description: "Découvrez l'histoire de Marseille, de la fondation grecque à la modernité, en parcourant ses lieux emblématiques.",
      duration: "2h30",
      difficulty: "Facile",
      city: "Marseille"
    },
    {
      title: "Entre terre et mer",
      description: "Une balade entre parcs, plages et corniche pour découvrir les plus beaux paysages naturels de Marseille.",
      duration: "3h",
      difficulty: "Modéré",
      city: "Marseille"
    },
    {
      title: "Marseille et ses arts",
      description: "Un parcours culturel à travers les lieux artistiques emblématiques de la cité phocéenne.",
      duration: "2h",
      difficulty: "Facile",
      city: "Marseille"
    }
  ],
  Lyon: [
    {
      title: "Lyon à travers les siècles",
      description: "Explorez Lyon, de l'Antiquité à la Renaissance, à travers ses quartiers emblématiques et ses monuments.",
      duration: "2h30",
      difficulty: "Facile",
      city: "Lyon"
    },
    {
      title: "Lyon entre Rhône et Saône",
      description: "Une balade entre les deux fleuves, du Parc de la Tête d'Or aux quais historiques.",
      duration: "3h",
      difficulty: "Modéré",
      city: "Lyon"
    },
    {
      title: "Le goût de Lyon",
      description: "Une promenade gourmande dans la capitale mondiale de la gastronomie.",
      duration: "2h",
      difficulty: "Facile",
      city: "Lyon"
    },
    {
      title: "Sur les pas de Guignol",
      description: "À la rencontre du célèbre personnage lyonnais et de son univers.",
      duration: "2h30",
      difficulty: "Facile",
      city: "Lyon"
    }
  ],
  Rome: [
    {
      title: "Sur les pas de César",
      description: "Revivez l'histoire de la Rome antique en suivant les traces de Jules César.",
      duration: "3h",
      difficulty: "Modéré"
    },
    {
      title: "Rome baroque",
      description: "Découvrez les plus belles places et fontaines de la Rome baroque.",
      duration: "2h30",
      difficulty: "Facile"
    },
    {
      title: "Vatican et spiritualité",
      description: "Une immersion dans le plus petit État du monde et ses trésors.",
      duration: "3h",
      difficulty: "Facile"
    }
  ],
  Lisbonne: [
    {
      title: "Lisbonne historique",
      description: "Un voyage dans le temps à travers les monuments emblématiques de Lisbonne.",
      duration: "3h",
      difficulty: "Modéré"
    },
    {
      title: "Sur les rails du Tram 28",
      description: "Suivez l'itinéraire du célèbre tramway à travers les quartiers historiques.",
      duration: "2h",
      difficulty: "Facile"
    },
    {
      title: "Saveurs portugaises",
      description: "Une découverte des spécialités culinaires lisboètes.",
      duration: "2h30",
      difficulty: "Facile"
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
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onCitySelect(city);
  };

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-2">
      <MapPin className="w-5 h-5 text-primary" />
      <div className="flex flex-col sm:flex-row items-center gap-2">
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
