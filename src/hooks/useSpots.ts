import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { FishingSpot } from '../services/api';

export function useSpots() {
  const [spots, setSpots] = useState<FishingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.spots.getAll();
      setSpots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pontos');
      console.error('Error fetching spots:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSpot = useCallback(async (spotData: Omit<FishingSpot, 'id'>) => {
    try {
      const newSpot = await api.spots.create(spotData);
      setSpots(prev => [...prev, newSpot]);
      return newSpot;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar ponto');
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  return {
    spots,
    loading,
    error,
    addSpot,
    refetch: fetchSpots
  };
}
