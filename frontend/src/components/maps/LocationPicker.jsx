import { useCallback, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../../hooks/useGoogleMapsLoader';
import MapUnavailable from './MapUnavailable';

const NAIROBI_CENTER = { lat: -1.2921, lng: 36.8219 };
const containerStyle = { width: '100%', height: '100%', borderRadius: 'var(--radius-card)' };

export default function LocationPicker({ value, onChange, center = NAIROBI_CENTER }) {
  const { isLoaded } = useGoogleMapsLoader();
  const [position, setPosition] = useState(value || null);

  const handleClick = useCallback(
    (e) => {
      const next = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setPosition(next);
      onChange?.(next);
    },
    [onChange]
  );

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return <MapUnavailable label="Location picker" />;
  }
  if (!isLoaded) {
    return <MapUnavailable label="Location picker is loading" />;
  }

  return (
    <div className="h-full min-h-[240px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || center}
        zoom={12}
        onClick={handleClick}
        options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
      >
        {position && <Marker position={position} />}
      </GoogleMap>
    </div>
  );
}
