export interface Step {
  title: string;
  description: string;
  duration: string;
  position?: google.maps.LatLngLiteral;
}

export interface Walk {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
}