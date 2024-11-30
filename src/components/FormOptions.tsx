interface FormOptionsProps {
  duration: string;
  setDuration: (duration: string) => void;
  type: string;
  setType: (type: string) => void;
  routeType: string;
  setRouteType: (type: string) => void;
}

const FormOptions = ({
  duration,
  setDuration,
  type,
  setType,
  routeType,
  setRouteType
}: FormOptionsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
        <select 
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="30">30 minutes</option>
          <option value="60">1 heure</option>
          <option value="120">2 heures</option>
          <option value="180">3 heures</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thème du parcours
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de parcours
        </label>
        <select 
          value={routeType}
          onChange={(e) => setRouteType(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="loop">Boucle</option>
          <option value="point-to-point">Point à point</option>
        </select>
      </div>
    </div>
  );
};

export default FormOptions;