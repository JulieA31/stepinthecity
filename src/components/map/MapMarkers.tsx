import { Dispatch, SetStateAction } from 'react';
import { MarkerF } from '@react-google-maps/api';

interface MapMarkersProps {
  position: google.maps.LatLngLiteral;
  selectedPosition: google.maps.LatLngLiteral | null;
  setSelectedPosition: Dispatch<SetStateAction<google.maps.LatLngLiteral | null>>;
}

const MapMarkers = ({ position, selectedPosition, setSelectedPosition }: MapMarkersProps) => {
  return (
    <>
      <MarkerF
        position={position}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        }}
        title="Votre position"
        clickable={false}
      />
      {selectedPosition && (
        <MarkerF
          position={selectedPosition}
          animation={google.maps.Animation.DROP}
          clickable={false}
        />
      )}
    </>
  );
};

export default MapMarkers;