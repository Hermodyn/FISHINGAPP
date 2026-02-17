import { useState, useEffect } from 'react'
import { Fish, MapPin, Cloud, TrendingUp, Plus, Calendar, Clock, Ruler, Weight, Navigation, Compass, Waves, Wind, Moon, Sunrise, Sunset, Droplets, Gauge, Anchor, Activity, Map, Wrench, Worm, Timer, Target, Leaf, BookOpen } from 'lucide-react'
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
}

interface Location {
  latitude: number
  longitude: number
  accuracy: number
}

interface TideData {
  time: string
  height: number
  type: 'high' | 'low'
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

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'catches' | 'spots' | 'stats' | 'planning' | 'equipment' | 'baits' | 'times' | 'techniques' | 'environment'>('home')
  const [showAddCatch, setShowAddCatch] = useState(false)
  const [location, setLocation] = useState<Location | null>(null)
  const [locationError, setLocationError] = useState<string>('')
  const [loadingLocation, setLoadingLocation] = useState(true)
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
    { id: 1, name: 'Lagoa da Conceição', catches: 15, rating: 4.5 },
    { id: 2, name: 'Praia da Armação', catches: 12, rating: 4.2 },
    { id: 3, name: 'Barra da Lagoa', catches: 8, rating: 4.0 }
  ])

  const [tides] = useState<TideData[]>([
    { time: '05:42', height: 1.2, type: 'high' },
    { time: '11:58', height: 0.3, type: 'low' },
    { time: '18:15', height: 1.4, type: 'high' },
    { time: '23:45', height: 0.2, type: 'low' }
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

  const moonPhase = 0.65
  const fishingCondition = 'Bom'
  const sunrise = '06:15'
  const sunset = '19:42'

  const [newCatch, setNewCatch] = useState({
    species: '',
    weight: '',
    length: '',
    location: '',
    weather: ''
  })

  const handleAddCatch = () => {
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
  }

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
          setLoadingLocation(false)
        },
        () => {
          setLocationError('Não foi possível obter sua localização')
          setLoadingLocation(false)
        }
      )
    } else {
      setLocationError('GPS não disponível')
      setLoadingLocation(false)
    }
  }, [])

  const totalCatches = catches.length
  const totalWeight = catches.reduce((sum, c) => sum + c.weight, 0)
  const avgWeight = totalCatches > 0 ? (totalWeight / totalCatches).toFixed(1) : 0
  const biggestCatch = catches.length > 0 ? Math.max(...catches.map(c => c.weight)) : 0

  const getMoonPhaseIcon = (phase: number) => {
    if (phase < 0.125) return '🌑'
    if (phase < 0.375) return '🌒'
    if (phase < 0.625) return '🌓'
    if (phase < 0.875) return '🌔'
    return '🌕'
  }

  const getNextTide = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    return tides.find(tide => {
      const [hours, minutes] = tide.time.split(':').map(Number)
      const tideTime = hours * 60 + minutes
      return tideTime > currentTime
    }) || tides[0]
  }

  const nextTide = getNextTide()

  return (
    <div className="min-h-screen bg-gray-100">
      {activeTab === 'home' && (
        <div className="pb-20">
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Anchor className="w-7 h-7" />
                  Fishing Points
                </h1>
                <p className="text-xs text-blue-200 mt-1">Condições Náuticas e Marés</p>
              </div>
              <button
                onClick={() => setShowAddCatch(true)}
                className="bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-white/30 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {location && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    <span className="font-mono text-xs">
                      {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30"
                  >
                    Mapa
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 space-y-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  <span className="font-bold text-lg">Condições de Pesca</span>
                </div>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {fishingCondition}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                  <Moon className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-2xl mb-1">{getMoonPhaseIcon(moonPhase)}</p>
                  <p className="text-xs opacity-90">Lua</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                  <Sunrise className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm font-bold mb-1">{sunrise}</p>
                  <p className="text-xs opacity-90">Nascer</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                  <Sunset className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm font-bold mb-1">{sunset}</p>
                  <p className="text-xs opacity-90">Pôr do Sol</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 text-white">
                <h2 className="font-bold flex items-center gap-2">
                  <Waves className="w-5 h-5" />
                  Condições Marítimas
                </h2>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Cloud className="w-4 h-4" />
                      <span className="text-xs font-medium">Temperatura</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{weather.temp}°C</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-cyan-700 mb-1">
                      <Wind className="w-4 h-4" />
                      <span className="text-xs font-medium">Vento</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{weather.windSpeed} km/h</p>
                    <p className="text-xs text-gray-500">{weather.windDirection}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Waves className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                    <p className="text-sm font-bold text-gray-800">{weather.waveHeight}m</p>
                    <p className="text-xs text-gray-500">Ondas</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Gauge className="w-4 h-4 mx-auto text-purple-600 mb-1" />
                    <p className="text-sm font-bold text-gray-800">{weather.pressure}</p>
                    <p className="text-xs text-gray-500">hPa</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Droplets className="w-4 h-4 mx-auto text-cyan-600 mb-1" />
                    <p className="text-sm font-bold text-gray-800">{weather.humidity}%</p>
                    <p className="text-xs text-gray-500">Umidade</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3 text-white">
                <h2 className="font-bold flex items-center gap-2">
                  <Waves className="w-5 h-5" />
                  Tábua de Marés
                </h2>
              </div>
              <div className="p-3">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-3 mb-3 border-2 border-cyan-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 font-medium">Próxima Maré</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      nextTide.type === 'high' 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-orange-200 text-orange-800'
                    }`}>
                      {nextTide.type === 'high' ? '↑ ALTA' : '↓ BAIXA'}
                    </span>
                  </div>
                  <div className="flex items-end gap-3">
                    <p className="text-3xl font-bold text-gray-800">{nextTide.time}</p>
                    <p className="text-xl font-semibold text-gray-600 mb-1">{nextTide.height}m</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {tides.map((tide, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tide.type === 'high' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {tide.type === 'high' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{tide.time}</p>
                          <p className="text-xs text-gray-500">{tide.type === 'high' ? 'Maré Alta' : 'Maré Baixa'}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-700">{tide.height}m</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Fish className="w-5 h-5 text-blue-600" />
                Capturas Recentes
              </h2>
              <div className="space-y-2">
                {catches.slice(0, 3).map((catch_) => (
                  <div key={catch_.id} className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{catch_.species}</h3>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {catch_.weight} kg
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {catch_.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(catch_.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Pontos de Pesca
              </h2>
              <div className="space-y-2">
                {spots.slice(0, 3).map((spot) => (
                  <div key={spot.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-800">{spot.name}</p>
                      <p className="text-xs text-gray-500">{spot.catches} capturas</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                      <span className="text-yellow-600">★</span>
                      <span className="font-bold text-gray-700 text-sm">{spot.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'catches' && (
        <div className="pb-20">
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
        <div className="pb-20">
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-7 h-7" />
              Pontos de Pesca
            </h1>
            <p className="text-red-100 text-sm mt-1">{spots.length} locais cadastrados</p>
          </div>

          <div className="p-4 space-y-3">
            {spots.map((spot) => (
              <div key={spot.id} className="bg-white p-5 rounded-2xl shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{spot.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{spot.catches} capturas registradas</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-bold text-gray-700">{spot.rating}</span>
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors active:scale-95">
                  Ver no Mapa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="pb-20">
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-b-3xl shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-7 h-7" />
              Estatísticas
            </h1>
            <p className="text-green-100 text-sm mt-1">Seu desempenho na pesca</p>
          </div>

          <div className="p-4 space-y-4">
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
          </div>
        </div>
      )}

      {showAddCatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Nova Captura</h2>
              <button
                onClick={() => setShowAddCatch(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Espécie do peixe"
                value={newCatch.species}
                onChange={(e) => setNewCatch({ ...newCatch, species: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Peso (kg)"
                  value={newCatch.weight}
                  onChange={(e) => setNewCatch({ ...newCatch, weight: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="number"
                  placeholder="Comprimento (cm)"
                  value={newCatch.length}
                  onChange={(e) => setNewCatch({ ...newCatch, length: e.target.value })}
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

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Fish className="w-6 h-6" />
            <span className="text-xs font-medium">Início</span>
          </button>
          <button
            onClick={() => setActiveTab('catches')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'catches' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Capturas</span>
          </button>
          <button
            onClick={() => setActiveTab('spots')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'spots' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs font-medium">Pontos</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'stats' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
