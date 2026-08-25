// pages/Login.tsx — Federation Official Portal Login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CooperativeBadge } from '../components/common/CooperativeBadge';

export const Login: React.FC = () => {
  const { login, loginDemo, isLoading } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(phone, password);
      navigate('/overview');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid phone or password. Please verify credentials.');
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    try {
      await loginDemo();
      navigate('/overview');
    } catch (err: any) {
      // Stay on the login page — surface the failure instead of navigating away.
      setError(
        err?.response?.data?.detail ||
          'Demo login failed. The demo pair (9999900000 / admin123) is only accepted while the backend is unreachable.'
      );
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#F7F3E9] p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background architectural geometric shapes */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1B4B43]/8 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#FF6B35]/8 blur-2xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#1B4B43]/15 p-6 sm:p-8 relative z-10 animate-slide-up-fade">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1B4B43] text-white shadow-md mb-4 font-display font-extrabold text-2xl">
            स
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4B43] font-display tracking-tight">
            SahaKarya
          </h1>
          <p className="text-xs font-semibold text-[#1A1A1A]/60 font-body mt-1">
            Labour Cooperative Federation Official Portal
          </p>
          <div className="mt-3 flex justify-center">
            <CooperativeBadge size="sm" variant="glow" />
          </div>
        </div>

        {/* SIH Problem statement context banner */}
        <div className="mt-5 p-3 rounded-2xl bg-[#1B4B43]/5 border border-[#1B4B43]/12 flex items-center gap-2.5 text-left">
          <Building2 size={18} className="text-[#1B4B43] shrink-0" />
          <div className="text-[11px] leading-tight text-[#1A1A1A]/80">
            <span className="font-bold text-[#1B4B43]">NCCT / Ministry of Cooperation</span>
            <br />
            SIH26089: Smart Automation for Labour Federations
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-[#FEE2E2] border border-[#EF4444]/30 text-[#991B1B] text-xs font-medium animate-shake">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5 font-body">
              Official Registered Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1B4B43]/60">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-sm font-mono text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5 font-body">
              Federation Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1B4B43]/60">
                <Lock size={16} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#e0531f] text-white font-bold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Federation Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Login Button for Judges / Presentation */}
        <div className="mt-5 pt-4 border-t border-[#1B4B43]/10">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#1B4B43]/10 hover:bg-[#1B4B43]/15 text-[#1B4B43] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#1B4B43]/20"
          >
            <Sparkles size={14} className="text-[#FF6B35]" />
            <span>Quick Demo Login (Secretary: Rajesh Sharma)</span>
          </button>
          <p className="text-[10px] text-center text-[#1A1A1A]/50 mt-2 font-mono">
            Demo Credentials: 9999900000 / admin123
          </p>
        </div>
      </div>
    </div>
  );
};
