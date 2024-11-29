import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { touristicCities, cityItineraries } from "@/components/LocationSelector";

const countryImages = {
  France: "/lovable-uploads/84b16743-6931-4157-9ce5-f52dc2c22cbd.png",
  Portugal: "/lovable-uploads/f5dfb482-1199-4209-92d5-fc8b14882694.png"
};

const AllWalks = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Tous les parcours disponibles</h1>
      <div className="space-y-12">
        {Object.entries(touristicCities).map(([country, cities]) => (
          <div key={country} className="space-y-6">
            <div className="flex items-center gap-6">
              <img
                src={countryImages[country as keyof typeof countryImages]}
                alt={`Illustration de ${country}`}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <h2 className="text-2xl font-semibold">{country}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => {
                const itineraries = cityItineraries[city as keyof typeof cityItineraries] || [];
                return itineraries.map((itinerary, index) => (
                  <Card key={`${city}-${index}`} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{itinerary.title}</CardTitle>
                      <p className="text-sm text-gray-500">{city}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{itinerary.description}</p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>{itinerary.duration}</span>
                        <span>•</span>
                        <span>{itinerary.difficulty}</span>
                      </div>
                    </CardContent>
                  </Card>
                ));
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllWalks;