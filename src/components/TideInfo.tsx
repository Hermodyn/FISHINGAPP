import { memo } from 'react';
import { Waves, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import type { TideData } from '../hooks/useTides';

interface TideInfoProps {
  tideData: TideData;
  loading: boolean;
}

export const TideInfo = memo(({ tideData, loading }: TideInfoProps) => {
  if (loading) {
    return (
      <div className="bg-blue-50 rounded-2xl p-4 animate-pulse">
        <div className="h-6 bg-blue-200 rounded w-32 mb-3"></div>
        <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-blue-200 rounded w-3/4"></div>
      </div>
    );
  }

  const { currentHeight, status, next, afterNext } = tideData;

  if (!currentHeight && !next) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <Waves className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-900">Condições de Maré</h3>
      </div>

      {/* Current Tide */}
      {currentHeight !== null && (
        <div className="bg-white/60 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Altura Atual</p>
              <p className="text-2xl font-bold text-blue-600">{currentHeight}m</p>
            </div>
            {status && (
              <div className="flex items-center gap-2">
                {status === 'Enchente' ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-orange-600" />
                )}
                <span className="text-sm font-semibold text-gray-700">{status}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Tides */}
      {(next || afterNext) && (
        <div className="space-y-2">
          {next && (
            <div className="bg-white/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Próxima Maré</p>
                  <p className="font-semibold text-gray-900">{next.type} às {next.time}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-600">{next.height}m</span>
            </div>
          )}

          {afterNext && (
            <div className="bg-white/40 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Depois</p>
                  <p className="font-semibold text-gray-700">{afterNext.type} às {afterNext.time}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-600">{afterNext.height}m</span>
            </div>
          )}
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-gray-500 text-center">
          Dados fornecidos por WorldTides API
        </p>
      </div>
    </div>
  );
});

TideInfo.displayName = 'TideInfo';
