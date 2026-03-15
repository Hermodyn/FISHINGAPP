import { useState, useMemo, useEffect } from 'react';
import { Fish, MapPin, Trophy, Cloud, Plus, TrendingUp, Anchor, Info } from 'lucide-react';
import { useCatches } from './hooks/useCatches';
import { useSpots } from './hooks/useSpots';
import { useWeather } from './hooks/useWeather';
import { useTides } from './hooks/useTides';
import { CatchCard } from './components/CatchCard';
import { StatCard } from './components/StatCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { TideInfo } from './components/TideInfo';
import './App.css';

type Tab = 'home' | 'catches' | 'spots' | 'weather' | 'stats' | 'leagues' | 'friendsGallery' | 'community' | 'subscription';

function App() {
  // ==================== STATE ====================
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showAddCatch, setShowAddCatch] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // ==================== DATA HOOKS ====================
  const { catches, loading: catchesLoading, error: catchesError, refetch: refetchCatches } = useCatches();
  const { spots, loading: spotsLoading, error: spotsError } = useSpots();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();
  const { tideData, loading: tidesLoading, error: tidesError, fetchTidesForCurrentLocation } = useTides();

  // ==================== EFFECTS ====================
  // Fetch tides when Weather tab is opened
  useEffect(() => {
    if (activeTab === 'weather' && !tideData.currentHeight && !tidesLoading && !tidesError) {
      fetchTidesForCurrentLocation();
    }
  }, [activeTab, tideData.currentHeight, tidesLoading, tidesError, fetchTidesForCurrentLocation]);

  // ==================== COMPUTED VALUES ====================
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

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen pb-24 relative" style={{ background: "linear-gradient(180deg, hsl(200 60% 85%) 0%, hsl(175 50% 70%) 100%)" }}>
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center ocean-wave pointer-events-none"
        style={{ 
          backgroundImage: "url('/Fundo.jpg')",
          opacity: 0.15,
          filter: 'grayscale(100%)'
        }}
      />

      {/* Main Content */}
      <div className="max-w-lg mx-auto relative z-10" style={{ padding: '5mm' }}>
        
        {/* ==================== HOME TAB ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Anchor className="w-4 h-4 text-gray-700/70" />
                  <span className="text-[10px] font-medium text-gray-700/70 tracking-wider uppercase">Good Fishing!</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  Fisher's Guidapp
                  <span className="text-gray-700 text-sm ml-2">v3.0 Hybrid</span>
                </h1>
                <p className="text-xs text-gray-600 mt-1">PostgreSQL + Arquitetura Otimizada</p>
              </div>
              
              {/* Tips Button */}
              <div className="relative tips-container">
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="w-10 h-10 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                  style={{ background: "transparent", color: "hsl(210 80% 45%)" }}
                >
                  <Info className="w-6 h-6" strokeWidth={2.5} />
                </button>
                
                {showTips && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3">
                      <h3 className="font-bold text-sm">📚 Fishing Tips</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <button
                        onClick={() => {
                          setShowTips(false);
                          setActiveTab('weather');
                        }}
                        className="w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                      >
                        <div className="font-semibold text-gray-800 text-sm">☀️ Clima e Condições</div>
                        <div className="text-xs text-gray-500 mt-0.5">Previsão do tempo e marés</div>
                      </button>
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
                        href="https://www.youtube.com/results?search_query=técnicas+de+arremesso+pesca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-semibold text-gray-800 text-sm">💪 Técnicas de Arremesso</div>
                        <div className="text-xs text-gray-500 mt-0.5">Melhore sua precisão</div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

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

            {/* Main Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
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
                onClick={() => setActiveTab('leagues')}
                className="aspect-square bg-white/60 backdrop-blur-md rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/50"
              >
                <Trophy className="w-10 h-10 text-amber-500" strokeWidth={2} />
                <span className="text-xs font-bold text-gray-800">Ligas</span>
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
                  <button
                    onClick={() => setShowAddCatch(true)}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Registrar Primeira Captura
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {catches.slice(0, 3).map(catchItem => (
                    <CatchCard key={catchItem.id} catch={catchItem} />
                  ))}
                  {catches.length > 3 && (
                    <button
                      onClick={() => setActiveTab('catches')}
                      className="w-full bg-white/60 rounded-2xl p-3 text-center text-blue-600 font-semibold hover:bg-white/80 transition-colors"
                    >
                      Ver todas as {catches.length} capturas
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== CATCHES TAB ==================== */}
        {activeTab === 'catches' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Minhas Capturas</h2>
                <p className="text-sm text-gray-600">{stats.totalCatches} registradas</p>
              </div>
              <button 
                onClick={() => setShowAddCatch(true)}
                className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              >
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
                <button
                  onClick={() => setShowAddCatch(true)}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Registrar Agora
                </button>
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

        {/* ==================== SPOTS TAB ==================== */}
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

        {/* ==================== WEATHER TAB ==================== */}
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

            {/* Tide Information */}
            {tidesError ? (
              <ErrorMessage 
                message={tidesError} 
                onRetry={fetchTidesForCurrentLocation}
              />
            ) : (
              <TideInfo tideData={tideData} loading={tidesLoading} />
            )}
          </div>
        )}

        {/* ==================== STATS TAB ==================== */}
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

        {/* ==================== PLACEHOLDER TABS ==================== */}
        {activeTab === 'leagues' && (
          <div className="bg-white/80 rounded-2xl p-8 text-center">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ligas e Campeonatos</h2>
            <p className="text-gray-600">Em desenvolvimento - Fase 3</p>
          </div>
        )}

        {activeTab === 'friendsGallery' && (
          <div className="bg-white/80 rounded-2xl p-8 text-center">
            <Fish className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Galeria de Fotos</h2>
            <p className="text-gray-600">Em desenvolvimento - Fase 4</p>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="bg-white/80 rounded-2xl p-8 text-center">
            <Fish className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Comunidade</h2>
            <p className="text-gray-600">Em desenvolvimento - Fase 5</p>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="bg-white/80 rounded-2xl p-8 text-center">
            <Trophy className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Planos e Assinatura</h2>
            <p className="text-gray-600">Em desenvolvimento - Fase 5</p>
          </div>
        )}

        {/* ==================== ADD CATCH MODAL (Placeholder) ==================== */}
        {showAddCatch && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Registrar Captura</h3>
              <p className="text-gray-600 mb-4">
                Modal completo com Scanner AI, GPS e validação será implementado na Fase 4.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Por enquanto, use a API diretamente ou adicione via Swagger UI.
              </p>
              <button
                onClick={() => setShowAddCatch(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== BOTTOM NAVIGATION ==================== */}
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
