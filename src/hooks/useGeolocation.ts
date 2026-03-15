import { useState, useCallback } from 'react';

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<GeolocationData | null> => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalização não suportada neste dispositivo/navegador.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      const locationData: GeolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      setLocation(locationData);
      setLoading(false);
      return locationData;
    } catch (err) {
      const error = err as GeolocationPositionError;
      let message = 'Não foi possível obter sua localização.';
      
      if (error.code === error.PERMISSION_DENIED) {
        message = 'Permissão de localização negada. Habilite o GPS.';
      } else if (error.code === error.TIMEOUT) {
        message = 'Tempo esgotado ao obter localização. Tente novamente.';
      }

      setError(message);
      setLoading(false);
      return null;
    }
  }, []);

  const formatLocation = useCallback((loc: GeolocationData | null): string => {
    if (!loc) return '';
    return `Lat ${loc.latitude.toFixed(5)}, Lon ${loc.longitude.toFixed(5)}`;
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    formatLocation
  };
}
