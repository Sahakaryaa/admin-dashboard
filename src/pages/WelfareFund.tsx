// pages/WelfareFund.tsx — Federation Cooperative Welfare Fund Governance Center
import React, { useEffect, useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/endpoints';
import type { FederationWelfareOverview } from '../types';
import { KpiCard } from '../components/common/KpiCard';
import { StatusPill } from '../components/common/StatusPill';
import { CooperativeBadge } from '../components/common/CooperativeBadge';
import { KpiCardSkeleton, TableSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export const WelfareFund: React.FC = () => {
  const { currentFederation } = useAuth();

  const [welfareData, setWelfareData] = useState<FederationWelfareOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [processingClaimId, setProcessingClaimId] = useState<string | null>(null);

  const fetchWelfareData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWelfareOverview(currentFederation?.id || 'fed_01');
      setWelfareData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch welfare fund data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWelfareData();
  }, [currentFederation?.id]);

  const handleClaimDecision = async (claimId: string, status: 'approved' | 'rejected') => {
    setProcessingClaimId(claimId);
    try {
      await api.updateClaimStatus(claimId, status);
      await fetchWelfareData();
      setActionSuccess(
        `Welfare claim #${claimId} was ${status.toUpperCase()} successfully by Federation Board.`
      );
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      alert(`Claim decision failed: ${err?.message}`);
    } finally {
      setProcessingClaimId(null);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchWelfareData} />;
  }

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1A1A1A] font-display flex items-center gap-2">
              <HeartHandshake className="text-[#1B4B43]" size={26} />
              Federation Welfare Fund Governance
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1B4B43] text-white font-bold font-mono">
              Ring-Fenced Pool
            </span>
          </div>
          <p className="text-xs text-[#1A1A1A]/60 mt-1 font-body">
            Democratic cooperative oversight: 5% automatic booking levy reserved for worker healthcare, emergency relief, and education grants.
          </p>
        </div>

        <button
          onClick={fetchWelfareData}
          className="px-3.5 py-2 text-xs font-semibold bg-white border border-[#1B4B43]/20 rounded-xl text-[#1B4B43] hover:bg-[#1B4B43]/5 transition-colors shadow-2xs self-start sm:self-auto"
        >
          Refresh Ledger
        </button>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F8F0] border border-[#1E824C]/30 text-[#1E824C] text-xs font-bold flex items-center gap-2 animate-badge-pop shadow-xs">
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Institutional Cooperative Value Proposition Banner */}
      <div className="bg-linear-to-r from-[#1B4B43] to-[#12332e] text-white p-6 rounded-3xl shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFC145]">
            <Sparkles size={14} />
            <span>Cooperative Differentiator vs. Private Aggregators</span>
          </div>
          <h3 className="text-lg font-bold font-display text-white">
            100% Retained for Worker Social Security
          </h3>
          <p className="text-xs text-white/80 leading-relaxed font-body">
            Unlike private platforms that extract 20–30% for corporate profits, SahaKarya redirects a modest 5% into this federation-administered welfare trust for medical emergencies, accident cover, and scholarship dividends.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <CooperativeBadge size="lg" variant="glow" />
        </div>
      </div>

      {/* 4 Welfare KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading || !welfareData ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              label="Total Welfare Pool Balance"
              value={`₹${welfareData.total_pool_balance.toLocaleString('en-IN')}`}
              sublabel="Liquid Reserves Available"
              trend="100% Solvency"
              trendDirection="up"
              icon={<ShieldCheck size={20} />}
              delayIndex={0}
              accentColor="#1B4B43"
              highlight
            />

            <KpiCard
              label="Accumulated Contributions"
              value={`₹${welfareData.total_contributions.toLocaleString('en-IN')}`}
              sublabel="From Completed Bookings"
              trend="5% Per Transaction"
              trendDirection="up"
              icon={<ArrowDownLeft size={20} />}
              delayIndex={1}
              accentColor="#1E824C"
            />

            <KpiCard
              label="Total Grants Disbursed"
              value={`₹${welfareData.total_claims_disbursed.toLocaleString('en-IN')}`}
              sublabel="Paid Out to Workers"
              trend="Zero Extraction"
              trendDirection="neutral"
              icon={<ArrowUpRight size={20} />}
              delayIndex={2}
              accentColor="#FF6B35"
            />

            <KpiCard
              label="Pending Board Claims"
              value={welfareData.pending_claims.length}
              sublabel="Awaiting Approval"
              trend={welfareData.pending_claims.length > 0 ? 'Requires Action' : 'Queue Clear'}
              trendDirection={welfareData.pending_claims.length > 0 ? 'down' : 'up'}
              icon={<AlertCircle size={20} />}
              delayIndex={3}
              accentColor="#D97706"
            />
          </>
        )}
      </div>

      {/* Actionable Pending Claims Queue */}
      <div className="bg-white rounded-3xl p-6 border border-[#1B4B43]/12 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1B4B43]/8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1A1A1A] font-display">
                Pending Worker Welfare Claims Queue
              </h2>
              {welfareData && welfareData.pending_claims.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFF1EB] text-[#FF6B35] font-bold text-xs font-mono">
                  {welfareData.pending_claims.length} Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-[#1A1A1A]/60 font-body">
              Approve or reject medical assistance and emergency grant requests submitted by verified workers.
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={2} cols={5} />
        ) : !welfareData || welfareData.pending_claims.length === 0 ? (
          <EmptyState
            icon="award"
            title="All welfare claims are reviewed & up to date"
            description="When federation workers submit emergency relief or grant requests, they will appear here for board action."
          />
        ) : (
          <div className="space-y-3">
            {welfareData.pending_claims.map((claim) => (
              <div
                key={claim.id}
                className="p-4 rounded-2xl bg-[#FFF1EB]/40 border border-[#FF6B35]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    ₹
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1A1A1A] font-display">
                        {claim.worker_name || 'Ramesh Kumar'}
                      </span>
                      <span className="text-xs text-[#1A1A1A]/60 font-mono">
                        ({claim.worker_phone || '+91 98111 00001'})
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#1A1A1A]/80 mt-1 font-body">
                      {claim.reason || 'Medical emergency assistance'}
                    </p>
                    <div className="text-[10px] text-[#1A1A1A]/50 font-mono mt-0.5">
                      Submitted: {new Date(claim.created_at).toLocaleDateString()} at {new Date(claim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs text-[#1A1A1A]/60 font-body">Requested Amount</div>
                    <div className="text-lg font-extrabold text-[#1B4B43] font-mono">
                      ₹{claim.amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleClaimDecision(claim.id, 'approved')}
                      disabled={processingClaimId === claim.id}
                      className="px-3.5 py-2 bg-[#1B4B43] hover:bg-[#12332e] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <CheckCircle2 size={14} className="text-[#FFC145]" />
                      <span>Approve Claim</span>
                    </button>

                    <button
                      onClick={() => handleClaimDecision(claim.id, 'rejected')}
                      disabled={processingClaimId === claim.id}
                      className="px-3 py-2 bg-white hover:bg-[#FEE2E2] text-gray-700 hover:text-[#991B1B] font-semibold text-xs rounded-xl border border-gray-200 transition-colors"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Welfare Ledger */}
      <div className="bg-white rounded-3xl p-6 border border-[#1B4B43]/12 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#1B4B43]/8">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A] font-display">
              Recent Welfare Transactions Ledger
            </h2>
            <p className="text-xs text-[#1A1A1A]/60 font-body">
              Audit trail of all 5% booking levies and approved member grant disbursements
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : !welfareData || welfareData.recent_transactions.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No welfare transactions recorded"
            description="Completed bookings automatically contribute 5% to the ledger."
          />
        ) : (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs font-body">
              <thead>
                <tr className="border-b border-[#1B4B43]/10 text-[11px] font-bold text-[#1A1A1A]/70 uppercase tracking-wider">
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Beneficiary / Worker</th>
                  <th className="py-3 px-3">Reason / Source</th>
                  <th className="py-3 px-3">Amount (₹)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B4B43]/6">
                {welfareData.recent_transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#1B4B43]/3 transition-colors">
                    <td className="py-3 px-3">
                      {tx.type === 'contribution' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[#1E824C]">
                          <ArrowDownLeft size={14} />
                          <span>5% Levy</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-[#FF6B35]">
                          <ArrowUpRight size={14} />
                          <span>Grant Claim</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-semibold text-[#1A1A1A]">
                      {tx.worker_name || 'Worker Member'}
                    </td>

                    <td className="py-3 px-3 text-[#1A1A1A]/80 max-w-xs truncate">
                      {tx.reason || 'Welfare transaction'}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-sm">
                      <span className={tx.type === 'contribution' ? 'text-[#1E824C]' : 'text-[#FF6B35]'}>
                        {tx.type === 'contribution' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <StatusPill status={tx.status} size="sm" />
                    </td>

                    <td className="py-3 px-3 text-[#1A1A1A]/50 font-mono">
                      {new Date(tx.created_at).toLocaleDateString()}
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
