import { useState, useCallback } from 'react';

interface TideHeightPoint {
  dt: number;
  height: number;
}

interface TideExtremePoint {
  dt: number;
  height: number;
  type: 'High' | 'Low';
}

interface TideApiResponse {
  status?: number;
  error?: string;
  heights?: TideHeightPoint[];
  extremes?: TideExtremePoint[];
}

export interface TideData {
  currentHeight: number | null;
  status: string | null;
  next: { time: string; type: string; height: number } | null;
  afterNext: { time: string; type: string; height: number } | null;
}

export function useTides() {
  const [tideData, setTideData] = useState<TideData>({
    currentHeight: null,
    status: null,
    next: null,
    afterNext: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTides = useCallback(async (lat: number, lon: number) => {
    const apiKey = import.meta.env.VITE_WORLDTIDES_KEY;
    
    if (!apiKey) {
      setError('Chave de API não configurada. Defina VITE_WORLDTIDES_KEY no .env');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL('https://www.worldtides.info/api/v3');
      url.searchParams.set('heights', '');
      url.searchParams.set('extremes', '');
      url.searchParams.set('date', 'today');
      url.searchParams.set('days', '1');
      url.searchParams.set('localtime', '1');
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lon));
      url.searchParams.set('key', apiKey);

      const res = await fetch(url.toString());
      const data = await res.json() as TideApiResponse;

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erro ao buscar marés');
      }

      const now = Math.floor(Date.now() / 1000);

      // Current height
      const heights = Array.isArray(data.heights) ? data.heights : [];
      let currentHeight: number | null = null;
      if (heights.length > 0) {
        const closest = heights.reduce((best, p) => 
          Math.abs(p.dt - now) < Math.abs(best.dt - now) ? p : best
        , heights[0]);
        currentHeight = Number(closest.height.toFixed(2));
      }

      // Extremes
      const extremes = Array.isArray(data.extremes) ? data.extremes : [];
      const nextExtremes = extremes
        .filter(e => e.dt >= now)
        .sort((a, b) => a.dt - b.dt)
        .slice(0, 2);

      const formatTime = (dt: number) => 
        new Date(dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const normalizeType = (t: 'High' | 'Low') => t === 'High' ? 'Alta' : 'Baixa';

      const next = nextExtremes[0] ? {
        time: formatTime(nextExtremes[0].dt),
        type: normalizeType(nextExtremes[0].type),
        height: Number(nextExtremes[0].height.toFixed(2))
      } : null;

      const afterNext = nextExtremes[1] ? {
        time: formatTime(nextExtremes[1].dt),
        type: normalizeType(nextExtremes[1].type),
        height: Number(nextExtremes[1].height.toFixed(2))
      } : null;

      const status = nextExtremes[0] 
        ? (nextExtremes[0].type === 'High' ? 'Enchente' : 'Vazante')
        : null;

      setTideData({ currentHeight, status, next, afterNext });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao buscar marés';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTidesForCurrentLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalização não suportada neste dispositivo/navegador.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchTides(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Permissão de localização negada. Habilite para ver as marés.');
        } else {
          setError('Não foi possível obter sua localização.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchTides]);

  return {
    tideData,
    loading,
    error,
    fetchTides,
    fetchTidesForCurrentLocation
  };
}
