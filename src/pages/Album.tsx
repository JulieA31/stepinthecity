import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SavedWalk, WalkMemory } from "@/types/walk";
import WalkMemories from "@/components/WalkMemories";

const Album = () => {
  const { id } = useParams();
  const [walk, setWalk] = useState<SavedWalk | null>(null);
  const [memories, setMemories] = useState<WalkMemory[]>([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) return;

      // First, get the album details
      const { data: album, error: albumError } = await supabase
        .from('photo_albums')
        .select('*, saved_walks!inner(*)')
        .eq('id', id)
        .single();

      if (albumError) {
        console.error('Error fetching album:', albumError);
        return;
      }

      if (album?.saved_walks) {
        setWalk(album.saved_walks as SavedWalk);

        // Then, fetch the memories for this walk
        const { data: walkMemories, error: memoriesError } = await supabase
          .from('walk_memories')
          .select('*')
          .eq('saved_walk_id', album.saved_walks.id)
          .order('created_at', { ascending: false });

        if (memoriesError) {
          console.error('Error fetching memories:', memoriesError);
          return;
        }

        if (walkMemories) {
          setMemories(walkMemories);
        }
      }
    };

    fetchAlbum();
  }, [id]);

  if (!walk) return null;

  const formattedDate = format(new Date(walk.created_at), "d MMMM yyyy", { locale: fr });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              {walk.walk_title}
            </h1>
            <p className="text-gray-600 text-center mb-8">
              {walk.city} - {formattedDate}
            </p>

            <WalkMemories memories={memories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Album;