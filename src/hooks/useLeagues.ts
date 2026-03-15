import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

export interface League {
  id: number;
  name: string;
  category: string;
  rules: string;
  invitedFriendIds: number[];
  prizePotEnabled?: boolean;
  prizePotType?: 'fictitious' | 'real';
  entryFee?: number;
  tournamentName?: string;
  location?: string;
  startAt?: string;
  endAt?: string;
  allowedSpecies?: string;
  modality?: string;
  boatMotor?: string;
  acceptTerms?: boolean;
  imageAuthorization?: boolean;
  emergencyContact?: string;
  liabilityTerm?: boolean;
  weighingMethod?: string;
  tiebreakCriteria?: string;
  createdAt: number;
}

export function useLeagues() {
  const [leagues, setLeagues] = useLocalStorage<League[]>('fishingapp.leagues.v1', []);

  const createLeague = useCallback((leagueData: Omit<League, 'id' | 'createdAt'>) => {
    const now = Date.now();
    const newLeague: League = {
      ...leagueData,
      id: now,
      createdAt: now
    };
    setLeagues(prev => [newLeague, ...prev]);
    return newLeague;
  }, [setLeagues]);

  const updateLeague = useCallback((id: number, data: Partial<League>) => {
    setLeagues(prev => prev.map(league => 
      league.id === id ? { ...league, ...data } : league
    ));
  }, [setLeagues]);

  const deleteLeague = useCallback((id: number) => {
    setLeagues(prev => prev.filter(league => league.id !== id));
  }, [setLeagues]);

  return {
    leagues,
    createLeague,
    updateLeague,
    deleteLeague
  };
}
