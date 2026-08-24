// components/common/CooperativeBadge.tsx
// Signature element across SahaKarya platform: pill shape, teal background, gold checkmark icon
import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface CooperativeBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'standard' | 'glow';
  className?: string;
}

export const CooperativeBadge: React.FC<CooperativeBadgeProps> = ({
  size = 'md',
  variant = 'standard',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-medium',
  };

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#1B4B43] text-white font-medium shadow-xs select-none animate-badge-pop tracking-tight ${
        variant === 'glow' ? 'ring-2 ring-[#FFC145]/40 shadow-sm' : ''
      } ${sizeClasses[size]} ${className}`}
      title="Verified Member of Registered Labour Cooperative Federation"
    >
      <CheckCircle2
        size={iconSizes[size]}
        className="text-[#FFC145] shrink-0"
        strokeWidth={2.5}
      />
      <span>Cooperative Verified</span>
    </span>
  );
};

export const FederationHeaderBadge: React.FC<{ name: string; region?: string }> = ({
  name,
  region = 'North Zone',
}) => {
  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1B4B43]/8 border border-[#1B4B43]/15">
      <div className="w-6 h-6 rounded-lg bg-[#1B4B43] text-white flex items-center justify-center shadow-xs">
        <ShieldCheck size={14} className="text-[#FFC145]" />
      </div>
      <div>
        <div className="text-xs font-bold text-[#1B4B43] leading-tight font-display">
          {name}
        </div>
        <div className="text-[10px] text-[#1A1A1A]/60 font-medium leading-none">
          Ministry of Cooperation (NCCT) • {region.toUpperCase()}
        </div>
      </div>
    </div>
  );
};
