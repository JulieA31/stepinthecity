import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { touristicCities } from "@/data/cities";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationSelectorProps {
  onCitySelect: (city: string) => void;
}

const LocationSelector = ({ onCitySelect }: LocationSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-sm mx-auto">
      <Select onValueChange={onCitySelect}>
        <SelectTrigger>
          <SelectValue placeholder={t("selectCity")} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(touristicCities).map(([country, cities]) => (
            <SelectGroup key={country}>
              <SelectLabel className="flex items-center">
                <span className="mr-2">{countryFlags[country]}</span>
                {country}
              </SelectLabel>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
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