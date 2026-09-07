import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../../hooks/useGoogleMapsLoader';
import MapUnavailable from './MapUnavailable';

const NAIROBI_CENTER = { lat: -1.2921, lng: 36.8219 };
const containerStyle = { width: '100%', height: '100%', borderRadius: 'var(--radius-card)' };

export default function RouteMapPicker({ pickup, destination, onPickupChange, onDestinationChange, center = NAIROBI_CENTER }) {
  const { isLoaded } = useGoogleMapsLoader();
  const [nextPickup, setNextPickup] = useState(pickup);
  const [nextDestination, setNextDestination] = useState(destination);
  const [selecting, setSelecting] = useState('pickup');
  const onPickupChangeRef = useRef(onPickupChange);
  const onDestinationChangeRef = useRef(onDestinationChange);
  const selectingRef = useRef(selecting);

  useEffect(() => {
    onPickupChangeRef.current = onPickupChange;
  }, [onPickupChange]);

  useEffect(() => {
    onDestinationChangeRef.current = onDestinationChange;
  }, [onDestinationChange]);

  useEffect(() => {
    selectingRef.current = selecting;
  }, [selecting]);

  const handleMapClick = useCallback((e) => {
    const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (selectingRef.current === 'pickup') {
      setNextPickup(point);
      onPickupChangeRef.current?.(point);
      setSelecting('destination');
    } else {
      setNextDestination(point);
      onDestinationChangeRef.current?.(point);
      setSelecting('pickup');
    }
  }, []);

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return <MapUnavailable label="Route map picker" />;
  }
  if (!isLoaded) {
    return <MapUnavailable label="Route map is loading" />;
  }

  const activePickup = nextPickup || pickup;
  const activeDestination = nextDestination || destination;
  const mapCenter = activePickup || activeDestination || center;

  return (
    <div className="h-full min-h-[320px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onClick={handleMapClick}
        options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
      >
        {activePickup && (
          <Marker
            position={activePickup}
            label="A"
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
              fillColor: '#0f9d92',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#087f78',
              scale: 1.2,
            }}
          />
        )}
        {activeDestination && (
          <Marker
            position={activeDestination}
            label="B"
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
              fillColor: '#dc2626',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#b91c1c',
              scale: 1.2,
            }}
          />
        )}
        {activePickup && activeDestination && (
          <Polyline
            path={[activePickup, activeDestination]}
            options={{ strokeColor: '#102a43', strokeWeight: 3, strokeOpacity: 0.7 }}
          />
        )}
      </GoogleMap>
      <div className="border-t border-[var(--color-border)] bg-white px-3 py-2 text-xs text-[var(--color-slate)]">
        {selecting === 'pickup' ? 'Click map to set pickup (A)' : 'Click map to set destination (B)'}
      </div>
    </div>
  );
}
