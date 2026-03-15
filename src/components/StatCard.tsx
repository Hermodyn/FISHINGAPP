import { memo, ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export const StatCard = memo(({ icon, label, value, className = '' }: StatCardProps) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg ${className}`}>
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="text-xs text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';
