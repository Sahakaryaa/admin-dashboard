// pages/Overview.tsx — Federation First Impression KPI Dashboard
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  IndianRupee,
  HeartHandshake,
  ArrowUpRight,
  Radio,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/endpoints';
import type { FederationOverview, Booking } from '../types';
import { KpiCard } from '../components/common/KpiCard';
import { StatusPill } from '../components/common/StatusPill';
import { CooperativeBadge } from '../components/common/CooperativeBadge';
import { KpiCardSkeleton, TableSkeleton } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/ErrorState';

export const Overview: React.FC = () => {
  const { currentFederation } = useAuth();

  const [overview, setOverview] = useState<FederationOverview | null>(null);
  const [liveBookings, setLiveBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ovData, bkData] = await Promise.all([
        api.getFederationOverview(currentFederation?.id || 'fed_01'),
        api.getLiveBookings(currentFederation?.id || 'fed_01'),
      ]);
      setOverview(ovData);
      setLiveBookings(bkData);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch federation overview');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when the federation changes. Live socket events no longer trigger
  // a full HTTP refetch (that caused two requests per event); the KPI numbers
  // refresh via manual Refresh or federation switch instead.
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFederation?.id]);

  // DEMO PLACEHOLDER — hardcoded sample series, not fetched from the backend
  const revenueTrendData = [
    { day: 'Mon', revenue: 5400, bookings: 14, welfare: 270 },
    { day: 'Tue', revenue: 6200, bookings: 16, welfare: 310 },
    { day: 'Wed', revenue: 5900, bookings: 15, welfare: 295 },
    { day: 'Thu', revenue: 7100, bookings: 18, welfare: 355 },
    { day: 'Fri', revenue: 7800, bookings: 20, welfare: 390 },
    { day: 'Sat', revenue: 9600, bookings: 25, welfare: 480 },
    { day: 'Sun', revenue: 8900, bookings: 23, welfare: 445 },
  ];

  // DEMO PLACEHOLDER — hardcoded category counts, not fetched from the backend
  const categoryData = [
    { category: 'Electrician', count: 32, fill: '#1B4B43' },
    { category: 'Plumber', count: 26, fill: '#25655b' },
    { category: 'Cleaner', count: 38, fill: '#FF6B35' },
    { category: 'Caregiver', count: 20, fill: '#FFC145' },
    { category: 'Carpenter', count: 18, fill: '#12332e' },
    { category: 'Painter', count: 14, fill: '#8C949B' },
  ];

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Top Banner / Greeting */}
      <div className="bg-linear-to-r from-[#1B4B43] to-[#25655b] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Background emblem watermark */}
        <div className="absolute right-4 -bottom-6 text-white/5 font-display font-extrabold text-9xl pointer-events-none select-none">
          स
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFC145] font-display">
              Federation Command Center
            </span>
            <span className="inline-block h-1 w-1 rounded-full bg-white/40" />
            <span className="text-xs text-white/80 font-mono">
              Live Operations (IST)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            {currentFederation?.name || 'Labour Cooperative Federation'}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl font-body">
            Empowering 15+ vetted cooperative trade workers with transparent dispatch, 5% institutional welfare retention, and zero exploitative commissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          <CooperativeBadge size="lg" variant="glow" />
        </div>
      </div>

      {/* Action alerts for Pending Federation Decisions */}
      {overview && (overview.pending_claims_count > 0 || overview.pending_certifications_count > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {overview.pending_claims_count > 0 && (
            <Link
              to="/welfare"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF1EB] border border-[#FF6B35]/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center shadow-xs">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A]">
                    {overview.pending_claims_count} Pending Welfare Grant Claim
                  </div>
                  <div className="text-[11px] text-[#1A1A1A]/70">
                    Medical / Emergency subsidy requires official approval
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#FF6B35] group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {overview.pending_certifications_count > 0 && (
            <Link
              to="/workers"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#FEF3C7] border border-[#F59E0B]/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A]">
                    {overview.pending_certifications_count} Pending Worker Certifications
                  </div>
                  <div className="text-[11px] text-[#1A1A1A]/70">
                    Trade skill certificates uploaded for federation vetting
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#D97706] group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}

      {/* 4 Staggered Animated KPI Cards (Key screen requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading || !overview ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              label="Active Federation Workers"
              value={`${overview.active_workers} / ${overview.total_workers}`}
              sublabel="Online & Verified"
              trend="+100% Availability"
              trendDirection="up"
              icon={<Users size={20} />}
              delayIndex={0}
              accentColor="#1B4B43"
              highlight
            />

            <KpiCard
              label="Bookings Today"
              value={overview.bookings_today}
              sublabel={`${overview.total_bookings} total registered`}
              trend="+18% vs yesterday"
              trendDirection="up"
              icon={<CalendarCheck size={20} />}
              delayIndex={1}
              accentColor="#FF6B35"
            />

            <KpiCard
              label="Gross Completed GMV"
              value={`₹${overview.total_revenue.toLocaleString('en-IN')}`}
              sublabel="Direct Worker Earnings"
              trend="95% Net to Workers"
              trendDirection="up"
              icon={<IndianRupee size={20} />}
              delayIndex={2}
              accentColor="#1E824C"
            />

            <KpiCard
              label="Welfare Fund Balance"
              value={`₹${overview.welfare_fund_total.toLocaleString('en-IN')}`}
              sublabel="Non-Extractable Pool"
              trend="5% Automatic Levy"
              trendDirection="up"
              icon={<HeartHandshake size={20} />}
              delayIndex={3}
              accentColor="#D97706"
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day Revenue & Demand Velocity */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#1B4B43]/12 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1B4B43]/8">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-[#1A1A1A] font-display">
                  Weekly Revenue & Welfare Velocity
                </h2>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFF1EB] text-[#FF6B35] font-bold uppercase font-mono">
                  demo
                </span>
              </div>
              <p className="text-xs text-[#1A1A1A]/60 font-body">
                Transaction GMV vs 5% Institutional Welfare Accumulation (sample data)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#1B4B43]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B4B43]" />
                GMV Revenue (₹)
              </span>
              <span className="flex items-center gap-1.5 text-[#FF6B35]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                Welfare (₹)
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4B43" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1B4B43" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27, 75, 67, 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="#5A6065" fontSize={11} tickLine={false} />
                <YAxis stroke="#5A6065" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    border: '1px solid rgba(27, 75, 67, 0.15)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  formatter={(value: any, name: any) => [
                    `₹${Number(value).toLocaleString('en-IN')}`,
                    name === 'revenue' ? 'Gross GMV' : 'Welfare Fund (5%)',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1B4B43"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tealGrad)"
                  animationDuration={1200}
                />
                <Area
                  type="monotone"
                  dataKey="welfare"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#orangeGrad)"
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Category Trade Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-[#1B4B43]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-[#1A1A1A] font-display">
                Skill Trade Breakdown
              </h2>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFF1EB] text-[#FF6B35] font-bold uppercase font-mono">
                demo
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A]/60 font-body">
              Completed bookings by trade category (sample data)
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27, 75, 67, 0.06)" horizontal={false} />
                <XAxis type="number" stroke="#5A6065" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#1A1A1A" fontSize={11} tickLine={false} width={65} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(27, 75, 67, 0.15)',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} Jobs Completed`, 'Volume']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={1000}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[#1B4B43]/8 flex justify-between items-center text-xs">
            <span className="text-[#1A1A1A]/60 font-medium">Top Demand: Cleaner & Electrician</span>
            <Link to="/forecast" className="text-[#1B4B43] font-bold inline-flex items-center gap-1 hover:underline">
              <span>View AI Forecast</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Live Recent Bookings Mini-Feed Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#1B4B43]/12 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1B4B43]/8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1A1A1A] font-display">
                Active Live Dispatch Feed
              </h2>
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#1E824C] font-mono font-bold">
                <Radio size={10} className="animate-live-pulse" />
                REAL-TIME
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A]/60 font-body">
              Instantaneous geospatial booking and worker state synchronizations
            </p>
          </div>

          <Link
            to="/bookings"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#1B4B43] bg-[#1B4B43]/10 hover:bg-[#1B4B43]/15 rounded-xl transition-colors shrink-0"
          >
            <span>Full Dispatch Console</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : liveBookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#1A1A1A]/60">
            No active bookings currently in queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead>
                <tr className="border-b border-[#1B4B43]/10 text-[11px] font-bold text-[#1A1A1A]/60 uppercase tracking-wider">
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Assigned Worker</th>
                  <th className="py-3 px-3">Price (₹)</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B4B43]/6">
                {liveBookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#1B4B43]/3 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#1B4B43]">
                      #{booking.id}
                      {booking.is_emergency && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-[#FF6B35] text-white text-[9px] font-bold">
                          SOS
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1A1A1A] capitalize">
                      {booking.service_type}
                    </td>
                    <td className="py-3 px-3 text-[#1A1A1A]/80">
                      {booking.customer_name || 'Customer'}
                    </td>
                    <td className="py-3 px-3">
                      {booking.worker_name ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#1B4B43]">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                          {booking.worker_name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Matching...</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#1A1A1A]">
                      ₹{booking.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusPill status={booking.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
