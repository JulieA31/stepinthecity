import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SavedWalk from "@/components/SavedWalk";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { WalkMemory } from "@/types/walk";

const MyWalks = () => {
  const [savedWalks, setSavedWalks] = useState<any[]>([]);
  const [memories, setMemories] = useState<{ [key: string]: WalkMemory[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWalk, setSelectedWalk] = useState<string | null>(null);
  const [newMemory, setNewMemory] = useState<{ description: string; file: File | null }>({
    description: "",
    file: null,
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

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
    try {
      const { data: walks, error } = await supabase
        .from("saved_walks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedWalks(walks || []);

      // Fetch memories for each walk
      const memoriesData: { [key: string]: WalkMemory[] } = {};
      for (const walk of walks || []) {
        const { data: walkMemories } = await supabase
          .from("walk_memories")
          .select("*")
          .eq("saved_walk_id", walk.id);
        memoriesData[walk.id] = walkMemories || [];
      }
      setMemories(memoriesData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMemory = async () => {
    if (!selectedWalk || !newMemory.file) return;

    const file = newMemory.file;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('walk_memories')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorAddingPhoto"),
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('walk_memories')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('walk_memories')
      .insert([
        {
          saved_walk_id: selectedWalk,
          photo_url: publicUrl,
          description: newMemory.description,
        },
      ]);

    if (dbError) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorAddingPhoto"),
      });
      return;
    }

    toast({
      title: t("success"),
      description: t("photoAdded"),
    });

    setNewMemory({ description: "", file: null });
    fetchSavedWalks();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8">{t("myRoutes")}</h1>

        {savedWalks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{t("noSavedRoutes")}</p>
            <Button onClick={() => navigate("/predefined")}>
              {t("startExploring")}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {savedWalks.map((walk) => (
              <SavedWalk
                key={walk.id}
                walk={walk}
                memories={memories[walk.id] || []}
                onDelete={fetchSavedWalks}
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
        )}
      </div>
    </div>
  );
};

export default MyWalks;