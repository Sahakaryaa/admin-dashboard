// components/common/ErrorState.tsx
// Defined error and failure state with retry mechanism
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load federation data',
  message = 'An error occurred while connecting to the platform services. Please check your connection and retry.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center bg-[#FEE2E2]/40 rounded-2xl border border-[#EF4444]/30 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/15 flex items-center justify-center mb-3 text-[#DC2626]">
        <AlertTriangle size={24} />
      </div>
      <h4 className="text-sm font-bold text-[#991B1B] font-display">
        {title}
      </h4>
      <p className="text-xs text-[#991B1B]/80 max-w-sm mt-1 font-body">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#DC2626] rounded-xl hover:bg-[#DC2626]/90 transition-colors shadow-xs"
        >
          <RefreshCw size={13} />
          Retry Request
        </button>
      )}
    </div>
  );
};
