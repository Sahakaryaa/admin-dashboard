// components/layout/Header.tsx
// Top navigation header with federation selector and live Socket.IO connection indicator
import React, { useState } from 'react';
import {
  Building2,
  Bell,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { FederationHeaderBadge } from '../common/CooperativeBadge';

export const Header: React.FC = () => {
  const { currentFederation, federationsList, setCurrentFederation } = useAuth();
  const { isConnected } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[#1B4B43]/10 px-6 flex items-center justify-between shrink-0 shadow-2xs z-20">
      {/* Left: Active Federation selector */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-[#1B4B43] shrink-0" />
          <select
            aria-label="Select active federation"
            value={currentFederation?.id || ''}
            onChange={(e) => {
              const selected = federationsList.find((f) => f.id === e.target.value);
              if (selected) setCurrentFederation(selected);
            }}
            className="text-xs font-bold text-[#1A1A1A] bg-transparent border-0 focus:ring-0 cursor-pointer font-display truncate max-w-xs md:max-w-md hover:text-[#1B4B43]"
          >
            {federationsList.map((fed) => (
              <option key={fed.id} value={fed.id}>
                {fed.name}
              </option>
            ))}
          </select>
        </div>

        <span className="hidden lg:inline-block h-4 w-px bg-[#1B4B43]/15" />

        <div className="hidden lg:block">
          <FederationHeaderBadge
            name={currentFederation?.name || 'Delhi Central Federation'}
            region={currentFederation?.region || 'north'}
          />
        </div>
      </div>

      {/* Right: Live Connection & Notification actions */}
      <div className="flex items-center gap-3.5">
        {/* Real-time Socket.IO dispatch status pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none border transition-colors ${
            isConnected
              ? 'bg-[#E8F8F0] text-[#1E824C] border-[#1E824C]/30'
              : 'bg-[#FFF1EB] text-[#FF6B35] border-[#FF6B35]/30'
          }`}
          title={
            isConnected
              ? 'Real-Time Socket.IO event stream connected to FastAPI backend'
              : 'Polling synchronization active (Socket reconnecting)'
          }
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isConnected ? 'bg-[#10B981]' : 'bg-[#FF6B35]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isConnected ? 'bg-[#10B981]' : 'bg-[#FF6B35]'
              }`}
            />
          </span>
          <span className="font-mono font-bold tracking-tight">
            {isConnected ? 'LIVE DISPATCH' : 'POLLING SYNC'}
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#1A1A1A]/70 hover:text-[#1B4B43] hover:bg-[#1B4B43]/8 transition-colors"
            title="Federation Action Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B35]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#1B4B43]/15 p-4 z-50 animate-slide-up-fade">
              <div className="flex items-center justify-between pb-2 border-b border-[#1B4B43]/10">
                <span className="text-xs font-bold text-[#1A1A1A] font-display">
                  Federation Alerts
                </span>
                <span className="text-[10px] text-[#1B4B43] font-bold">
                  2 Pending
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-[#FFF1EB]/60 border border-[#FF6B35]/20 flex items-start gap-2.5 text-xs">
                  <AlertCircle size={15} className="text-[#FF6B35] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#1A1A1A]">Pending Welfare Claim</div>
                    <div className="text-[11px] text-[#1A1A1A]/70 mt-0.5">
                      Ramesh Kumar requested ₹1,500 for medical assistance.
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FEF3C7]/60 border border-[#F59E0B]/20 flex items-start gap-2.5 text-xs">
                  <CheckCircle2 size={15} className="text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#1A1A1A]">Worker Certification</div>
                    <div className="text-[11px] text-[#1A1A1A]/70 mt-0.5">
                      Manoj Singh (Carpenter) uploaded skill trade certificate.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1B4B43]/10 text-center">
                <span className="text-[10px] text-[#1B4B43] font-semibold">
                  All systems operational • AI model synced
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
