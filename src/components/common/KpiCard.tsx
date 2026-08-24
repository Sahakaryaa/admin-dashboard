// components/common/KpiCard.tsx
// Reusable KPI card with staggered fade+slide-up animation as required in 07-ai-agent-rules.md §5
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  delayIndex?: number; // 0, 1, 2, 3 for staggered 50ms animations
  highlight?: boolean;
  accentColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  sublabel,
  trend,
  trendDirection = 'up',
  icon,
  delayIndex = 0,
  highlight = false,
  accentColor = '#1B4B43',
}) => {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-xs border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden animate-slide-up-fade ${
        highlight
          ? 'border-[#1B4B43]/30 bg-linear-to-br from-white to-[#1B4B43]/5 ring-1 ring-[#1B4B43]/15'
          : 'border-[#1B4B43]/12'
      }`}
      style={{
        animationDelay: `${delayIndex * 60}ms`,
      }}
    >
      {/* Top accent glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-70"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60 font-body truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#1A1A1A] font-display tracking-tight">
              {value}
            </h3>
            {sublabel && (
              <span className="text-xs text-[#1A1A1A]/50 font-body">
                {sublabel}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
            style={{
              backgroundColor: `${accentColor}14`,
              color: accentColor,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-[#1B4B43]/8 text-xs font-medium">
          {trendDirection === 'up' && (
            <TrendingUp size={14} className="text-[#1B4B43]" />
          )}
          {trendDirection === 'down' && (
            <TrendingDown size={14} className="text-[#DC2626]" />
          )}
          {trendDirection === 'neutral' && (
            <Minus size={14} className="text-[#5A6065]" />
          )}
          <span
            className={
              trendDirection === 'up'
                ? 'text-[#1B4B43] font-semibold'
                : trendDirection === 'down'
                ? 'text-[#DC2626] font-semibold'
                : 'text-[#5A6065]'
            }
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};
