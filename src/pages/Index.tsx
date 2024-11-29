import { LampFloor, Clock, Compass, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <LampFloor className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-display text-text">StepInTheCity</h1>
          </div>
          <div className="text-center">
            <img 
              src="/lovable-uploads/fd183326-fb36-4fca-88df-47ac0310f4c7.png"
              alt="Illustration urbaine avec des personnes marchant dans la ville et des arbres roses"
              className="w-full h-80 object-contain bg-white rounded-lg shadow-md mx-auto"
            />
            <h2 className="font-bigelow text-5xl md:text-7xl text-text mt-6 mb-8">
              Explore la ville autrement
            </h2>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 animate-fade-up">
          <Link to="/custom" className="card group">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display">Itinéraire Personnalisé</h2>
            </div>
            <p className="text-gray-600">
              Créez votre parcours idéal en fonction de vos préférences.
            </p>
            <button className="btn-primary mt-6 w-full">
              Commencer
            </button>
          </Link>

          <Link to="/predefined" className="card group">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display">Parcours Prédéfinis</h2>
            </div>
            <p className="text-gray-600">
              Découvrez nos sélections d'itinéraires thématiques soigneusement préparés.
            </p>
            <button className="btn-primary mt-6 w-full">
              Explorer
            </button>
          </Link>

          <div className="md:col-span-2 mt-8">
            <div className="card">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-display">Comment ça marche ?</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-accent font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choisissez votre style</h3>
                  <p className="text-gray-600">Sélectionnez le type de balade qui vous correspond</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-accent font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Personnalisez</h3>
                  <p className="text-gray-600">Ajustez la durée et les points d'intérêt</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-accent font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Explorez</h3>
                  <p className="text-gray-600">Laissez-vous guider à travers la ville</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
