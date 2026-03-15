import { useState, useCallback } from 'react';

export function useFishScanner() {
  const [identifiedSpecies, setIdentifiedSpecies] = useState('');
  const [loading, setLoading] = useState(false);
  const [showIdentified, setShowIdentified] = useState(false);

  const identifyFish = useCallback(async (file: File) => {
    setLoading(true);
    setShowIdentified(false);

    // Validate photo timestamp (must be recent)
    const now = Date.now();
    const maxPhotoAgeMs = 2 * 60 * 1000; // 2 minutes
    if (now - file.lastModified > maxPhotoAgeMs) {
      setLoading(false);
      throw new Error('A foto deve ser capturada em tempo real (agora). Tire uma nova foto.');
    }

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 900));

    const candidates = [
      'Tilápia', 'Traíra', 'Tucunaré', 'Robalo', 'Pacu', 
      'Carpa', 'Dourado', 'Bagre', 'Corvina', 'Pintado'
    ];
    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    setIdentifiedSpecies(picked);
    setShowIdentified(true);
    setLoading(false);

    return picked;
  }, []);

  const reset = useCallback(() => {
    setIdentifiedSpecies('');
    setShowIdentified(false);
    setLoading(false);
  }, []);

  return {
    identifiedSpecies,
    loading,
    showIdentified,
    identifyFish,
    reset
  };
}
