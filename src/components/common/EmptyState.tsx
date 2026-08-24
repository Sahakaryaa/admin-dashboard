// components/common/EmptyState.tsx
// Defined empty state for every list and search view
import React from 'react';
import { Inbox, Search, Users, Calendar, Award } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'users' | 'calendar' | 'award';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'search':
        return <Search size={28} className="text-[#1B4B43]" />;
      case 'users':
        return <Users size={28} className="text-[#1B4B43]" />;
      case 'calendar':
        return <Calendar size={28} className="text-[#1B4B43]" />;
      case 'award':
        return <Award size={28} className="text-[#1B4B43]" />;
      default:
        return <Inbox size={28} className="text-[#1B4B43]" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-[#1B4B43]/20 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#1B4B43]/8 flex items-center justify-center mb-3.5 shadow-2xs">
        {renderIcon()}
      </div>
      <h4 className="text-base font-bold text-[#1A1A1A] font-display">
        {title}
      </h4>
      <p className="text-xs text-[#1A1A1A]/60 max-w-sm mt-1 font-body">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#1B4B43] rounded-xl hover:bg-[#1B4B43]/90 transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
