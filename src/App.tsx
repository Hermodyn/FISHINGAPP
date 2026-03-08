import { useState, useEffect, useMemo, useCallback } from 'react'
import { Fish, MapPin, Cloud, TrendingUp, Plus, Calendar, Clock, Ruler, Weight, Wind, Sunrise, Droplets, Anchor, Activity, BookOpen, Camera, Trophy, Users, MessageSquare, Scan, Award, Image, Info, Wrench, Target } from 'lucide-react'
import './App.css'

interface Catch {
  id: number
  species: string
  weight: number
  length: number
  location: string
  date: string
  time: string
  weather: string
}

interface FishingSpot {
  id: number
  name: string
  catches: number
  rating: number
  distance: number
  latitude: number
  longitude: number
}

interface MarineWeather {
  temp: number
  windSpeed: number
  windDirection: string
  waveHeight: number
  pressure: number
  humidity: number
  visibility: number
}

interface PhotoGallery {
  id: number
  url: string
  catchId: number
  date: string
}

interface Championship {
  id: number
  name: string
  location: string
  date: string
  prize: string
  participants: number
  maxParticipants: number
  status: 'open' | 'closed' | 'ongoing'
}

interface Sponsor {
  id: number
  name: string
  type: 'store' | 'factory' | 'prize'
  logo: string
  description: string
  discount?: string
}

interface SubscriptionPlan {
  id: number
  name: string
  price: string
  features: string[]
  popular?: boolean
}

interface TideHeightPoint {
  dt: number
  height: number
}

interface TideExtremePoint {
  dt: number
  height: number
  type: 'High' | 'Low'
}

interface TideApiResponse {
  status?: number
  error?: string
  heights?: TideHeightPoint[]
  extremes?: TideExtremePoint[]
}

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'catches' | 'spots' | 'championships' | 'sponsors' | 'subscription' | 'community' | 'leagues' | 'stats' | 'weather'>('home')
  const [showAddCatch, setShowAddCatch] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showAIScanner, setShowAIScanner] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoGallery | null>(null)
  const [showFriendsGallery, setShowFriendsGallery] = useState(false)

  const [tideLoading, setTideLoading] = useState(false)
  const [tideError, setTideError] = useState<string | null>(null)
  const [tideCurrentHeight, setTideCurrentHeight] = useState<number | null>(null)
  const [tideStatus, setTideStatus] = useState<string | null>(null)
  const [tideNext, setTideNext] = useState<{ time: string; type: string; height: number } | null>(null)
  const [tideAfterNext, setTideAfterNext] = useState<{ time: string; type: string; height: number } | null>(null)
  const [catches, setCatches] = useState<Catch[]>([
    {
      id: 1,
      species: 'Robalo',
      weight: 2.5,
      length: 45,
      location: 'Lagoa da Conceição',
      date: '2026-02-15',
      time: '06:30',
      weather: 'Ensolarado'
    },
    {
      id: 2,
      species: 'Corvina',
      weight: 3.2,
      length: 52,
      location: 'Praia da Armação',
      date: '2026-02-14',
      time: '17:45',
      weather: 'Nublado'
    }
  ])

  const [spots] = useState<FishingSpot[]>([
    { id: 1, name: 'Pesqueiro Maeda', catches: 45, rating: 4.8, distance: 12.5, latitude: -23.4892, longitude: -46.5731 },
    { id: 2, name: 'Represa Billings', catches: 38, rating: 4.6, distance: 15.2, latitude: -23.7833, longitude: -46.5667 },
    { id: 3, name: 'Represa Guarapiranga', catches: 32, rating: 4.5, distance: 18.3, latitude: -23.7167, longitude: -46.7333 },
    { id: 4, name: 'Lago do Taboão', catches: 28, rating: 4.4, distance: 22.1, latitude: -23.6167, longitude: -46.7833 },
    { id: 5, name: 'Pesqueiro Taquari', catches: 25, rating: 4.7, distance: 25.8, latitude: -23.5500, longitude: -46.6333 },
    { id: 6, name: 'Represa de Ponte Nova', catches: 22, rating: 4.3, distance: 28.5, latitude: -23.4833, longitude: -46.4167 },
    { id: 7, name: 'Pesqueiro Rancho Alegre', catches: 20, rating: 4.5, distance: 31.2, latitude: -23.5167, longitude: -46.8500 },
    { id: 8, name: 'Lago Parque Ibirapuera', catches: 18, rating: 4.2, distance: 8.7, latitude: -23.5875, longitude: -46.6575 }
  ])

  const [weather] = useState<MarineWeather>({
    temp: 23,
    windSpeed: 12,
    windDirection: 'NE',
    waveHeight: 0.8,
    pressure: 1013,
    humidity: 75,
    visibility: 10
  })

  const fishingCondition = 'Bom'
  const sunrise = '06:15'

  const fetchTidesForLocation = useCallback(async (lat: number, lon: number) => {
    const apiKey = (import.meta as any).env?.VITE_WORLDTIDES_KEY as string | undefined
    if (!apiKey) {
      setTideError('Chave de API não configurada. Defina VITE_WORLDTIDES_KEY no .env e reinicie o servidor.')
      return
    }

    setTideLoading(true)
    setTideError(null)

    try {
      const url = new URL('https://www.worldtides.info/api/v3')
      url.searchParams.set('heights', '')
      url.searchParams.set('extremes', '')
      url.searchParams.set('date', 'today')
      url.searchParams.set('days', '1')
      url.searchParams.set('localtime', '1')
      url.searchParams.set('lat', String(lat))
      url.searchParams.set('lon', String(lon))
      url.searchParams.set('key', apiKey)

      const res = await fetch(url.toString())
      const data = (await res.json()) as TideApiResponse

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erro ao buscar marés')
      }

      const now = Math.floor(Date.now() / 1000)

      const heights = Array.isArray(data.heights) ? data.heights : []
      if (heights.length > 0) {
        const closest = heights.reduce((best, p) => {
          return Math.abs(p.dt - now) < Math.abs(best.dt - now) ? p : best
        }, heights[0])
        setTideCurrentHeight(Number(closest.height.toFixed(2)))
      } else {
        setTideCurrentHeight(null)
      }

      const extremes = Array.isArray(data.extremes) ? data.extremes : []
      const nextExtremes = extremes
        .filter((e) => e.dt >= now)
        .sort((a, b) => a.dt - b.dt)
        .slice(0, 2)

      const formatTime = (dt: number) => {
        return new Date(dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }

      const normalizeType = (t: 'High' | 'Low') => (t === 'High' ? 'Alta' : 'Baixa')

      setTideNext(
        nextExtremes[0]
          ? {
              time: formatTime(nextExtremes[0].dt),
              type: normalizeType(nextExtremes[0].type),
              height: Number(nextExtremes[0].height.toFixed(2))
            }
          : null
      )

      setTideAfterNext(
        nextExtremes[1]
          ? {
              time: formatTime(nextExtremes[1].dt),
              type: normalizeType(nextExtremes[1].type),
              height: Number(nextExtremes[1].height.toFixed(2))
            }
          : null
      )

      // Tendência aproximada: se a próxima maré for "Alta", estamos em enchente; se for "Baixa", vazante
      if (nextExtremes[0]) {
        setTideStatus(nextExtremes[0].type === 'High' ? 'Enchente' : 'Vazante')
      } else {
        setTideStatus(null)
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao buscar marés'
      setTideError(message)
    } finally {
      setTideLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab !== 'weather') return
    if (tideLoading) return
    if (tideCurrentHeight !== null || tideNext !== null || tideError) return

    if (!('geolocation' in navigator)) {
      setTideError('Geolocalização não suportada neste dispositivo/navegador.')
      return
    }

    setTideLoading(true)
    setTideError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTideLoading(false)
        fetchTidesForLocation(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => {
        setTideLoading(false)
        if (err.code === err.PERMISSION_DENIED) {
          setTideError('Permissão de localização negada. Habilite para ver as marés automaticamente.')
        } else {
          setTideError('Não foi possível obter sua localização para calcular as marés.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [activeTab, fetchTidesForLocation, tideCurrentHeight, tideError, tideLoading, tideNext])

  // V2.0 - Photo Gallery Data
  const [photoGallery] = useState<PhotoGallery[]>([
    { id: 1, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', catchId: 1, date: '2026-02-15' },
    { id: 2, url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', catchId: 2, date: '2026-02-14' },
    { id: 3, url: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400', catchId: 1, date: '2026-02-13' },
    { id: 4, url: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400', catchId: 3, date: '2026-02-12' }
  ])


  // Championships Data
  const [championships] = useState<Championship[]>([
    { id: 1, name: 'São Paulo Bass Championship 2026', location: 'Represa Billings', date: '2026-03-15', prize: 'R$ 10,000', participants: 45, maxParticipants: 50, status: 'open' },
    { id: 2, name: 'Guarapiranga Fishing Tournament', location: 'Represa Guarapiranga', date: '2026-03-22', prize: 'R$ 5,000 + Equipments', participants: 32, maxParticipants: 40, status: 'open' },
    { id: 3, name: 'Winter Fishing Challenge', location: 'Pesqueiro Maeda', date: '2026-04-10', prize: 'R$ 8,000', participants: 28, maxParticipants: 35, status: 'open' },
    { id: 4, name: 'Taboão Lake Masters', location: 'Lago do Taboão', date: '2026-02-25', prize: 'R$ 3,000', participants: 25, maxParticipants: 25, status: 'ongoing' }
  ])

  // Sponsors Data
  const [sponsors] = useState<Sponsor[]>([
    { id: 1, name: 'Pesca & Cia', type: 'store', logo: '🏪', description: 'Complete fishing equipment store with 20% discount for members', discount: '20% OFF' },
    { id: 2, name: 'Marine Pro', type: 'factory', logo: '🏭', description: 'Premium fishing rods and reels manufacturer', discount: '15% OFF' },
    { id: 3, name: 'FishTech', type: 'factory', logo: '⚙️', description: 'Advanced fishing electronics and accessories' },
    { id: 4, name: 'Troféu Dourado', type: 'prize', logo: '🏆', description: 'Official championship prizes and awards supplier' },
    { id: 5, name: 'Anzol Forte', type: 'store', logo: '🎣', description: 'Hooks, lines, and baits specialist', discount: '10% OFF' }
  ])

  // Subscription Plans Data
  const [subscriptionPlans] = useState<SubscriptionPlan[]>([
    { 
      id: 1, 
      name: 'Free', 
      price: 'R$ 0/month', 
      features: ['Basic catch logging', 'View public spots', 'Community forum access', 'Up to 10 photos']
    },
    { 
      id: 2, 
      name: 'Pro', 
      price: 'R$ 19.90/month', 
      features: ['Unlimited catch logging', 'Advanced statistics', 'AI Fish Scanner', 'Unlimited photos', 'Priority support', 'Ad-free experience'],
      popular: true
    },
    { 
      id: 3, 
      name: 'Premium', 
      price: 'R$ 39.90/month', 
      features: ['All Pro features', 'Championship registration', 'Exclusive sponsor discounts', 'Weather predictions', 'Private fishing groups', 'Coaching sessions']
    }
  ])

  const [newCatch, setNewCatch] = useState({
    species: '',
    weight: '',
    length: '',
    location: '',
    weather: ''
  })

  const handleAddCatch = useCallback(() => {
    if (newCatch.species && newCatch.weight && newCatch.length && newCatch.location) {
      const now = new Date()
      const catchData: Catch = {
        id: catches.length + 1,
        species: newCatch.species,
        weight: parseFloat(newCatch.weight),
        length: parseFloat(newCatch.length),
        location: newCatch.location,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        weather: newCatch.weather || 'Não informado'
      }
      setCatches([catchData, ...catches])
      setNewCatch({ species: '', weight: '', length: '', location: '', weather: '' })
      setShowAddCatch(false)
    }
  }, [newCatch, catches])

  // Close registration modal when tab changes
  useEffect(() => {
    if (showAddCatch) {
      setShowAddCatch(false)
    }
  }, [activeTab])

  // Close tips menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showTips && !target.closest('.tips-container')) {
        setShowTips(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTips])

  // Memoize computed values to avoid recalculation on every render
  const totalCatches = useMemo(() => catches.length, [catches])
  const totalWeight = useMemo(() => catches.reduce((sum, c) => sum + c.weight, 0), [catches])
  const avgWeight = useMemo(() => totalCatches > 0 ? (totalWeight / totalCatches).toFixed(1) : 0, [totalCatches, totalWeight])
  const biggestCatch = useMemo(() => catches.length > 0 ? Math.max(...catches.map(c => c.weight)) : 0, [catches])
  
  // Memoize sorted spots to avoid sorting on every render
  const sortedSpots = useMemo(() => [...spots].sort((a, b) => a.distance - b.distance), [spots])
  const nearestSpot = useMemo(() => sortedSpots[0], [sortedSpots])
  
  // Memoize fish species list
  const fishSpecies = useMemo(() => ['Tilápia', 'Traíra', 'Lambari', 'Tucunaré', 'Corvina', 'Robalo', 'Pacu', 'Pintado', 'Dourado', 'Bagre', 'Carpa', 'Piracanjuba', 'Curimbatá', 'Mandi', 'Cascudo'], [])

  return (
    <div className="min-h-screen pb-24 relative" style={{ background: "linear-gradient(180deg, hsl(200 60% 85%) 0%, hsl(175 50% 70%) 100%)" }}>
      {/* Background Image with Opacity and Wave Animation */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center ocean-wave"
        style={{ 
          backgroundImage: "url('/Fundo.jpg')",
          opacity: 0.3
        }}
      />
      
      {activeTab === 'home' && (
        <div className="max-w-lg mx-auto relative z-10" style={{ padding: '5mm' }}>
          {/* Hero Section - Compact */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Anchor className="w-4 h-4 text-gray-700/70" />
                <span className="text-[10px] font-medium text-gray-700/70 tracking-wider uppercase">Good Fishing!</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Fisher's Guidapp<span className="text-gray-700 text-sm ml-2">v2.0</span>
              </h1>
            </div>
            
            {/* Tips Button */}
            <div className="relative tips-container">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-10 h-10 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                style={{
                  background: "transparent",
                  color: "hsl(210 80% 45%)"
                }}
              >
                <Info className="w-6 h-6" strokeWidth={2.5} />
              </button>
              
              {/* Tips Dropdown Menu */}
              {showTips && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden z-50">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3">
                    <h3 className="font-bold text-sm">📚 Fishing Tips</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <a
                      href="https://www.youtube.com/results?search_query=nós+de+pesca+tutorial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    >
                      <div className="font-semibold text-gray-800 text-sm">🪢 Nós de Pesca</div>
                      <div className="text-xs text-gray-500 mt-0.5">Aprenda os principais nós</div>
                    </a>
                    <a
                      href="https://www.youtube.com/results?search_query=como+escolher+molinete+pesca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    >
                      <div className="font-semibold text-gray-800 text-sm">🎣 Molinetes e Carretilhas</div>
                      <div className="text-xs text-gray-500 mt-0.5">Como escolher o ideal</div>
                    </a>
                    <a
                      href="https://www.youtube.com/results?search_query=tipos+de+linha+de+pesca+nylon+multifilamento"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    >
                      <div className="font-semibold text-gray-800 text-sm">🧵 Linhas e Fios</div>
                      <div className="text-xs text-gray-500 mt-0.5">Nylon, multifilamento e mais</div>
                    </a>
                    <a
                      href="https://www.youtube.com/results?search_query=como+escolher+vara+de+pesca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    >
                      <div className="font-semibold text-gray-800 text-sm">🎋 Varas de Pesca</div>
                      <div className="text-xs text-gray-500 mt-0.5">Tipos e características</div>
                    </a>
                    <a
                      href="https://www.youtube.com/results?search_query=iscas+artificiais+para+pesca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    >
                      <div className="font-semibold text-gray-800 text-sm">🐟 Iscas Artificiais</div>
                      <div className="text-xs text-gray-500 mt-0.5">Tipos e quando usar</div>
                    </a>
                    <a
                      href="https://www.youtube.com/results?search_query=técnicas+de+arremesso+pesca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    >
                      <div className="font-semibold text-gray-800 text-sm">💪 Técnicas de Arremesso</div>
                      <div className="text-xs text-gray-500 mt-0.5">Melhore sua precisão</div>
                    </a>
                    <a
                      href="https://www.youtube.com/results?search_query=manutenção+equipamento+pesca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    >
                      <div className="font-semibold text-gray-800 text-sm">🔧 Manutenção de Equipamentos</div>
                      <div className="text-xs text-gray-500 mt-0.5">Cuide do seu material</div>
                    </a>
                    <a
                      href="https://www.youtube.com/results?search_query=leitura+de+água+pesca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-semibold text-gray-800 text-sm">🌊 Leitura de Água</div>
                      <div className="text-xs text-gray-500 mt-0.5">Encontre os melhores pontos</div>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Action Buttons - Large Square Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setShowAddCatch(true)}
              className="aspect-square bg-white/60 backdrop-blur-md rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/50"
            >
              <Plus className="w-10 h-10 text-blue-600" strokeWidth={2.5} />
              <span className="text-xs font-bold text-gray-800">Register</span>
            </button>

            <button
              onClick={() => setActiveTab('catches')}
              className="aspect-square bg-white/60 backdrop-blur-md rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/50"
            >
              <Fish className="w-10 h-10 text-blue-600" strokeWidth={2} />
              <span className="text-xs font-bold text-gray-800">Catches</span>
            </button>

            <button
              onClick={() => setActiveTab('spots')}
              className="aspect-square bg-white/60 backdrop-blur-md rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/50"
            >
              <MapPin className="w-10 h-10 text-blue-600" strokeWidth={2} />
              <span className="text-xs font-bold text-gray-800">Spots</span>
            </button>
          </div>

          {/* Friends Gallery Icons - Small Icons Row */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Friends Gallery</h3>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => {
                  const mostRecent = photoGallery.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  setSelectedPhoto(mostRecent);
                }}
                className="w-16 h-16 bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 hover:scale-105 transition-all relative"
              >
                {photoGallery.length > 0 && (
                  <>
                    <img 
                      src={photoGallery.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].url}
                      alt="Most recent"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Image className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('leagues')}
                className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-gray-100 hover:scale-105 transition-all"
              >
                <Trophy className="w-7 h-7 text-amber-500" />
              </button>
              <button 
                onClick={() => setShowFriendsGallery(true)}
                className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-gray-100 hover:scale-105 transition-all"
              >
                <Users className="w-7 h-7 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Photo Gallery - Grid Layout */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-700">Gallery</h3>
              <button 
                onClick={() => setShowAIScanner(true)}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Scan className="w-4 h-4" />
                AI Scan
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {photoGallery.map((photo) => (
                <div 
                  key={photo.id} 
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer aspect-square"
                >
                  <img 
                    src={photo.url} 
                    alt={`Catch ${photo.catchId}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                    <p className="text-white text-[9px] font-semibold">{new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'weather' && (
        <div className="pb-20 max-w-2xl mx-auto" style={{ padding: '5mm' }}>
          <div className="bg-gradient-to-r from-sky-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Cloud className="w-7 h-7" />
              Clima & Condições
            </h1>
            <p className="text-sky-100 text-sm mt-1">Acompanhe as condições para a sua próxima pescaria</p>
          </div>

          <div className="mt-4">
            <div
              className="rounded-2xl border-2 p-4"
              style={{
                background: "hsl(210 70% 20%)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Fish className="w-4 h-4" style={{ color: "hsl(195 80% 55%)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>Condições de Pesca</h3>
                <span
                  className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: "hsl(150 50% 40% / 0.3)",
                    color: "hsl(150 60% 60%)"
                  }}
                >
                  {fishingCondition}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center gap-0.5">
                  <Cloud className="w-4 h-4" style={{ color: "hsl(38 85% 60%)" }} />
                  <span className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>Temp</span>
                  <span className="text-xs font-semibold" style={{ color: "hsl(45 20% 95%)" }}>{weather.temp}°</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Droplets className="w-4 h-4" style={{ color: "hsl(195 80% 55%)" }} />
                  <span className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>Umid</span>
                  <span className="text-xs font-semibold" style={{ color: "hsl(45 20% 95%)" }}>{weather.humidity}%</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Wind className="w-4 h-4" style={{ color: "hsl(150 50% 50%)" }} />
                  <span className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>Vento</span>
                  <span className="text-xs font-semibold" style={{ color: "hsl(45 20% 95%)" }}>{weather.windSpeed}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Sunrise className="w-4 h-4" style={{ color: "hsl(38 85% 60%)" }} />
                  <span className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>Nascer</span>
                  <span className="text-xs font-semibold" style={{ color: "hsl(45 20% 95%)" }}>{sunrise}</span>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border-2 p-4 mt-3"
              style={{
                background: "hsl(210 65% 18%)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Anchor className="w-4 h-4" style={{ color: "hsl(195 80% 55%)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>Marés</h3>
                {tideStatus && (
                  <span
                    className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "hsl(195 70% 35% / 0.35)",
                      color: "hsl(195 85% 70%)"
                    }}
                  >
                    {tideStatus}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl p-3" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
                  <p className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>Altura atual</p>
                  {tideLoading ? (
                    <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>Carregando...</p>
                  ) : tideCurrentHeight !== null ? (
                    <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>{tideCurrentHeight} m</p>
                  ) : (
                    <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>—</p>
                  )}
                </div>
                <div className="rounded-xl p-3" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
                  <p className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>Próxima maré</p>
                  {tideLoading ? (
                    <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>Carregando...</p>
                  ) : tideNext ? (
                    <>
                      <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>{tideNext.type} • {tideNext.time}</p>
                      <p className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>{tideNext.height} m</p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>—</p>
                  )}
                </div>
                <div className="rounded-xl p-3" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
                  <p className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>Depois</p>
                  {tideLoading ? (
                    <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>Carregando...</p>
                  ) : tideAfterNext ? (
                    <>
                      <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>{tideAfterNext.type} • {tideAfterNext.time}</p>
                      <p className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>{tideAfterNext.height} m</p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold" style={{ color: "hsl(45 20% 95%)" }}>—</p>
                  )}
                </div>
                <div className="rounded-xl p-3" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
                  <p className="text-[10px]" style={{ color: "hsl(210 15% 65%)" }}>Dica</p>
                  {tideError ? (
                    <p className="text-[11px]" style={{ color: "hsl(45 20% 95%)" }}>{tideError}</p>
                  ) : (
                    <p className="text-[11px]" style={{ color: "hsl(45 20% 95%)" }}>Em áreas costeiras, a troca de maré costuma ativar a pesca.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'catches' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Fish className="w-7 h-7" />
              Minhas Capturas
            </h1>
            <p className="text-blue-100 text-sm mt-1">{totalCatches} peixes registrados</p>
          </div>

          <div className="p-4 space-y-3">
            {catches.map((catch_) => (
              <div key={catch_.id} className="bg-white p-4 rounded-2xl shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{catch_.species}</h3>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {catch_.weight} kg
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-600" />
                    <span>{catch_.length} cm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-600" />
                    <span>{catch_.weather}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {catch_.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(catch_.date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {catch_.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'spots' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-7 h-7" />
              Pontos de Pesca
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              {spots.length} locais cadastrados • Mais próximo: {nearestSpot.name} ({nearestSpot.distance} km)
            </p>
          </div>

          <div className="p-4 space-y-3">
            {sortedSpots.map((spot, index) => (
              <div key={spot.id} className="bg-white p-5 rounded-2xl shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-800">{spot.name}</h3>
                      <span className="text-sm font-semibold text-blue-600">{spot.distance} km</span>
                      {index === 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          Mais próximo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{spot.catches} capturas registradas</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-bold text-gray-700">{spot.rating}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full bg-blue-800 text-white py-2 rounded-xl font-semibold hover:bg-blue-900 transition-colors active:scale-95"
                >
                  Ver no Mapa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-7 h-7" />
              Estatísticas
            </h1>
            <p className="text-green-100 text-sm mt-1">Seu desempenho na pesca</p>
          </div>

          <div className="p-4 space-y-4">
            {/* Profile Photo Bubble */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div 
                  className="bubble-button rounded-full w-24 h-24 flex items-center justify-center overflow-hidden"
                  style={{ 
                    background: "hsl(195 70% 65%)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 -2px 8px rgba(0, 0, 0, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.3)"
                  }}
                >
                  <svg 
                    className="w-12 h-12 relative z-10" 
                    viewBox="0 0 24 24" 
                    fill="hsl(200 15% 75%)"
                    opacity="0.8"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                {/* Camera icon button */}
                <button
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: "hsl(195 80% 45%)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    border: "2px solid white"
                  }}
                  onClick={() => {
                    // Trigger file input
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.click();
                  }}
                >
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Pescador</h2>
                <p className="text-sm text-gray-500">Membro desde 2026</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-5 rounded-2xl shadow-md text-center">
                <Fish className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-800">{totalCatches}</p>
                <p className="text-sm text-gray-500">Total de Capturas</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md text-center">
                <Weight className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-800">{avgWeight}</p>
                <p className="text-sm text-gray-500">Peso Médio (kg)</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Recordes
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <span className="text-gray-700">Maior Captura</span>
                  <span className="font-bold text-green-700">{biggestCatch} kg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-gray-700">Peso Total</span>
                  <span className="font-bold text-blue-700">{totalWeight.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-gray-700">Locais Visitados</span>
                  <span className="font-bold text-purple-700">{spots.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-3">Espécies Mais Capturadas</h3>
              <div className="space-y-2">
                {Array.from(new Set(catches.map(c => c.species))).map((species, idx) => {
                  const count = catches.filter(c => c.species === species).length
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">{species}</span>
                      <span className="font-bold text-gray-800">{count}x</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Subscription Plans Section */}
            <div className="mt-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 rounded-t-2xl">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Planos de Assinatura
                </h3>
                <p className="text-purple-100 text-sm mt-1">Escolha o plano ideal para você</p>
              </div>
              
              <div className="space-y-3 mt-3">
                {subscriptionPlans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow ${
                      plan.popular ? 'ring-2 ring-purple-500 relative' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          ⭐ MAIS POPULAR
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{plan.name}</h4>
                        <p className="text-2xl font-bold text-purple-600 mt-1">{plan.price}</p>
                      </div>
                      {plan.popular && (
                        <Trophy className="w-8 h-8 text-amber-500" />
                      )}
                    </div>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-500 font-bold mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      className={`w-full py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {plan.id === 1 ? 'Plano Atual' : 'Assinar Agora'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leagues Tab - Coming Soon */}
      {activeTab === 'leagues' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7" />
              Ligas de Pesca
            </h1>
            <p className="text-amber-100 text-sm mt-1">Competições e rankings entre pescadores</p>
          </div>

          <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-amber-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Em Breve!</h2>
              <p className="text-gray-600 mb-6">
                Estamos preparando as ligas de pesca para você competir com amigos e pescadores do mundo todo.
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 p-4 rounded-xl text-left">
                  <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Liga dos Amigos
                  </h3>
                  <p className="text-sm text-gray-700">Compete com seus amigos pescadores e veja quem é o melhor!</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl text-left">
                  <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <Weight className="w-5 h-5" />
                    Liga por Kg
                  </h3>
                  <p className="text-sm text-gray-700">Ranking baseado no peso total das suas capturas.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold">
                🚀 Lançamento em breve
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community/Forum Tab - Coming Soon */}
      {activeTab === 'community' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-7 h-7" />
              Fórum da Comunidade
            </h1>
            <p className="text-purple-100 text-sm mt-1">Compartilhe experiências e aprenda com outros pescadores</p>
          </div>

          <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-12 h-12 text-purple-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Em Breve!</h2>
              <p className="text-gray-600 mb-6">
                Estamos criando um espaço para você compartilhar dicas, histórias e se conectar com outros pescadores.
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-purple-50 p-4 rounded-xl text-left">
                  <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Posts e Discussões
                  </h3>
                  <p className="text-sm text-gray-700">Compartilhe suas experiências e aprenda com a comunidade.</p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl text-left">
                  <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Conecte-se
                  </h3>
                  <p className="text-sm text-gray-700">Faça amizade com pescadores da sua região e marque pescarias.</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl text-left">
                  <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Dicas e Técnicas
                  </h3>
                  <p className="text-sm text-gray-700">Aprenda novas técnicas e descubra os melhores spots.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold">
                🚀 Lançamento em breve
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Championships Tab */}
      {activeTab === 'championships' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white p-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Wrench className="w-7 h-7" />
              Equipamentos
            </h1>
            <p className="text-xs text-orange-100 mt-1">Escolha o equipamento adequado</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Varas de Pesca
              </h3>
              <div className="space-y-3">
                <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-900 mb-2">Vara de Molinete</h4>
                  <p className="text-sm text-gray-700 mb-2">Ideal para iniciantes. Versátil para diversas técnicas.</p>
                  <p className="text-xs text-gray-600">Tamanho: 1,80m - 2,70m | Ação: Média</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 mb-2">Vara de Carretilha</h4>
                  <p className="text-sm text-gray-700 mb-2">Para pescadores experientes. Maior precisão no arremesso.</p>
                  <p className="text-xs text-gray-600">Tamanho: 1,50m - 2,40m | Ação: Rápida</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">Vara de Fly</h4>
                  <p className="text-sm text-gray-700 mb-2">Pesca com mosca. Técnica específica para rios.</p>
                  <p className="text-xs text-gray-600">Tamanho: 2,40m - 3,00m | Ação: Leve</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3">Molinete vs Carretilha</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-xl">
                  <p className="font-bold text-green-800 mb-2">✓ Molinete</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Fácil de usar</li>
                    <li>• Menos emaranhados</li>
                    <li>• Ótimo para iniciantes</li>
                    <li>• Versátil</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <p className="font-bold text-blue-800 mb-2">✓ Carretilha</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Mais precisa</li>
                    <li>• Maior controle</li>
                    <li>• Peixes maiores</li>
                    <li>• Requer prática</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Linhas e Anzóis
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900 mb-1">Linha Monofilamento</p>
                  <p className="text-xs text-gray-600">0,25mm - 0,50mm | Resistência: 6-20kg</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="font-semibold text-indigo-900 mb-1">Linha Multifilamento</p>
                  <p className="text-xs text-gray-600">0,15mm - 0,40mm | Maior sensibilidade</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                  <p className="font-semibold text-pink-900 mb-1">Anzóis</p>
                  <p className="text-xs text-gray-600">Tamanhos: #2 a #10 | Escolha conforme o peixe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {activeTab === 'baits' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Worm className="w-7 h-7" />
              Iscas
            </h1>
            <p className="text-xs text-green-100 mt-1">Naturais e artificiais</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Iscas Naturais
              </h3>
              <div className="space-y-2">
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-900">🪱 Minhocas</h4>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Universal</span>
                  </div>
                  <p className="text-sm text-gray-700">Excelente para água doce. Atrai diversas espécies.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-orange-900">🦐 Camarões</h4>
                    <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">Mar</span>
                  </div>
                  <p className="text-sm text-gray-700">Ideal para pesca marítima. Robalos e corvinas adoram.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-900">🐟 Lambaris</h4>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Predadores</span>
                  </div>
                  <p className="text-sm text-gray-700">Para peixes grandes. Traíras, dourados e tucunarés.</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-yellow-900">🌽 Milho/Massa</h4>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Pacíficos</span>
                  </div>
                  <p className="text-sm text-gray-700">Carpas, tilápias e pacus. Econômico e eficaz.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" />
                Iscas Artificiais
              </h3>
              <div className="space-y-2">
                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-900 mb-2">🎣 Plugs</h4>
                  <p className="text-sm text-gray-700 mb-2">Imitam peixes. Diversos modelos e cores.</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-red-100 px-2 py-1 rounded">Meia-água</span>
                    <span className="text-xs bg-red-100 px-2 py-1 rounded">Superfície</span>
                    <span className="text-xs bg-red-100 px-2 py-1 rounded">Fundo</span>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-purple-900 mb-2">🎯 Jigs</h4>
                  <p className="text-sm text-gray-700 mb-2">Cabeça de chumbo com silicone. Versátil.</p>
                  <p className="text-xs text-gray-600">Ideal para: Robalos, garoupas, badejos</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-cyan-900 mb-2">🌀 Spinners</h4>
                  <p className="text-sm text-gray-700 mb-2">Colheres giratórias que refletem luz.</p>
                  <p className="text-xs text-gray-600">Ideal para: Traíras, black bass, tucunarés</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-pink-900 mb-2">🦑 Soft Baits</h4>
                  <p className="text-sm text-gray-700 mb-2">Iscas de silicone macias e realistas.</p>
                  <p className="text-xs text-gray-600">Ideal para: Diversos predadores</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-4 border-2 border-amber-300">
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                💡 Dica Importante
              </h4>
              <p className="text-sm text-gray-800">Varie as iscas até encontrar a preferida dos peixes no dia. Condições climáticas e horário influenciam na escolha.</p>
            </div>
          </div>
        </div>
      )}

      */ } {/* {activeTab === 'times' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-pink-700 text-white p-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Timer className="w-7 h-7" />
              Horários Estratégicos
            </h1>
            <p className="text-xs text-purple-100 mt-1">Melhores momentos para pescar</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Sunrise className="w-8 h-8" />
                <div>
                  <h3 className="font-bold text-lg">Amanhecer</h3>
                  <p className="text-sm opacity-90">05:00 - 08:00</p>
                </div>
              </div>
              <p className="text-sm mb-2">⭐ Horário PREMIUM para pesca!</p>
              <p className="text-sm opacity-90">Peixes estão mais ativos e famintos após a noite. Temperatura agradável e menos movimento.</p>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Sunset className="w-8 h-8" />
                <div>
                  <h3 className="font-bold text-lg">Entardecer</h3>
                  <p className="text-sm opacity-90">17:00 - 19:30</p>
                </div>
              </div>
              <p className="text-sm mb-2">⭐ Horário PREMIUM para pesca!</p>
              <p className="text-sm opacity-90">Segunda melhor opção. Peixes se alimentam antes do anoitecer. Luz baixa favorece predadores.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Outros Horários
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-yellow-900">☀️ Meio-dia (11:00-14:00)</p>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Regular</span>
                  </div>
                  <p className="text-xs text-gray-600">Sol forte. Peixes buscam sombra e profundidade. Menos produtivo.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-blue-900">🌙 Noite (20:00-23:00)</p>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Bom</span>
                  </div>
                  <p className="text-xs text-gray-600">Predadores noturnos ativos. Requer equipamento adequado e cuidado.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Moon className="w-5 h-5 text-purple-600" />
                Influência da Lua
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 text-white p-3 rounded-xl text-center">
                  <p className="text-2xl mb-1">🌑</p>
                  <p className="font-semibold text-sm">Lua Nova</p>
                  <p className="text-xs opacity-75 mt-1">Ótimo</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-xl text-center">
                  <p className="text-2xl mb-1">🌓</p>
                  <p className="font-semibold text-sm">Crescente</p>
                  <p className="text-xs text-gray-600 mt-1">Bom</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl text-center">
                  <p className="text-2xl mb-1">🌕</p>
                  <p className="font-semibold text-sm">Lua Cheia</p>
                  <p className="text-xs text-gray-600 mt-1">Excelente</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-xl text-center">
                  <p className="text-2xl mb-1">🌗</p>
                  <p className="font-semibold text-sm">Minguante</p>
                  <p className="text-xs text-gray-600 mt-1">Regular</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-4 border-2 border-cyan-300">
              <h4 className="font-bold text-cyan-900 mb-2">📅 Dias da Semana</h4>
              <p className="text-sm text-gray-800 mb-2">Dias úteis geralmente são melhores que finais de semana devido ao menor movimento de pessoas.</p>
              <p className="text-xs text-gray-700">Menos barulho = mais peixes!</p>
            </div>
          </div>
        </div>
      )}

      */ } {/* {activeTab === 'techniques' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-7 h-7" />
              Técnicas e Paciência
            </h1>
            <p className="text-xs text-blue-100 mt-1">Domine as técnicas de pesca</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Arremesso
              </h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">1. Posicionamento</h4>
                  <p className="text-sm text-gray-700">Pés afastados na largura dos ombros. Corpo levemente inclinado para trás.</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-indigo-900 mb-2">2. Movimento</h4>
                  <p className="text-sm text-gray-700">Leve a vara para trás suavemente. Acelere para frente com pulso firme.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-purple-900 mb-2">3. Soltura</h4>
                  <p className="text-sm text-gray-700">Solte a linha no momento certo (45° de elevação). Mire o alvo.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-600" />
                Recolhimento
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <p className="font-semibold text-cyan-900 mb-1">🎣 Recolhimento Lento</p>
                  <p className="text-xs text-gray-600">Para peixes calmos. Deixe a isca trabalhar naturalmente.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-1">⚡ Recolhimento Rápido</p>
                  <p className="text-xs text-gray-600">Provoca predadores. Simula peixe fugindo.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900 mb-1">🔄 Stop and Go</p>
                  <p className="text-xs text-gray-600">Alterna velocidades. Recolhe e para. Muito efetivo!</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                  <p className="font-semibold text-pink-900 mb-1">💫 Twitching</p>
                  <p className="text-xs text-gray-600">Pequenos toques na ponta da vara. Isca vibra.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Fish className="w-5 h-5 text-green-600" />
                Fisgada
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300">
                <p className="font-semibold text-green-900 mb-3">Momento Crucial!</p>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2"><span className="font-bold text-green-700">1.</span> Sinta a batida do peixe na linha</li>
                  <li className="flex gap-2"><span className="font-bold text-green-700">2.</span> Aguarde 1-2 segundos (não fique ansioso!)</li>
                  <li className="flex gap-2"><span className="font-bold text-green-700">3.</span> Puxe a vara com firmeza para cima</li>
                  <li className="flex gap-2"><span className="font-bold text-green-700">4.</span> Mantenha a linha sempre esticada</li>
                  <li className="flex gap-2"><span className="font-bold text-green-700">5.</span> Recolha com calma e constância</li>
                </ol>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Paciência é Fundamental
              </h3>
              <div className="space-y-3">
                <div className="bg-orange-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">🧘 <strong>Mantenha a calma:</strong> Pesca é sobre esperar o momento certo.</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">🎯 <strong>Observe o ambiente:</strong> Movimentos na água, pássaros mergulhando.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">🔄 <strong>Varie as técnicas:</strong> Se não está funcionando, mude de estratégia.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">📚 <strong>Aprenda sempre:</strong> Cada pescaria ensina algo novo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      */ } {/* {activeTab === 'environment' && (
        <div className="pb-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-green-700 to-teal-700 text-white p-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Leaf className="w-7 h-7" />
              Respeito ao Meio Ambiente
            </h1>
            <p className="text-xs text-green-100 mt-1">Pesca sustentável e consciente</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <h3 className="font-bold text-xl mb-2">🌍 Preserve para o Futuro</h3>
              <p className="text-sm opacity-90">A pesca sustentável garante que as próximas gerações também possam desfrutar deste esporte.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Não Deixe Lixo
              </h3>
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                  <p className="font-semibold text-red-900 mb-2">❌ Nunca Deixe</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Linhas de pesca (podem matar animais)</li>
                    <li>• Embalagens de iscas</li>
                    <li>• Garrafas e latas</li>
                    <li>• Pontas de cigarro</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                  <p className="font-semibold text-green-900 mb-2">✅ Sempre Faça</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Leve sacolas para lixo</li>
                    <li>• Recolha tudo que trouxe</li>
                    <li>• Deixe o local melhor que encontrou</li>
                    <li>• Recolha lixo de outros se possível</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-600" />
                Tamanhos Mínimos de Captura
              </h3>
              <p className="text-sm text-gray-700 mb-3">Respeite os tamanhos mínimos para permitir reprodução das espécies.</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-gray-800">Robalo</span>
                  <span className="text-sm bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-bold">25 cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-gray-800">Corvina</span>
                  <span className="text-sm bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-bold">30 cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-gray-800">Dourado</span>
                  <span className="text-sm bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-bold">55 cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-gray-800">Tucunaré</span>
                  <span className="text-sm bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-bold">25 cm</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 italic">* Tamanhos podem variar por região. Consulte legislação local.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Fish className="w-5 h-5 text-cyan-600" />
                Pesque e Solte
              </h3>
              <div className="bg-cyan-50 p-4 rounded-xl">
                <p className="text-sm text-gray-700 mb-3">O <strong>Pesque e Solte</strong> é uma prática sustentável que preserva as espécies.</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">1.</span>
                    <p className="text-sm text-gray-700">Use anzóis sem farpa ou amasse a farpa</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">2.</span>
                    <p className="text-sm text-gray-700">Molhe as mãos antes de tocar no peixe</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">3.</span>
                    <p className="text-sm text-gray-700">Remova o anzol rapidamente e com cuidado</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">4.</span>
                    <p className="text-sm text-gray-700">Solte o peixe na água com delicadeza</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">5.</span>
                    <p className="text-sm text-gray-700">Aguarde até ele nadar por conta própria</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Conheça a Legislação
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900 mb-1">📋 Licença de Pesca</p>
                  <p className="text-xs text-gray-600">Obrigatória em muitas regiões. Verifique as regras locais.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-900 mb-1">🚫 Período de Defeso</p>
                  <p className="text-xs text-gray-600">Época de reprodução. Pesca proibida para algumas espécies.</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-900 mb-1">⚠️ Áreas Protegidas</p>
                  <p className="text-xs text-gray-600">Respeite parques e reservas ambientais.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-100 to-green-100 rounded-2xl p-4 border-2 border-teal-400">
              <h4 className="font-bold text-teal-900 mb-2 flex items-center gap-2">
                💚 Seja um Pescador Consciente
              </h4>
              <p className="text-sm text-gray-800">Eduque outros pescadores, denuncie práticas ilegais e seja exemplo de respeito à natureza.</p>
            </div>
          </div>
        </div>
      )}

      {/* Championships Tab */}
      {activeTab === 'championships' && (
        <div className="pb-20 max-w-2xl mx-auto p-4">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7" />
              Campeonatos Presenciais
            </h1>
            <p className="text-green-100 text-sm mt-1">Inscreva-se em torneios e competições</p>
          </div>

          <div className="space-y-4 mt-4">
            {championships.map((championship) => (
              <div key={championship.id} className="bg-white rounded-xl p-5 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{championship.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{championship.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(championship.date).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    championship.status === 'open' ? 'bg-green-100 text-green-700' :
                    championship.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {championship.status === 'open' ? '🟢 Aberto' : championship.status === 'ongoing' ? '🔵 Em Andamento' : '🔴 Fechado'}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold">Prêmio: {championship.prize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    <span className="font-semibold">{championship.participants}/{championship.maxParticipants}</span> participantes
                  </div>
                  <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-2 ml-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${(championship.participants / championship.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>

                {championship.status === 'open' && (
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-md">
                    Inscrever-se Agora
                  </button>
                )}
                {championship.status === 'ongoing' && (
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-md">
                    Ver Resultados ao Vivo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sponsors Tab */}
      {activeTab === 'sponsors' && (
        <div className="pb-20 max-w-2xl mx-auto p-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-7 h-7" />
              Patrocinadores & Parceiros
            </h1>
            <p className="text-indigo-100 text-sm mt-1">Descontos exclusivos e parcerias</p>
          </div>

          <div className="space-y-3 mt-4">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                    {sponsor.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-800">{sponsor.name}</h3>
                      {sponsor.discount && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {sponsor.discount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        sponsor.type === 'store' ? 'bg-blue-100 text-blue-700' :
                        sponsor.type === 'factory' ? 'bg-purple-100 text-purple-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {sponsor.type === 'store' ? '🏪 Loja' : sponsor.type === 'factory' ? '🏭 Fábrica' : '🏆 Prêmios'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{sponsor.description}</p>
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition-all">
                      Ver Ofertas
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="pb-20 max-w-2xl mx-auto p-4">
          <div className="bg-gradient-to-r from-pink-600 to-rose-700 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-7 h-7" />
              Assinatura Premium
            </h1>
            <p className="text-pink-100 text-sm mt-1">Desbloqueie recursos e benefícios exclusivos</p>
          </div>

          <div className="space-y-4 mt-4">
            {subscriptionPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-xl p-5 shadow-md relative ${
                  plan.popular ? 'ring-2 ring-pink-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ MAIS POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4 mt-2">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-pink-600 mb-1">{plan.price}</div>
                </div>

                <div className="space-y-3 mb-5">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-md ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                    : plan.name === 'Free'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                }`}>
                  {plan.name === 'Free' ? 'Plano Atual' : 'Assinar Agora'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends Gallery Modal */}
      {showFriendsGallery && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowFriendsGallery(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-3xl z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="w-7 h-7" />
                    Galeria dos Amigos
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">Fotos de capturas dos pescadores conectados</p>
                </div>
                <button
                  onClick={() => setShowFriendsGallery(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Friend 1 - John Fisher */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    JF
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">John Fisher</h3>
                    <p className="text-sm text-gray-500">12 fotos • Conectado há 3 meses</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                  <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                  <img src="https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                </div>
              </div>

              {/* Friend 2 - Mike Waters */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    MW
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Mike Waters</h3>
                    <p className="text-sm text-gray-500">8 fotos • Conectado há 2 meses</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <img src="https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                  <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                  <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                </div>
              </div>

              {/* Friend 3 - Sarah Ocean */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    SO
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Sarah Ocean</h3>
                    <p className="text-sm text-gray-500">15 fotos • Conectado há 5 meses</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <img src="https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                  <img src="https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                  <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300" alt="Catch" className="w-full h-32 object-cover rounded-lg" />
                </div>
              </div>

              {/* Add Friends Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Adicionar Mais Amigos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Zoom Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            <img 
              src={selectedPhoto.url} 
              alt={`Catch ${selectedPhoto.catchId}`}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl">
              <p className="text-white text-lg font-bold">
                {new Date(selectedPhoto.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-gray-300 text-sm mt-1">Catch ID: #{selectedPhoto.catchId}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Scanner Modal */}
      {showAIScanner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowAIScanner(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Scan className="w-6 h-6 text-purple-600" />
                AI Fish Scanner
              </h2>
              <button
                onClick={() => setShowAIScanner(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-8 border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setTimeout(() => {
                        alert('AI Identified: Bass (Largemouth)\nConfidence: 94%\nWeight estimate: 2.3 kg\nLength estimate: 45 cm');
                        setShowAIScanner(false);
                      }, 1500);
                    }
                  }}
                />
                <div className="text-center">
                  <Camera className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                  <p className="text-gray-700 font-semibold mb-1">Take or Upload Photo</p>
                  <p className="text-sm text-gray-500">AI will identify the fish species</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>🤖</span>
                How it works
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Take a clear photo of the fish</li>
                <li>• AI analyzes species, size, and weight</li>
                <li>• Auto-fills catch registration form</li>
                <li>• 95%+ accuracy on common species</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAIScanner(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Open Camera
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ padding: '5mm' }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Nova Captura</h2>
              <button
                onClick={() => setShowAddCatch(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <select
                value={newCatch.species === '' || fishSpecies.includes(newCatch.species) ? newCatch.species : 'Outro'}
                onChange={(e) => {
                  if (e.target.value === 'Outro') {
                    setNewCatch({ ...newCatch, species: '' })
                  } else {
                    setNewCatch({ ...newCatch, species: e.target.value })
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Espécie do peixe</option>
                <option value="Tilápia">Tilápia</option>
                <option value="Traíra">Traíra</option>
                <option value="Lambari">Lambari</option>
                <option value="Tucunaré">Tucunaré</option>
                <option value="Corvina">Corvina</option>
                <option value="Robalo">Robalo</option>
                <option value="Pacu">Pacu</option>
                <option value="Pintado">Pintado</option>
                <option value="Dourado">Dourado</option>
                <option value="Bagre">Bagre</option>
                <option value="Carpa">Carpa</option>
                <option value="Piracanjuba">Piracanjuba</option>
                <option value="Curimbatá">Curimbatá</option>
                <option value="Mandi">Mandi</option>
                <option value="Cascudo">Cascudo</option>
                <option value="Outro">✏️ Outro (digitar)</option>
              </select>
              
              {(newCatch.species === '' || !fishSpecies.includes(newCatch.species)) && newCatch.species !== '' && (
                <input
                  type="text"
                  placeholder="Digite a espécie do peixe"
                  value={newCatch.species}
                  onChange={(e) => setNewCatch({ ...newCatch, species: e.target.value })}
                  className="w-full p-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50"
                  autoFocus
                />
              )}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Peso (kg)"
                  value={newCatch.weight}
                  onChange={(e) => setNewCatch({ ...newCatch, weight: e.target.value })}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="number"
                  placeholder="Comprimento (cm)"
                  value={newCatch.length}
                  onChange={(e) => setNewCatch({ ...newCatch, length: e.target.value })}
                  min="0"
                  step="1"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Local"
                value={newCatch.location}
                onChange={(e) => setNewCatch({ ...newCatch, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                type="text"
                placeholder="Clima (opcional)"
                value={newCatch.weather}
                onChange={(e) => setNewCatch({ ...newCatch, weather: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleAddCatch}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-95"
              >
                Adicionar Captura
              </button>
            </div>
          </div>
        </div>
      )}

      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{
          background: "hsl(210 25% 12% / 0.9)",
          backdropFilter: "blur(20px)",
          borderColor: "hsl(210 20% 20%)"
        }}
      >
        <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors"
            style={{ 
              color: activeTab === 'home' ? 'hsl(195 80% 45%)' : 'hsl(210 15% 55%)'
            }}
          >
            <Anchor className={`w-5 h-5 ${activeTab === 'home' ? 'drop-shadow-[0_0_6px_hsl(195_80%_45%/0.5)]' : ''}`} />
            <span className="text-[9px] font-medium">Início</span>
          </button>
          <button
            onClick={() => setActiveTab('leagues')}
            className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors"
            style={{ 
              color: activeTab === 'leagues' ? 'hsl(195 80% 45%)' : 'hsl(210 15% 55%)'
            }}
          >
            <Trophy className={`w-5 h-5 ${activeTab === 'leagues' ? 'drop-shadow-[0_0_6px_hsl(195_80%_45%/0.5)]' : ''}`} />
            <span className="text-[9px] font-medium">Ligas</span>
          </button>
          <button
            onClick={() => setActiveTab('championships')}
            className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors"
            style={{ 
              color: activeTab === 'championships' ? 'hsl(195 80% 45%)' : 'hsl(210 15% 55%)'
            }}
          >
            <Award className={`w-5 h-5 ${activeTab === 'championships' ? 'drop-shadow-[0_0_6px_hsl(195_80%_45%/0.5)]' : ''}`} />
            <span className="text-[9px] font-medium">Torneios</span>
          </button>
          <button
            onClick={() => setActiveTab('sponsors')}
            className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors"
            style={{ 
              color: activeTab === 'sponsors' ? 'hsl(195 80% 45%)' : 'hsl(210 15% 55%)'
            }}
          >
            <Users className={`w-5 h-5 ${activeTab === 'sponsors' ? 'drop-shadow-[0_0_6px_hsl(195_80%_45%/0.5)]' : ''}`} />
            <span className="text-[9px] font-medium">Parceiros</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors"
            style={{ 
              color: activeTab === 'community' ? 'hsl(195 80% 45%)' : 'hsl(210 15% 55%)'
            }}
          >
            <MessageSquare className={`w-5 h-5 ${activeTab === 'community' ? 'drop-shadow-[0_0_6px_hsl(195_80%_45%/0.5)]' : ''}`} />
            <span className="text-[9px] font-medium">Fórum</span>
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors"
            style={{
              color: activeTab === 'weather' ? 'hsl(195 80% 45%)' : 'hsl(210 15% 55%)'
            }}
          >
            <Cloud className={`w-5 h-5 ${activeTab === 'weather' ? 'drop-shadow-[0_0_6px_hsl(195_80%_45%/0.5)]' : ''}`} />
            <span className="text-[9px] font-medium">Clima</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
