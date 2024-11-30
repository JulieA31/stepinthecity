import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Facebook, Instagram, Share2, Trash2, Share, Download } from "lucide-react";
import WalkMemories from "./WalkMemories";
import AddMemoryForm from "./AddMemoryForm";
import { SavedWalk as SavedWalkType, WalkMemory } from "@/types/walk";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SavedWalkProps {
  walk: SavedWalkType;
  memories: WalkMemory[];
  onDelete: (id: string) => void;
  onAddMemory: {
    selectedWalk: string | null;
    setSelectedWalk: (id: string | null) => void;
    newMemory: { description: string; file: File | null };
    setNewMemory: (memory: { description: string; file: File | null }) => void;
    handleAddMemory: () => void;
  };
}

const formatCityName = (city: string) => {
  const cityMap: { [key: string]: string } = {
    'paris': 'Paris',
    'rome': 'Rome',
    'lisbonne': 'Lisbonne'
  };
  return cityMap[city.toLowerCase()] || city;
};

const ShareButton = ({ walk }: { walk: SavedWalkType }) => {
  const shareUrl = `${window.location.origin}/my-walks`;
  const shareTitle = `Découvrez mon parcours "${walk.walk_title}" à ${formatCityName(walk.city)}`;
  const shareImage = walk.photo_url || '';

  const handleShare = (platform: 'facebook' | 'instagram' | 'pinterest') => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`,
      instagram: `https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(shareTitle)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('instagram')}>
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('pinterest')}>
          <Share className="h-4 w-4 mr-2" />
          Pinterest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SavedWalk = ({ walk, memories, onDelete, onAddMemory }: SavedWalkProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteMemory = async (memoryId: string) => {
    const { error } = await supabase
      .from('walk_memories')
      .delete()
      .eq('id', memoryId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le souvenir",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Souvenir supprimé avec succès",
    });

    window.location.reload();
  };

  const handleAddMemoryAndClose = async () => {
    await onAddMemory.handleAddMemory();
    setIsDialogOpen(false);
  };

  const generatePhotoAlbum = async () => {
    try {
      const formattedDate = format(new Date(walk.created_at), "d MMMM yyyy", { locale: fr });
      
      // Create a new window for the photo album
      const albumWindow = window.open('', '_blank');
      if (!albumWindow) {
        toast({
          title: "Erreur",
          description: "Impossible d'ouvrir la fenêtre de l'album photo. Veuillez autoriser les popups.",
          variant: "destructive",
        });
        return;
      }

      // Generate the HTML content for the album
      const albumContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Album Photo - ${walk.walk_title}</title>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
                background: #f5f5f5;
              }
              .header {
                text-align: center;
                margin-bottom: 2rem;
                padding: 2rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .title {
                font-size: 2.5rem;
                color: #1a1a1a;
                margin-bottom: 0.5rem;
              }
              .subtitle {
                color: #666;
                font-size: 1.2rem;
              }
              .memories-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 2rem;
              }
              .memory-card {
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .memory-image {
                width: 100%;
                height: 300px;
                object-fit: cover;
              }
              .memory-description {
                padding: 1rem;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="title">${walk.walk_title}</h1>
              <p class="subtitle">${formatCityName(walk.city)} - ${formattedDate}</p>
            </div>
            <div class="memories-grid">
              ${memories.map(memory => `
                <div class="memory-card">
                  <img src="${memory.photo_url}" alt="Souvenir" class="memory-image">
                  ${memory.description ? `<p class="memory-description">${memory.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;

      // Write the content to the new window
      albumWindow.document.write(albumContent);
      albumWindow.document.close();

      toast({
        title: "Succès",
        description: "Album photo généré avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'album photo",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{walk.walk_title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={generatePhotoAlbum}
              title="Générer l'album photo"
            >
              <Download className="h-5 w-5" />
            </Button>
            <ShareButton walk={walk} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(walk.id)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {walk.photo_url && (
          <div>
            <img
              src={walk.photo_url}
              alt={walk.walk_title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{formatCityName(walk.city)}</p>
        
        <WalkMemories 
          memories={memories} 
          onDeleteMemory={handleDeleteMemory}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => {
                onAddMemory.setSelectedWalk(walk.id);
                setIsDialogOpen(true);
              }}
            >
              Ajouter un souvenir
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un souvenir</DialogTitle>
            </DialogHeader>
            <AddMemoryForm
              onFileChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onAddMemory.setNewMemory({
                    ...onAddMemory.newMemory,
                    file: e.target.files[0],
                  });
                }
              }}
              onDescriptionChange={(value) =>
                onAddMemory.setNewMemory({
                  ...onAddMemory.newMemory,
                  description: value,
                })
              }
              onSubmit={handleAddMemoryAndClose}
              description={onAddMemory.newMemory.description}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SavedWalk;
