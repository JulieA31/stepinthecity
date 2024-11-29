import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

const touristicCities = {
  France: ["Paris", "Nice", "Lyon", "Bordeaux", "Marseille"],
  Italy: ["Rome", "Venice", "Florence", "Milan", "Naples"],
  Spain: ["Barcelona", "Madrid", "Seville", "Valencia", "Granada"],
  "United Kingdom": ["London", "Edinburgh", "Bath", "Oxford", "Cambridge"],
};

type CountryKey = keyof typeof touristicCities;

const LocationSelector = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey | "">("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value as CountryKey);
    setSelectedCity("");
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <MapPin className="w-5 h-5 text-primary" />
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choisir un pays" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(touristicCities).map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCity}
          onValueChange={setSelectedCity}
          disabled={!selectedCountry}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choisir une ville" />
          </SelectTrigger>
          <SelectContent>
            {selectedCountry &&
              touristicCities[selectedCountry].map((city) => (
                <SelectItem key={city} value={city}>
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