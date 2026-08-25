// components/common/StatusPill.tsx
// Semantic status pill component with active pulse indicators
import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  UserCheck,
  XCircle,
  Radio,
  MapPin,
} from 'lucide-react';

export type GeneralStatus =
  // Booking lifecycle (backend models/booking.py)
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'en_route'
  | 'arrived'
  | 'started'
  | 'completed'
  | 'cancelled'
  // Worker Availability
  | 'online'
  | 'offline'
  // Certification & Welfare Claim statuses
  | 'verified'
  | 'approved'
  | 'rejected';

interface StatusPillProps {
  status: GeneralStatus | string;
  label?: string;
  size?: 'sm' | 'md';
  showPulse?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  label,
  size = 'md',
  showPulse = true,
}) => {
  const normStatus = status.toLowerCase() as GeneralStatus;

  const config: Record<
    GeneralStatus,
    {
      bg: string;
      text: string;
      border: string;
      dot: string;
      icon: React.ReactNode;
      defaultLabel: string;
      pulse?: boolean;
    }
  > = {
    // Live Booking statuses (backend lifecycle)
    pending: {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#92400E]',
      border: 'border-[#F59E0B]/40',
      dot: 'bg-[#F59E0B]',
      icon: <AlertCircle size={12} />,
      defaultLabel: 'Pending',
      pulse: true,
    },
    accepted: {
      bg: 'bg-[#E0F2FE]',
      text: 'text-[#075985]',
      border: 'border-[#0284C7]/30',
      dot: 'bg-[#0284C7]',
      icon: <UserCheck size={12} />,
      defaultLabel: 'Accepted',
      pulse: true,
    },
    declined: {
      bg: 'bg-[#FEE2E2]',
      text: 'text-[#991B1B]',
      border: 'border-[#EF4444]/30',
      dot: 'bg-[#EF4444]',
      icon: <XCircle size={12} />,
      defaultLabel: 'Declined',
    },
    en_route: {
      bg: 'bg-[#FFF1EB]',
      text: 'text-[#C2410C]',
      border: 'border-[#FF6B35]/40',
      dot: 'bg-[#FF6B35]',
      icon: <Activity size={12} />,
      defaultLabel: 'En Route',
      pulse: true,
    },
    arrived: {
      bg: 'bg-[#FFF9EB]',
      text: 'text-[#B45309]',
      border: 'border-[#FFC145]/40',
      dot: 'bg-[#FFC145]',
      icon: <MapPin size={12} />,
      defaultLabel: 'Arrived',
      pulse: true,
    },
    started: {
      bg: 'bg-[#FFF1EB]',
      text: 'text-[#C2410C]',
      border: 'border-[#FF6B35]/40',
      dot: 'bg-[#FF6B35]',
      icon: <Activity size={12} />,
      defaultLabel: 'Work Started',
      pulse: true,
    },
    completed: {
      bg: 'bg-[#E8F8F0]',
      text: 'text-[#1B4B43]',
      border: 'border-[#1B4B43]/30',
      dot: 'bg-[#1B4B43]',
      icon: <CheckCircle2 size={12} />,
      defaultLabel: 'Completed',
    },
    cancelled: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      dot: 'bg-gray-400',
      icon: <XCircle size={12} />,
      defaultLabel: 'Cancelled',
    },

    // Worker Availability
    online: {
      bg: 'bg-[#E8F8F0]',
      text: 'text-[#1E824C]',
      border: 'border-[#1E824C]/30',
      dot: 'bg-[#10B981]',
      icon: <Radio size={12} />,
      defaultLabel: 'Online',
      pulse: true,
    },
    offline: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      dot: 'bg-gray-400',
      icon: null,
      defaultLabel: 'Offline',
    },

    // Certification & Welfare Claim statuses
    verified: {
      bg: 'bg-[#1B4B43]',
      text: 'text-white',
      border: 'border-[#1B4B43]',
      dot: 'bg-[#FFC145]',
      icon: <CheckCircle2 size={12} className="text-[#FFC145]" />,
      defaultLabel: 'Verified',
    },
    approved: {
      bg: 'bg-[#E8F8F0]',
      text: 'text-[#1E824C]',
      border: 'border-[#10B981]/30',
      dot: 'bg-[#10B981]',
      icon: <CheckCircle2 size={12} />,
      defaultLabel: 'Approved',
    },
    rejected: {
      bg: 'bg-[#FEE2E2]',
      text: 'text-[#991B1B]',
      border: 'border-[#EF4444]/30',
      dot: 'bg-[#EF4444]',
      icon: <XCircle size={12} />,
      defaultLabel: 'Rejected',
    },
  };

  const item = config[normStatus] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
    icon: null,
    defaultLabel: status,
  };

  const sizeClass =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1.5'
      : 'px-2.5 py-1 text-xs gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs select-none ${item.bg} ${item.text} ${item.border} ${sizeClass}`}
    >
      {showPulse && item.pulse ? (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${item.dot}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${item.dot}`}
          />
        </span>
      ) : (
        <span className={`inline-flex rounded-full h-1.5 w-1.5 shrink-0 ${item.dot}`} />
      )}
      <span>{label || item.defaultLabel}</span>
    </span>
  );
};
