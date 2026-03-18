// API Service Layer - Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Catch {
  id: number;
  species: string;
  weight: number;
  length: number;
  location: string;
  date: string;
  time: string;
  weather: string;
}

interface FishingSpot {
  id: number;
  name: string;
  catches_count?: number;
  rating: number;
}

interface Weather {
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

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const contentType = response.headers.get('content-type') || '';
    const hasJson = contentType.includes('application/json');
    const rawText = response.status === 204 ? '' : await response.text();

    const parsedBody: unknown = (() => {
      if (!rawText) return null;
      if (!hasJson) return rawText;
      try {
        return JSON.parse(rawText);
      } catch {
        return rawText;
      }
    })();

    if (!response.ok) {
      const message =
        typeof (parsedBody as any)?.error === 'string'
          ? (parsedBody as any).error
          : typeof (parsedBody as any)?.message === 'string'
            ? (parsedBody as any).message
            : response.statusText || 'Request failed';

      throw new ApiError(message, response.status, parsedBody);
    }

    return parsedBody as T;
  }

  catches = {
    getAll: (): Promise<Catch[]> => this.request<Catch[]>('/catches'),
    getById: (id: number): Promise<Catch> => this.request<Catch>(`/catches/${id}`),
    create: (data: Omit<Catch, 'id' | 'date' | 'time'>): Promise<Catch> => 
      this.request<Catch>('/catches', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Catch>): Promise<Catch> => 
      this.request<Catch>(`/catches/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number): Promise<void> => 
      this.request<void>(`/catches/${id}`, {
        method: 'DELETE',
      }),
  };

  spots = {
    getAll: (): Promise<FishingSpot[]> => this.request<FishingSpot[]>('/spots'),
    getById: (id: number): Promise<FishingSpot> => this.request<FishingSpot>(`/spots/${id}`),
    create: (data: Omit<FishingSpot, 'id'>): Promise<FishingSpot> => 
      this.request<FishingSpot>('/spots', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  weather = {
    getCurrent: (): Promise<Weather> => this.request<Weather>('/weather/current'),
    getForecast: (): Promise<{ today: Weather; tomorrow: Weather; dayAfter: Weather }> => 
      this.request('/weather/forecast'),
  };
}

export const api = new ApiService();
export type { Catch, FishingSpot, Weather };
