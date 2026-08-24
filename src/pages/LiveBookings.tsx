// pages/LiveBookings.tsx — Real-Time Dispatch Console & Live Booking Management
import React, { useEffect, useState } from 'react';
import {
  Radio,
  Search,
  CheckCircle2,
  User,
  UserCheck,
  MapPin,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { api } from '../api/endpoints';
import type { Booking, BookingStatus } from '../types';
import { StatusPill } from '../components/common/StatusPill';
import { TableSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export const LiveBookings: React.FC = () => {
  const { currentFederation } = useAuth();
  const { isConnected, lastUpdatedBooking } = useSocket();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Selected Booking Drawer
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getLiveBookings(currentFederation?.id || 'fed_01');
      setBookings(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch live federation bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentFederation?.id]);

  // Merge live Socket.IO booking updates
  useEffect(() => {
    if (lastUpdatedBooking) {
      setBookings((prev) => {
        const index = prev.findIndex((b) => b.id === lastUpdatedBooking.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = lastUpdatedBooking;
          return updated;
        }
        return [lastUpdatedBooking, ...prev];
      });

      if (selectedBooking?.id === lastUpdatedBooking.id) {
        setSelectedBooking(lastUpdatedBooking);
      }
    }
  }, [lastUpdatedBooking]);

  const handleAdminStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as BookingStatus } : b))
      );
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus as BookingStatus } : null));
      }
      setStatusUpdateMessage(`Booking #${bookingId} status transitioned to ${newStatus.toUpperCase()}`);
      setTimeout(() => setStatusUpdateMessage(null), 3000);
    } catch (err: any) {
      alert(`Status update error: ${err?.message}`);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.worker_name && b.worker_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.service_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesService = serviceFilter === 'all' || b.service_type.toLowerCase() === serviceFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesService;
  });

  const statuses: BookingStatus[] = ['requested', 'matched', 'in_progress', 'completed', 'rated'];

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1A1A1A] font-display">
              Live Dispatch & Booking Stream
            </h1>
            <span
              className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${
                isConnected
                  ? 'bg-[#E8F8F0] text-[#1E824C] border border-[#1E824C]/30'
                  : 'bg-[#FFF1EB] text-[#FF6B35] border border-[#FF6B35]/30'
              }`}
            >
              <Radio size={11} className={isConnected ? 'animate-live-pulse' : ''} />
              {isConnected ? 'SOCKET.IO LIVE' : 'POLLING'}
            </span>
          </div>
          <p className="text-xs text-[#1A1A1A]/60 mt-1 font-body">
            Real-time geospatial state transitions, worker matches, and live customer booking tracking.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-3.5 py-2 text-xs font-semibold bg-white border border-[#1B4B43]/20 rounded-xl text-[#1B4B43] hover:bg-[#1B4B43]/5 transition-colors shadow-2xs self-start sm:self-auto"
        >
          Refresh Feed
        </button>
      </div>

      {/* Success Notification Banner */}
      {statusUpdateMessage && (
        <div className="p-3.5 rounded-2xl bg-[#E8F8F0] border border-[#1E824C]/30 text-[#1E824C] text-xs font-bold flex items-center gap-2 animate-badge-pop shadow-xs">
          <CheckCircle2 size={16} />
          <span>{statusUpdateMessage}</span>
        </div>
      )}

      {/* Filters Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#1B4B43]/12 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute inset-y-0 left-3.5 my-auto text-[#1B4B43]/50 pointer-events-none" />
          <input
            type="text"
            placeholder="Search booking ID, customer, worker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43] font-body"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1A1A1A]/60 shrink-0 font-body">Status:</span>
          <select
            aria-label="Filter bookings by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43]"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="requested">Requested</option>
            <option value="matched">Matched</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rated">Rated</option>
          </select>
        </div>

        {/* Trade Service Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1A1A1A]/60 shrink-0 font-body">Trade:</span>
          <select
            aria-label="Filter bookings by trade"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full py-2 px-3 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43] capitalize"
          >
            <option value="all">All Trades</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="cleaner">Cleaner</option>
            <option value="caregiver">Caregiver</option>
            <option value="carpenter">Carpenter</option>
            <option value="painter">Painter</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-[#1B4B43]/12 shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchBookings} />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No matching bookings found"
            description="Adjust your search query or reset status filters."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setServiceFilter('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead>
                <tr className="border-b border-[#1B4B43]/10 bg-[#F7F3E9]/60 text-[11px] font-bold text-[#1A1A1A]/70 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Service Trade</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Assigned Worker</th>
                  <th className="py-3.5 px-4">Price (₹)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B4B43]/6">
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-[#1B4B43]/3 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-[#1B4B43] flex items-center gap-1.5">
                        <span>#{b.id}</span>
                        {b.is_emergency && (
                          <span className="px-1.5 py-0.5 rounded bg-[#FF6B35] text-white text-[9px] font-bold">
                            SOS EMERGENCY
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#1A1A1A]/50 font-mono mt-0.5">
                        {new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#1A1A1A] capitalize text-sm font-display">
                        {b.service_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1A1A1A]">
                        {b.customer_name || 'Customer'}
                      </div>
                      <div className="text-[11px] text-[#1A1A1A]/60 font-mono">
                        {b.customer_phone || '+91 98765 00000'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {b.worker_name ? (
                        <div>
                          <div className="font-semibold text-[#1B4B43] flex items-center gap-1.5">
                            <UserCheck size={13} className="text-[#10B981]" />
                            <span>{b.worker_name}</span>
                          </div>
                          <div className="text-[11px] text-[#1A1A1A]/60 font-mono">
                            {b.worker_phone || ''}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Matching nearby...</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-sm text-[#1A1A1A]">
                        ₹{b.price.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-[#1B4B43] font-semibold">
                        ₹{(b.price * 0.05).toFixed(1)} to Welfare
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusPill status={b.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 text-[#1B4B43] hover:bg-[#1B4B43]/10 rounded-lg transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-slide-left">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1B4B43]/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#1B4B43]">
                      #{selectedBooking.id}
                    </span>
                    <StatusPill status={selectedBooking.status} size="sm" />
                  </div>
                  <div className="text-xs text-[#1A1A1A]/60 capitalize mt-0.5">
                    {selectedBooking.service_type} Service Order
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Lifecycle Progress Stepper (Required in 07-ai-agent-rules.md §5) */}
              <div className="mt-5 p-4 rounded-2xl bg-[#F7F3E9]/80 border border-[#1B4B43]/15">
                <div className="text-xs font-bold text-[#1A1A1A] font-display mb-3 uppercase tracking-wider">
                  Dispatch Lifecycle Stepper
                </div>
                <div className="flex items-center justify-between relative">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#1B4B43]/20 -translate-y-1/2 z-0" />
                  {statuses.map((st, idx) => {
                    const currentIdx = statuses.indexOf(selectedBooking.status);
                    const isCompleted = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;
                    return (
                      <div key={st} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-[#FF6B35] text-white ring-4 ring-[#FF6B35]/25 shadow-sm'
                              : isCompleted
                              ? 'bg-[#1B4B43] text-white'
                              : 'bg-white text-gray-400 border border-gray-300'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                        </div>
                        <span className="text-[10px] font-semibold mt-1 capitalize text-[#1A1A1A]/70">
                          {st.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer & Location Details */}
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-[#1B4B43]/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1B4B43] uppercase font-display">
                    <User size={14} />
                    <span>Customer Details</span>
                  </div>
                  <div className="text-sm font-bold text-[#1A1A1A]">
                    {selectedBooking.customer_name || 'Customer'}
                  </div>
                  <div className="text-xs text-[#1A1A1A]/60 font-mono">
                    {selectedBooking.customer_phone || '+91 98765 00000'}
                  </div>
                  <div className="text-xs text-[#1A1A1A]/80 flex items-start gap-1.5 pt-1">
                    <MapPin size={14} className="text-[#FF6B35] shrink-0 mt-0.5" />
                    <span>{selectedBooking.address || 'Connaught Place, New Delhi'}</span>
                  </div>
                </div>

                {/* Assigned Worker Details */}
                <div className="p-4 rounded-2xl bg-white border border-[#1B4B43]/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1B4B43] uppercase font-display">
                    <UserCheck size={14} />
                    <span>Assigned Federation Worker</span>
                  </div>
                  {selectedBooking.worker_name ? (
                    <>
                      <div className="text-sm font-bold text-[#1A1A1A]">
                        {selectedBooking.worker_name}
                      </div>
                      <div className="text-xs text-[#1A1A1A]/60 font-mono">
                        {selectedBooking.worker_phone}
                      </div>
                      <div className="text-[11px] text-[#1E824C] font-semibold">
                        Cooperative Verified Member • Geo-locked 2dsphere dispatch
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500 italic">
                      Automated multi-factor matching active in background...
                    </div>
                  )}
                </div>

                {/* Cooperative Financial Breakdown */}
                <div className="p-4 rounded-2xl bg-[#1B4B43]/5 border border-[#1B4B43]/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1B4B43]">
                    <span>Cooperative Revenue Split</span>
                    <span className="font-mono">Total: ₹{selectedBooking.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1A1A1A]/80 pt-1">
                    <span>Direct Worker Payout (95% living wage):</span>
                    <span className="font-mono font-bold text-[#1E824C]">
                      ₹{(selectedBooking.price * 0.95).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1A1A1A]/80">
                    <span>Cooperative Welfare Levy (5% ring-fenced):</span>
                    <span className="font-mono font-bold text-[#FF6B35]">
                      ₹{(selectedBooking.price * 0.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#1A1A1A]/60 pt-1 border-t border-[#1B4B43]/10">
                    Zero private aggregator commission extracted (vs Urban Company ~28%).
                  </div>
                </div>
              </div>

              {/* Admin Override Control */}
              <div className="mt-5 p-4 rounded-2xl bg-white border border-[#1B4B43]/10">
                <div className="text-xs font-bold text-[#1A1A1A] uppercase font-display mb-2">
                  Federation State Override
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleAdminStatusChange(selectedBooking.id, st)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        selectedBooking.status === st
                          ? 'bg-[#1B4B43] text-white shadow-2xs font-bold'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Close */}
            <div className="pt-4 border-t border-[#1B4B43]/10">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2.5 text-xs font-bold bg-[#1B4B43] text-white rounded-xl hover:bg-[#12332e] transition-colors shadow-xs"
              >
                Close Booking Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
