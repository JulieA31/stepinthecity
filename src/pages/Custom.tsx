import { useState } from "react";
import { Clock, MapPin, Users, Filter, Repeat, Navigation2, Volume2 } from "lucide-react";

const Custom = () => {
  const [duration, setDuration] = useState("1h");
  const [type, setType] = useState("all");
  const [routeType, setRouteType] = useState("loop");

  return (
    <div className="min-h-screen bg-secondary pt-24">
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
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <MapPin size={18} />
                  Choisir sur la carte
                </button>
              </div>

              {routeType === "point-to-point" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Point d'arrivée</label>
                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    <Navigation2 size={18} />
                    Choisir sur la carte
                  </button>
                </div>
              )}
            </div>
            
            <button className="btn-primary mt-8 w-full">
              Générer mon parcours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom;