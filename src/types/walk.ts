export interface Step {
  title: string;
  description: string;
  duration: string;
  position?: google.maps.LatLngLiteral;
  imageUrl?: string;
}

export interface Walk {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  city?: string;
}

export interface SavedWalk {
  id: string;
  walk_title: string;
  city: string;
  created_at: string;
  photo_url?: string;
}

export interface WalkMemory {
  id: string;
  photo_url: string;
  description: string | null;
  created_at: string;
}