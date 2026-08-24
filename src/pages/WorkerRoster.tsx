// pages/WorkerRoster.tsx — Federation Worker Management & Certification
import React, { useEffect, useState } from 'react';
import {
  Search,
  CheckCircle2,
  Star,
  ShieldCheck,
  X,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/endpoints';
import type { Worker } from '../types';
import { StatusPill } from '../components/common/StatusPill';
import { CooperativeBadge } from '../components/common/CooperativeBadge';
import { TableSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export const WorkerRoster: React.FC = () => {
  const { currentFederation } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'online' | 'offline'>('all');

  // Selected worker for Drawer inspection
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWorkers(currentFederation?.id || 'fed_01');
      setWorkers(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch federation workers roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [currentFederation?.id]);

  const handleToggleCertification = async (workerId: string, currentStatus: 'verified' | 'pending') => {
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    try {
      await api.updateWorkerCertification(workerId, newStatus);
      setWorkers((prev) =>
        prev.map((w) => (w.id === workerId ? { ...w, certification_status: newStatus } : w))
      );
      if (selectedWorker?.id === workerId) {
        setSelectedWorker((prev) => (prev ? { ...prev, certification_status: newStatus } : null));
      }
      setActionSuccess(
        `Worker certification updated to "${newStatus.toUpperCase()}" successfully.`
      );
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert(`Failed to update certification: ${err?.message}`);
    }
  };

  // Filtered workers list
  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.phone.includes(searchQuery) ||
      w.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill =
      selectedSkill === 'all' || w.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || w.certification_status === statusFilter;

    const matchesAvailability =
      availabilityFilter === 'all' || w.availability === availabilityFilter;

    return matchesSearch && matchesSkill && matchesStatus && matchesAvailability;
  });

  const allSkills = ['electrician', 'plumber', 'cleaner', 'caregiver', 'carpenter', 'painter'];

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1A1A1A] font-display">
              Federation Worker Roster
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1B4B43]/10 text-[#1B4B43] font-bold font-mono">
              {workers.length} Registered
            </span>
          </div>
          <p className="text-xs text-[#1A1A1A]/60 mt-1 font-body">
            Manage member certifications, real-time availability, skill verifications, and welfare accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchWorkers}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-[#1B4B43]/20 rounded-xl text-[#1B4B43] hover:bg-[#1B4B43]/5 transition-colors shadow-2xs"
          >
            Refresh Roster
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#E8F8F0] border border-[#1E824C]/30 text-[#1E824C] text-xs font-bold flex items-center gap-2 animate-badge-pop shadow-xs">
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#1B4B43]/12 shadow-xs space-y-4">
        {/* Search & Status Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute inset-y-0 left-3.5 my-auto text-[#1B4B43]/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, phone, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:bg-white transition-all font-body"
            />
          </div>

          {/* Skill Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1A1A]/60 shrink-0 font-body">Skill:</span>
            <select
              aria-label="Filter by skill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full py-2 px-3 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43] capitalize"
            >
              <option value="all">All Skills ({workers.length})</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Certification Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1A1A]/60 shrink-0 font-body">Status:</span>
            <select
              aria-label="Filter by certification status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43]"
            >
              <option value="all">All Certifications</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending Vetting</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1A1A]/60 shrink-0 font-body">Duty:</span>
            <select
              aria-label="Filter by availability"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43]"
            >
              <option value="all">All Availability</option>
              <option value="online">Online (Ready)</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Skill Quick-Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1B4B43]/8">
          <span className="text-[11px] font-bold text-[#1A1A1A]/50 mr-1 uppercase">Trades:</span>
          <button
            onClick={() => setSelectedSkill('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedSkill === 'all'
                ? 'bg-[#1B4B43] text-white shadow-2xs'
                : 'bg-[#1B4B43]/8 text-[#1B4B43] hover:bg-[#1B4B43]/15'
            }`}
          >
            All Trades
          </button>
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedSkill === skill
                  ? 'bg-[#1B4B43] text-white shadow-2xs'
                  : 'bg-[#1B4B43]/8 text-[#1B4B43] hover:bg-[#1B4B43]/15'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Main Worker Table */}
      <div className="bg-white rounded-3xl border border-[#1B4B43]/12 shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchWorkers} />
        ) : filteredWorkers.length === 0 ? (
          <EmptyState
            icon="users"
            title="No federation workers match the criteria"
            description="Try clearing search filters or selecting another trade category."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSkill('all');
              setStatusFilter('all');
              setAvailabilityFilter('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead>
                <tr className="border-b border-[#1B4B43]/10 bg-[#F7F3E9]/60 text-[11px] font-bold text-[#1A1A1A]/70 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Member Name & Contact</th>
                  <th className="py-3.5 px-4">Trade Skills</th>
                  <th className="py-3.5 px-4">Rating & Quality</th>
                  <th className="py-3.5 px-4">Welfare Fund</th>
                  <th className="py-3.5 px-4">Certification Status</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Federation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B4B43]/6">
                {filteredWorkers.map((worker) => (
                  <tr
                    key={worker.id}
                    className="hover:bg-[#1B4B43]/3 transition-colors cursor-pointer"
                    onClick={() => setSelectedWorker(worker)}
                  >
                    {/* Worker Profile info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1B4B43]/10 text-[#1B4B43] font-bold flex items-center justify-center text-sm shrink-0 shadow-2xs">
                          {worker.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#1A1A1A] font-display flex items-center gap-1.5">
                            <span>{worker.name}</span>
                            {worker.certification_status === 'verified' && (
                              <CheckCircle2 size={13} className="text-[#FFC145] shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#1A1A1A]/60 font-mono">
                            {worker.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Trade Skills */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {worker.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-[#1B4B43]/8 text-[#1B4B43] text-[11px] font-semibold capitalize"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Rating & Completion */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-[#1A1A1A]">
                        <Star size={13} className="text-[#FFC145] fill-[#FFC145]" />
                        <span>{worker.rating_avg.toFixed(1)}</span>
                        <span className="text-[10px] text-[#1A1A1A]/50 font-normal">
                          ({worker.total_ratings || 18} jobs)
                        </span>
                      </div>
                      <div className="text-[10px] text-[#1E824C] font-semibold mt-0.5">
                        {Math.round((worker.completion_rate || 0.98) * 100)}% completion
                      </div>
                    </td>

                    {/* Welfare Balance */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1B4B43]">
                      ₹{worker.welfare_fund_balance.toFixed(2)}
                    </td>

                    {/* Certification Status */}
                    <td className="py-3.5 px-4">
                      {worker.certification_status === 'verified' ? (
                        <CooperativeBadge size="sm" />
                      ) : (
                        <StatusPill status="pending" label="Pending Vetting" size="sm" />
                      )}
                    </td>

                    {/* Duty Availability */}
                    <td className="py-3.5 px-4">
                      <StatusPill status={worker.availability} size="sm" />
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()} // Prevent row click
                    >
                      <div className="flex items-center justify-end gap-2">
                        {worker.certification_status === 'pending' ? (
                          <button
                            onClick={() => handleToggleCertification(worker.id, 'pending')}
                            className="px-2.5 py-1.5 bg-[#1B4B43] hover:bg-[#12332e] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs flex items-center gap-1"
                            title="Approve Trade Certificate & Issue Cooperative Badge"
                          >
                            <ShieldCheck size={13} className="text-[#FFC145]" />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleCertification(worker.id, 'verified')}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-[#FEE2E2] text-gray-700 hover:text-[#991B1B] text-xs font-medium rounded-lg transition-colors"
                            title="Revoke Verification"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedWorker(worker)}
                          className="p-1.5 text-[#1B4B43] hover:bg-[#1B4B43]/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Briefcase size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Worker Detail Side Drawer */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-slide-left">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1B4B43]/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#1B4B43]" />
                  <h3 className="font-bold text-base text-[#1A1A1A] font-display">
                    Worker Institutional Dossier
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedWorker(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile Card */}
              <div className="mt-5 p-4 rounded-2xl bg-[#F7F3E9]/80 border border-[#1B4B43]/15 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#1B4B43] text-white text-2xl font-bold flex items-center justify-center mx-auto shadow-md font-display">
                  {selectedWorker.name[0]}
                </div>
                <h4 className="text-lg font-bold text-[#1A1A1A] mt-2.5 font-display">
                  {selectedWorker.name}
                </h4>
                <p className="text-xs text-[#1A1A1A]/60 font-mono mt-0.5">
                  {selectedWorker.phone}
                </p>
                <div className="mt-3 flex justify-center">
                  {selectedWorker.certification_status === 'verified' ? (
                    <CooperativeBadge size="md" variant="glow" />
                  ) : (
                    <StatusPill status="pending" label="Vetting Required" />
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3.5 rounded-xl bg-white border border-[#1B4B43]/10">
                  <div className="text-[11px] text-[#1A1A1A]/60 font-body">Rating Score</div>
                  <div className="text-lg font-extrabold text-[#1A1A1A] font-display flex items-center gap-1 mt-1">
                    <Star size={16} className="text-[#FFC145] fill-[#FFC145]" />
                    {selectedWorker.rating_avg.toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#1B4B43]/10">
                  <div className="text-[11px] text-[#1A1A1A]/60 font-body">Welfare Balance</div>
                  <div className="text-lg font-extrabold text-[#1B4B43] font-mono mt-1">
                    ₹{selectedWorker.welfare_fund_balance.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Verified Trade Skills */}
              <div className="mt-5 space-y-2">
                <h5 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider font-display">
                  Registered Trade Skills
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWorker.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-xl bg-[#1B4B43]/10 text-[#1B4B43] font-bold text-xs capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Geospatial 2dsphere Coords */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#F7F3E9]/50 border border-[#1B4B43]/10">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B4B43]">
                  <MapPin size={14} />
                  <span>Geospatial 2dsphere Anchor</span>
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#1A1A1A]/70">
                  Lat: {selectedWorker.lat.toFixed(4)}° N, Lng: {selectedWorker.lng.toFixed(4)}° E
                </div>
                <div className="text-[10px] text-[#1E824C] font-semibold mt-1">
                  Active in Delhi Central operational radius (10km)
                </div>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-[#1B4B43]/10 space-y-2">
              <button
                onClick={() => handleToggleCertification(selectedWorker.id, selectedWorker.certification_status)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                  selectedWorker.certification_status === 'pending'
                    ? 'bg-[#1B4B43] text-white hover:bg-[#12332e]'
                    : 'bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]/80'
                }`}
              >
                <ShieldCheck size={15} />
                <span>
                  {selectedWorker.certification_status === 'pending'
                    ? 'Approve Skill Certification'
                    : 'Revoke Cooperative Verification'}
                </span>
              </button>

              <button
                onClick={() => setSelectedWorker(null)}
                className="w-full py-2 text-xs text-gray-500 font-semibold hover:text-gray-800"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
