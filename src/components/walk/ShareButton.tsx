import { Facebook, Instagram, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SavedWalk } from "@/types/walk";

interface ShareButtonProps {
  walk: SavedWalk;
  albumId?: string;
}

const ShareButton = ({ walk, albumId }: ShareButtonProps) => {
  const shareUrl = albumId 
    ? `${window.location.origin}/album/${albumId}`
    : `${window.location.origin}/my-walks`;
  const shareTitle = `Découvrez mon parcours "${walk.walk_title}" à ${walk.city}`;
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
          <Share className="h-5 w-5" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;