import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface Catch {
  id: number;
  species: string;
  weight: number;
  length: number;
  location: string;
  date: string;
  time: string;
  weather: string;
  baitUsed?: string;
  photoUrl?: string;
}

export function useCatches() {
  const [catches, setCatches] = useState<Catch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.catches.getAll();
      setCatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar capturas');
      console.error('Error fetching catches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCatch = useCallback(async (catchData: Omit<Catch, 'id' | 'date' | 'time'>) => {
    try {
      const newCatch = await api.catches.create(catchData);
      setCatches(prev => [newCatch, ...prev]);
      return newCatch;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar captura');
    }
  }, []);

  const updateCatch = useCallback(async (id: number, data: Partial<Catch>) => {
    try {
      const updated = await api.catches.update(id, data);
      setCatches(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar captura');
    }
  }, []);

  const deleteCatch = useCallback(async (id: number) => {
    try {
      await api.catches.delete(id);
      setCatches(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar captura');
    }
  }, []);

  useEffect(() => {
    fetchCatches();
  }, [fetchCatches]);

  return {
    catches,
    loading,
    error,
    addCatch,
    updateCatch,
    deleteCatch,
    refetch: fetchCatches
  };
}
