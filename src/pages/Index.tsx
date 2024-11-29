import { Link } from "react-router-dom";
import LocationSelector from "@/components/LocationSelector";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-8 text-text">
            Découvrez votre ville autrement
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Explorez des parcours uniques et créez vos propres aventures urbaines
          </p>
          
          <LocationSelector />
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/all-walks"
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/lovable-uploads/84b16743-6931-4157-9ce5-f52dc2c22cbd.png"
                  alt="Explorer"
                  className="w-12 h-12 object-cover rounded"
                />
                <h2 className="text-2xl font-display">Explorer</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Découvrez tous nos parcours disponibles et laissez-vous guider à travers les plus beaux endroits de la ville.
              </p>
              <button className="btn-primary w-full">
                Explorer
              </button>
            </Link>
            
            <Link
              to="/custom"
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/lovable-uploads/cb8a89a9-b412-4275-9f16-1200ded34287.png"
                  alt="Personnaliser"
                  className="w-12 h-12 object-cover rounded"
                />
                <h2 className="text-2xl font-display">Itinéraire Personnalisé</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Créez votre parcours idéal en fonction de vos centres d'intérêt et du temps dont vous disposez.
              </p>
              <button className="btn-primary w-full">
                Commencer
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;