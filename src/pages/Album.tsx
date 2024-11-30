import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SavedWalk, WalkMemory } from "@/types/walk";

const Album = () => {
  const { id } = useParams();
  const [walk, setWalk] = useState<SavedWalk | null>(null);
  const [memories, setMemories] = useState<WalkMemory[]>([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) return;

      // First, get the album and associated walk
      const { data: album } = await supabase
        .from('photo_albums')
        .select(`
          saved_walk_id,
          saved_walks (
            id,
            walk_title,
            city,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (album?.saved_walks) {
        setWalk(album.saved_walks as SavedWalk);

        // Then, fetch the memories associated with this walk
        const { data: walkMemories } = await supabase
          .from('walk_memories')
          .select('*')
          .eq('saved_walk_id', album.saved_walk_id)
          .order('created_at', { ascending: false });

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory) => (
                <div key={memory.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img
                    src={memory.photo_url}
                    alt="Souvenir"
                    className="w-full h-64 object-cover"
                  />
                  {memory.description && (
                    <div className="p-4">
                      <p className="text-gray-600">{memory.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Album;