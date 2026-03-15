import { useState, useMemo } from 'react';
import { Fish, MapPin, Trophy, Cloud, Plus, TrendingUp } from 'lucide-react';
import { useCatches } from './hooks/useCatches';
import { useSpots } from './hooks/useSpots';
import { useWeather } from './hooks/useWeather';
import { CatchCard } from './components/CatchCard';
import { StatCard } from './components/StatCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import './App.css';

type Tab = 'home' | 'catches' | 'spots' | 'weather' | 'stats';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { catches, loading: catchesLoading, error: catchesError, refetch: refetchCatches } = useCatches();
  const { spots, loading: spotsLoading, error: spotsError } = useSpots();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();

  // Memoized statistics
  const stats = useMemo(() => {
    const totalCatches = catches.length;
    const totalWeight = catches.reduce((sum, c) => sum + c.weight, 0);
    const avgWeight = totalCatches > 0 ? (totalWeight / totalCatches).toFixed(1) : '0';
    const biggestCatch = totalCatches > 0 ? Math.max(...catches.map(c => c.weight)) : 0;
    
    return { totalCatches, totalWeight, avgWeight, biggestCatch };
  }, [catches]);

  const sortedSpots = useMemo(() => 
    [...spots].sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    [spots]
  );

  return (
    <div className="min-h-screen pb-24 relative" style={{ background: "linear-gradient(180deg, hsl(200 60% 85%) 0%, hsl(175 50% 70%) 100%)" }}>
      {/* Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center ocean-wave pointer-events-none"
        style={{ 
          backgroundImage: "url('/Fundo.jpg')",
          opacity: 0.15,
          filter: 'grayscale(100%)'
        }}
      />

      {/* Main Content */}
      <div className="max-w-lg mx-auto relative z-10 p-5">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Fisher's Guidapp
            <span className="text-gray-600 text-sm ml-2">v3.0</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">Conectado ao PostgreSQL</p>
        </div>

        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Fish className="w-6 h-6" />}
                label="Total Capturas"
                value={stats.totalCatches}
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Maior Captura"
                value={`${stats.biggestCatch} kg`}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab('catches')}
                className="aspect-square bg-white/60 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Fish className="w-10 h-10 text-blue-600" strokeWidth={2} />
                <span className="text-xs font-bold text-gray-800">Capturas</span>
              </button>

              <button
                onClick={() => setActiveTab('spots')}
                className="aspect-square bg-white/60 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <MapPin className="w-10 h-10 text-green-600" strokeWidth={2} />
                <span className="text-xs font-bold text-gray-800">Pontos</span>
              </button>

              <button
                onClick={() => setActiveTab('weather')}
                className="aspect-square bg-white/60 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Cloud className="w-10 h-10 text-purple-600" strokeWidth={2} />
                <span className="text-xs font-bold text-gray-800">Clima</span>
              </button>
            </div>

            {/* Recent Catches */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Capturas Recentes</h2>
              {catchesLoading ? (
                <LoadingSpinner className="py-8" />
              ) : catchesError ? (
                <ErrorMessage message={catchesError} onRetry={refetchCatches} />
              ) : catches.length === 0 ? (
                <div className="bg-white/60 rounded-2xl p-8 text-center">
                  <Fish className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Nenhuma captura registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {catches.slice(0, 3).map(catchItem => (
                    <CatchCard key={catchItem.id} catch={catchItem} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Catches Tab */}
        {activeTab === 'catches' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Minhas Capturas</h2>
              <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {catchesLoading ? (
              <LoadingSpinner className="py-12" />
            ) : catchesError ? (
              <ErrorMessage message={catchesError} onRetry={refetchCatches} />
            ) : catches.length === 0 ? (
              <div className="bg-white/60 rounded-2xl p-12 text-center">
                <Fish className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Nenhuma captura ainda</p>
                <p className="text-gray-500 text-sm mt-2">Registre sua primeira captura!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {catches.map(catchItem => (
                  <CatchCard key={catchItem.id} catch={catchItem} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Spots Tab */}
        {activeTab === 'spots' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Pontos de Pesca</h2>

            {spotsLoading ? (
              <LoadingSpinner className="py-12" />
            ) : spotsError ? (
              <ErrorMessage message={spotsError} />
            ) : (
              <div className="space-y-3">
                {sortedSpots.map(spot => (
                  <div key={spot.id} className="bg-white rounded-2xl shadow-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{spot.name}</h3>
                        <p className="text-sm text-gray-600">
                          {spot.catches_count || 0} capturas
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-gray-900">{spot.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Condições do Tempo</h2>

            {weatherLoading ? (
              <LoadingSpinner className="py-12" />
            ) : weatherError ? (
              <ErrorMessage message={weatherError} />
            ) : weather ? (
              <div className="bg-white/80 rounded-2xl shadow-lg p-6 space-y-4">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900">{weather.temp}°C</p>
                  <p className="text-gray-600 mt-2">{weather.fishingCondition || 'Bom'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Vento</p>
                    <p className="font-bold">{weather.windSpeed} km/h {weather.windDirection}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Ondas</p>
                    <p className="font-bold">{weather.waveHeight} m</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Pressão</p>
                    <p className="font-bold">{weather.pressure} hPa</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Umidade</p>
                    <p className="font-bold">{weather.humidity}%</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Estatísticas</h2>

            <div className="space-y-3">
              <StatCard
                icon={<Fish className="w-6 h-6" />}
                label="Total de Capturas"
                value={stats.totalCatches}
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Peso Total"
                value={`${stats.totalWeight.toFixed(1)} kg`}
              />
              <StatCard
                icon={<Trophy className="w-6 h-6" />}
                label="Peso Médio"
                value={`${stats.avgWeight} kg`}
              />
              <StatCard
                icon={<Trophy className="w-6 h-6" />}
                label="Maior Captura"
                value={`${stats.biggestCatch} kg`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Fish className="w-6 h-6" />
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('catches')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'catches' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-semibold">Capturas</span>
          </button>

          <button
            onClick={() => setActiveTab('spots')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'spots' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs font-semibold">Pontos</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'weather' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Cloud className="w-6 h-6" />
            <span className="text-xs font-semibold">Clima</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === 'stats' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-semibold">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
