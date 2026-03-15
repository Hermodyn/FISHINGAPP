import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface MarineWeather {
  temp: number;
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  pressure: number;
  humidity: number;
  visibility: number;
  fishingCondition?: string;
  sunrise?: string;
}

export function useWeather() {
  const [weather, setWeather] = useState<MarineWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.weather.getCurrent();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clima');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather
  };
}
