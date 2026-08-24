// components/layout/Sidebar.tsx
// Institutional teal sidebar navigation
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Radio,
  TrendingUp,
  HeartHandshake,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { CooperativeBadge } from '../common/CooperativeBadge';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { session, logout } = useAuth();
  const { isConnected } = useSocket();

  const navItems = [
    {
      to: '/overview',
      label: 'Overview & KPIs',
      icon: <LayoutDashboard size={18} />,
      badge: null,
    },
    {
      to: '/workers',
      label: 'Worker Roster',
      icon: <Users size={18} />,
      badge: '15 Active',
    },
    {
      to: '/bookings',
      label: 'Live Dispatch',
      icon: <Radio size={18} className={isConnected ? 'text-[#FFC145]' : ''} />,
      badge: isConnected ? 'LIVE' : 'SYNC',
      badgeColor: isConnected ? 'bg-[#FF6B35]' : 'bg-[#1B4B43]/20',
    },
    {
      to: '/forecast',
      label: 'AI Demand Forecast',
      icon: <TrendingUp size={18} />,
      badge: 'ML R²=0.96',
      badgeColor: 'bg-[#FFC145] text-[#1B4B43]',
    },
    {
      to: '/welfare',
      label: 'Welfare Fund',
      icon: <HeartHandshake size={18} />,
      badge: 'Coop Govt',
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[#1B4B43] text-white flex flex-col justify-between shrink-0 shadow-lg select-none border-r border-[#1B4B43]/30 z-30">
      {/* Brand & Federation Header */}
      <div>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1B4B43] flex items-center justify-center font-extrabold text-xl shadow-md font-display tracking-tight">
              स
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight font-display text-white">
                  SahaKarya
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FFC145] text-[#1B4B43] font-bold">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-white/70 font-medium truncate">
                Federation Portal (NCCT)
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/10">
            <CooperativeBadge size="sm" variant="glow" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-white/50 uppercase font-display">
            Federation Operations
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-white text-[#1B4B43] shadow-sm font-bold translate-x-1'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0 transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                    item.badgeColor || 'bg-white/15 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Institutional Welfare Info & User Profile Footer */}
      <div className="p-3 border-t border-white/10 space-y-3 bg-[#12332e]/40">
        {/* Cooperative Trust Card */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFC145]">
            <Sparkles size={13} />
            <span>Cooperative Model</span>
          </div>
          <p className="text-[10px] text-white/70 mt-1 leading-relaxed">
            5% welfare levy ring-fenced per transaction. Non-extractable member dividend.
          </p>
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {session?.name ? session.name[0] : 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {session?.name || 'Federation Admin'}
              </div>
              <div className="text-[10px] text-white/60 truncate font-mono">
                {session?.phone || '+91 99999 00000'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out from Federation Portal"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
