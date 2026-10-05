import React from 'react';
import { ScreeningStatus, TrustLevel } from '../../types';
import { STATUS_CONFIG, TRUST_LEVEL_CONFIG } from '../../config/constants';
import { Check, AlertTriangle, CircleDot, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ScreeningStatus;
  size?: 'sm' | 'md' | 'lg' | 'prominent';
  showDescription?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showDescription = false 
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.belum_diuji;

  const renderIcon = (iconSize: number) => {
    switch (status) {
      case 'negatif':
        return <Check size={iconSize} className="stroke-[2.5]" aria-hidden="true" />;
      case 'terindikasi':
        return <AlertTriangle size={iconSize} className="stroke-[2.5]" aria-hidden="true" />;
      case 'perlu_uji_lanjut':
        return <CircleDot size={iconSize} className="stroke-[2.5]" aria-hidden="true" />;
      case 'belum_diuji':
      default:
        return <HelpCircle size={iconSize} className="stroke-[2]" aria-hidden="true" />;
    }
  };

  // Prominent card label mode: clear, large banner across card or big badge
  if (size === 'prominent') {
    return (
      <div className={`w-full py-1.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 ${config.cardBadgeClass}`}>
        <span className="flex-shrink-0">{renderIcon(14)}</span>
        <span className="tracking-tight">{config.label}</span>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    md: 'text-xs font-bold px-3 py-1.5 gap-1.5',
    lg: 'text-sm font-extrabold px-3.5 py-2 gap-2'
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18
  };

  return (
    <div className="inline-flex flex-col">
      <span 
        className={`inline-flex items-center rounded-xl ${config.badgeClass} ${sizeClasses[size]}`}
        title={config.description}
      >
        <span className="flex-shrink-0">{renderIcon(iconSizes[size])}</span>
        <span>{config.label}</span>
      </span>
      {showDescription && (
        <span className="text-[11px] text-slate-500 mt-1 leading-tight">
          {config.description}
        </span>
      )}
    </div>
  );
};

interface TrustBadgeProps {
  level: TrustLevel;
  size?: 'sm' | 'md';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ level, size = 'md' }) => {
  const config = TRUST_LEVEL_CONFIG[level] || TRUST_LEVEL_CONFIG.rendah;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[11px] font-medium ${config.badgeClass}`}
      title={config.explanation}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};
