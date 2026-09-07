import { useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places'];

/** Loads the Google Maps JS SDK once, shared across all map components. */
export function useGoogleMapsLoader() {
  return useJsApiLoader({
    id: 'smartmove-google-maps',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  });
}
