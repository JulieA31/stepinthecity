import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { touristicCities, cityItineraries } from "@/data/cities";

interface LocationSelectorProps {
  onCitySelect: (city: string) => void;
}

const LocationSelector = ({ onCitySelect }: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof touristicCities | "">("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value as keyof typeof touristicCities);
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
