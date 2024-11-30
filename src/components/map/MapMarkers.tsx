import { MarkerF } from '@react-google-maps/api';

interface MapMarkersProps {
  selectedPosition: google.maps.LatLngLiteral | null;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
}

const MapMarkers = ({ selectedPosition, onMarkerDragEnd }: MapMarkersProps) => {
  if (!selectedPosition) return null;

  return (
    <MarkerF
      position={selectedPosition}
      draggable={true}
      onDragEnd={onMarkerDragEnd}
      animation={google.maps.Animation.DROP}
    />
  );
};

export default MapMarkers;