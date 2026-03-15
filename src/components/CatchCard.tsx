import { memo } from 'react';
import { Fish, MapPin, Calendar, Weight } from 'lucide-react';
import type { Catch } from '../hooks/useCatches';

interface CatchCardProps {
  catch: Catch;
  onClick?: () => void;
}

export const CatchCard = memo(({ catch: catchData, onClick }: CatchCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer"
    >
      {catchData.photoUrl && (
        <img
          src={catchData.photoUrl}
          alt={catchData.species}
          className="w-full h-48 object-cover rounded-xl mb-3"
        />
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Fish className="w-5 h-5 text-blue-600" />
            {catchData.species}
          </h3>
          <span className="text-sm font-semibold text-blue-600">
            {catchData.weight} kg
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{catchData.location}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(catchData.date).toLocaleDateString('pt-BR')}</span>
          </div>
          {catchData.length > 0 && (
            <div className="flex items-center gap-1">
              <Weight className="w-3 h-3" />
              <span>{catchData.length} cm</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CatchCard.displayName = 'CatchCard';
