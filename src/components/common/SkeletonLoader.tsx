// components/common/SkeletonLoader.tsx
// Shimmer loading states as required in 07-ai-agent-rules.md §5
import React from 'react';

export const Skeleton: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style,
}) => {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} style={style} />;
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 6,
  cols = 5,
}) => {
  return (
    <div className="w-full space-y-3 p-4">
      {/* Header skeleton */}
      <div className="flex gap-4 pb-3 border-b border-[#1B4B43]/10">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`th-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`tr-${r}`} className="flex items-center gap-4 py-2.5">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={`td-${r}-${c}`}
              className={`h-5 ${c === 0 ? 'w-32 flex-none' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const KpiCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-xs border border-[#1B4B43]/10 space-y-3">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64' }) => {
  return (
    <div className={`w-full ${height} rounded-2xl bg-white p-5 border border-[#1B4B43]/10 flex flex-col justify-between`}>
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-end gap-3 h-full pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + (i * 11) % 65}%` }}
          />
        ))}
      </div>
    </div>
  );
};
