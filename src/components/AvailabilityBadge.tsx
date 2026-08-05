import React from 'react';
import { AvailabilityStatus } from '../types';

interface AvailabilityBadgeProps {
  status?: AvailabilityStatus;
  deliveryDelay?: string;
  size?: 'sm' | 'md' | 'lg';
  showDelay?: boolean;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  status = 'disponible',
  deliveryDelay,
  size = 'md',
  showDelay = true,
}) => {
  const config = {
    disponible: {
      dot: 'bg-emerald-400',
      text: '🟢 Disponible',
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-700/60',
      textColor: 'text-emerald-400',
    },
    'sur-commande': {
      dot: 'bg-amber-400',
      text: '🟡 Sur commande',
      bg: 'bg-amber-950/60',
      border: 'border-amber-700/60',
      textColor: 'text-amber-400',
    },
    'en-arrivage': {
      dot: 'bg-amber-400',
      text: '🟡 Sur commande',
      bg: 'bg-amber-950/60',
      border: 'border-amber-700/60',
      textColor: 'text-amber-400',
    },
    epuise: {
      dot: 'bg-rose-500',
      text: '🔴 Épuisé',
      bg: 'bg-rose-950/60',
      border: 'border-rose-800/60',
      textColor: 'text-rose-400',
    },
    nouveau: {
      dot: 'bg-amber-300',
      text: '✨ Nouveau',
      bg: 'bg-[#1A160C]',
      border: 'border-[#D4AF37]/60',
      textColor: 'text-[#F3E5AB]',
    },
  };

  const c = config[status] || config.disponible;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${c.bg} ${c.border} ${c.textColor} ${sizeClasses[size]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse shrink-0`} />
        {c.text}
      </span>
      {showDelay && deliveryDelay && status !== 'epuise' && (
        <span className="text-[10px] text-gray-400 pl-1">
          ⏱ Délai : {deliveryDelay}
        </span>
      )}
    </div>
  );
};
