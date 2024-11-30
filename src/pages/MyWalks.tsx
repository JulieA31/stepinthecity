import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SavedWalk from "@/components/SavedWalk";
import { SavedWalk as SavedWalkType, WalkMemory } from "@/types/walk";
import { Facebook, Instagram, Share2 } from "lucide-react";

const MyWalks = () => {
  const [savedWalks, setSavedWalks] = useState<SavedWalkType[]>([]);
  const [memories, setMemories] = useState<{ [key: string]: WalkMemory[] }>({});
  const [selectedWalk, setSelectedWalk] = useState<string | null>(null);
  const [newMemory, setNewMemory] = useState<{ description: string; file: File | null }>({
    description: "",
    file: null,
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchSavedWalks();
    };

    checkUser();
  }, [navigate]);

  const fetchSavedWalks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("saved_walks")
      .select("*")
      .eq('user_id', session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos parcours enregistrés",
        variant: "destructive",
      });
      return;
    }

    setSavedWalks(data);
    data.forEach((walk) => fetchWalkMemories(walk.id));
  };

  const fetchWalkMemories = async (walkId: string) => {
    const { data, error } = await supabase
      .from("walk_memories")
      .select("*")
      .eq("saved_walk_id", walkId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les souvenirs",
        variant: "destructive",
      });
      return;
    }

    setMemories((prev) => ({ ...prev, [walkId]: data }));
  };

  const handleAddMemory = async () => {
    if (!selectedWalk || !newMemory.file) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un souvenir",
        variant: "destructive",
      });
      return;
    }

    const file = newMemory.file;
    const fileExt = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("walk_memories")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Erreur",
        description: "Impossible d'uploader la photo",
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("walk_memories")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("walk_memories").insert({
      saved_walk_id: selectedWalk,
      photo_url: publicUrl,
      description: newMemory.description,
      user_id: session.user.id
    });

    if (dbError) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le souvenir",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Souvenir ajouté avec succès",
    });

    setNewMemory({ description: "", file: null });
    fetchWalkMemories(selectedWalk);
  };

  const deleteWalk = async (walkId: string) => {
    const { error } = await supabase
      .from("saved_walks")
      .delete()
      .eq("id", walkId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le parcours",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Parcours supprimé avec succès",
    });

    fetchSavedWalks();
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-12">
          <img 
            src="/lovable-uploads/813c2bfd-c10a-4b25-99d1-6171f478abb9.png" 
            alt="Illustration de personnes en balade"
            className="w-full max-w-xl h-auto mb-8 rounded-lg"
          />
          <h1 className="text-4xl font-display text-text text-center mb-4">Mon Carnet de Route</h1>
          <div className="flex gap-4 items-center">
            <Facebook className="h-6 w-6 text-primary hover:text-accent transition-colors cursor-pointer" />
            <Instagram className="h-6 w-6 text-primary hover:text-accent transition-colors cursor-pointer" />
            <Share2 className="h-6 w-6 text-primary hover:text-accent transition-colors cursor-pointer" />
          </div>
        </div>
        
        <section>
          <h2 className="text-2xl font-display text-text mb-6">Mes Parcours</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedWalks.map((walk) => (
              <SavedWalk
                key={walk.id}
                walk={walk}
                memories={memories[walk.id] || []}
                onDelete={deleteWalk}
                onAddMemory={{
                  selectedWalk,
                  setSelectedWalk,
                  newMemory,
                  setNewMemory,
                  handleAddMemory,
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyWalks;