import { useState } from "react";
import { Clock, MapPin, Users, Filter, Repeat, Navigation2, Volume2 } from "lucide-react";
import LocationMap from "@/components/LocationMap";
import { Button } from "@/components/ui/button";

const Custom = () => {
  const [duration, setDuration] = useState("1h");
  const [type, setType] = useState("all");
  const [routeType, setRouteType] = useState("loop");
  const [showMap, setShowMap] = useState(false);
  const [startLocation, setStartLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [endLocation, setEndLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    if (selectingEnd) {
      setEndLocation({ lat, lng });
    } else {
      setStartLocation({ lat, lng });
    }
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8 text-center">Créez votre parcours</h1>
        
        <div className="card mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-display text-text mb-6">Critères de personnalisation</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="30min">30 minutes</option>
                  <option value="1h">1 heure</option>
                  <option value="2h">2 heures</option>
                  <option value="3h">3 heures</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de balade</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">Tous les types</option>
                  <option value="historical">Historique</option>
                  <option value="cultural">Culturel</option>
                  <option value="nature">Nature</option>
                  <option value="food">Gastronomie</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de parcours</label>
                <select 
                  value={routeType}
                  onChange={(e) => setRouteType(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="loop">Boucle</option>
                  <option value="point-to-point">Point à point</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Point de départ</label>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    setSelectingEnd(false);
                    setShowMap(true);
                  }}
                >
                  <MapPin size={18} />
                  {startLocation ? "Changer le point de départ" : "Choisir sur la carte"}
                </Button>
                {startLocation && (
                  <p className="text-sm text-gray-500 mt-1">
                    Position : {startLocation.lat.toFixed(4)}, {startLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {routeType === "point-to-point" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Point d'arrivée</label>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      setSelectingEnd(true);
                      setShowMap(true);
                    }}
                  >
                    <Navigation2 size={18} />
                    {endLocation ? "Changer le point d'arrivée" : "Choisir sur la carte"}
                  </Button>
                  {endLocation && (
                    <p className="text-sm text-gray-500 mt-1">
                      Position : {endLocation.lat.toFixed(4)}, {endLocation.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <Button className="mt-8 w-full">
              Générer mon parcours
            </Button>
          </div>
        </div>
      </div>

      <LocationMap
        open={showMap}
        onOpenChange={setShowMap}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default Custom;