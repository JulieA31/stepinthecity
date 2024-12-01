import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { touristicCities } from "@/data/cities";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface LocationSelectorProps {
  onCitySelect: (city: string) => void;
}

const LocationSelector = ({ onCitySelect }: LocationSelectorProps) => {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <Select onValueChange={handleCountrySelect} value={selectedCountry}>
        <SelectTrigger>
          <SelectValue placeholder={t("selectCountry")} />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(touristicCities).map((country) => (
            <SelectItem key={country} value={country}>
              <span className="flex items-center">
                <span className="mr-2">{countryFlags[country]}</span>
                {country}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCountry && (
        <Select onValueChange={onCitySelect}>
          <SelectTrigger>
            <SelectValue placeholder={t("selectCity")} />
          </SelectTrigger>
          <SelectContent>
            {touristicCities[selectedCountry as keyof typeof touristicCities].map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

const countryFlags: { [key: string]: string } = {
  France: "🇫🇷",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  "United Kingdom": "🇬🇧",
  Portugal: "🇵🇹"
};

export default LocationSelector;