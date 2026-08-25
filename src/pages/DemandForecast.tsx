// pages/DemandForecast.tsx — AI Demand Forecasting & Workforce Allocation Center
import React, { useEffect, useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  Layers,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/endpoints';
import type { ForecastResponse, ModelInfoResponse, DayForecast } from '../types';
import { ChartSkeleton } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/ErrorState';

// Backend predictions carry only dates — derive display helpers client-side.
const dayOfWeek = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { weekday: 'long' });
};
const isWeekend = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return !Number.isNaN(d.getTime()) && (d.getDay() === 0 || d.getDay() === 6);
};

export const DemandForecast: React.FC = () => {
  const { currentFederation } = useAuth();

  const [region, setRegion] = useState('north');
  const [serviceType, setServiceType] = useState('electrician');
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [trainResult, setTrainResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Model info comes from its own endpoint; fall back to demo metrics when absent.
  const fetchModelInfo = async () => {
    const info = await api.getModelInfo();
    setModelInfo(info);
  };

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const fData = await api.getDemandForecast(currentFederation?.id || 'fed_01', region, serviceType);
      setForecastData(fData);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate AI demand forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
    fetchModelInfo();
  }, [region, serviceType, currentFederation?.id]);

  const handleRetrainModel = async () => {
    setTraining(true);
    setTrainResult(null);
    try {
      const res = await api.trainForecastModel();
      setTrainResult(res);
      await fetchForecast();
    } catch (err: any) {
      alert(`Model retraining error: ${err?.message}`);
    } finally {
      setTraining(false);
    }
  };

  const regions = [
    { id: 'north', label: 'North Zone (Delhi NCR)' },
    { id: 'south', label: 'South Zone (Bengaluru/Chennai)' },
    { id: 'west', label: 'West Zone (Mumbai/Pune)' },
    { id: 'east', label: 'East Zone (Kolkata)' },
    { id: 'central', label: 'Central Zone (Bhopal/Nagpur)' },
  ];

  const services = [
    { id: 'electrician', label: 'Electrician' },
    { id: 'plumber', label: 'Plumber' },
    { id: 'cleaner', label: 'Cleaner' },
    { id: 'caregiver', label: 'Caregiver' },
    { id: 'carpenter', label: 'Carpenter' },
    { id: 'painter', label: 'Painter' },
  ];

  // Derived stats from the real forecast payload (backend: predictions[].predicted_demand)
  const daily: DayForecast[] = forecastData?.predictions ?? [];
  const chartData = daily.map((d) => ({
    ...d,
    day_of_week: dayOfWeek(d.date),
    is_weekend: isWeekend(d.date),
    predicted_bookings: d.predicted_demand,
  }));
  const peakDay = daily.length
    ? daily.reduce((a, b) => (b.predicted_demand > a.predicted_demand ? b : a))
    : null;

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1A1A1A] font-display flex items-center gap-2">
              <BrainCircuit className="text-[#1B4B43]" size={26} />
              AI Demand Forecasting & Allocation
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1B4B43] text-[#FFC145] font-bold font-mono">
              Scikit-Learn ML
            </span>
          </div>
          <p className="text-xs text-[#1A1A1A]/60 mt-1 font-body">
            Gradient Boosting regression predicting 7-day trade demand across operational zones for proactive worker scheduling.
          </p>
        </div>

        {/* Retrain Action Button */}
        <button
          onClick={handleRetrainModel}
          disabled={training}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#e0531f] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60 shrink-0"
        >
          <RefreshCw size={14} className={training ? 'animate-spin' : ''} />
          <span>{training ? 'Training Pipeline Running...' : 'Retrain AI Model Pipeline'}</span>
        </button>
      </div>

      {/* Retrain Feedback Alert */}
      {trainResult && (
        <div className="p-4 rounded-2xl bg-[#E8F8F0] border border-[#1E824C]/30 text-[#1E824C] text-xs flex items-center justify-between animate-badge-pop shadow-xs">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 size={16} />
            <span>{trainResult.message}</span>
          </div>
          <div className="font-mono text-[11px] font-bold">
            MAE: {trainResult.mae?.toFixed(2) ?? '—'} | R²: {trainResult.r2_score?.toFixed(3) ?? '—'}
          </div>
        </div>
      )}

      {/* Region & Service Category Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#1B4B43]/12 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Region Selector */}
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-body flex items-center gap-1.5">
            <MapPin size={14} className="text-[#1B4B43]" />
            <span>Operational Zone / Region</span>
          </label>
          <select
            aria-label="Select operational zone"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43]"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Service Category Selector */}
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-body flex items-center gap-1.5">
            <Layers size={14} className="text-[#FF6B35]" />
            <span>Trade Service Category</span>
          </label>
          <select
            aria-label="Select trade category"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-[#F7F3E9]/50 border border-[#1B4B43]/20 rounded-xl text-xs font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1B4B43] capitalize"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Forecast Chart & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2 Cols: 7-Day Interactive Forecast Chart (recharts with animate-on-mount) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#1B4B43]/12 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1B4B43]/8">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1A1A1A] font-display">
                  7-Day Projected Demand: <span className="capitalize text-[#1B4B43]">{serviceType}</span>
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FFF1EB] text-[#FF6B35] font-bold uppercase font-mono">
                  {region}
                </span>
              </div>
              <p className="text-xs text-[#1A1A1A]/60 font-body">
                Predicted booking volume per day with 90% confidence bands
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-[#1B4B43]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B4B43]" />
                Daily Bookings
              </span>
              <span className="flex items-center gap-1 text-[#FF6B35]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                Trend Line
              </span>
            </div>
          </div>

          {loading || !forecastData ? (
            <ChartSkeleton height="h-72" />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchForecast} />
          ) : (
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(27, 75, 67, 0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#5A6065"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val: string) => (typeof val === 'string' && val.length >= 10 ? val.slice(5) : String(val))}
                  />
                  <YAxis stroke="#5A6065" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '1rem',
                      border: '1px solid rgba(27, 75, 67, 0.15)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any) => [
                      `${val} Projected Bookings`,
                      name === 'predicted_bookings' ? 'Expected Volume' : name,
                    ]}
                  />
                  <Bar
                    dataKey="predicted_bookings"
                    fill="#1B4B43"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                    animationDuration={1100}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_bookings"
                    stroke="#FF6B35"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#FF6B35', strokeWidth: 2, stroke: '#FFFFFF' }}
                    animationDuration={1400}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Chart Footnote / Highlight */}
          <div className="pt-3 border-t border-[#1B4B43]/8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2">
            <div className="flex items-center gap-1.5 text-[#1B4B43] font-bold">
              <Flame size={14} className="text-[#FF6B35]" />
              <span>
                {peakDay
                  ? `Peak Demand: ${dayOfWeek(peakDay.date) || peakDay.date} — ${peakDay.predicted_demand} projected bookings${
                      isWeekend(peakDay.date) ? ' (weekend surge)' : ''
                    }`
                  : 'Peak demand will appear once forecast data loads'}
              </span>
            </div>
            <span className="text-[11px] text-[#1A1A1A]/50 font-mono">
              {daily.length} days projected{modelInfo?.training_timestamp ? ` • trained ${new Date(modelInfo.training_timestamp).toLocaleDateString()}` : ''}
            </span>
          </div>
        </div>

        {/* 1 Col: Model Performance & Architecture Details */}
        <div className="bg-white rounded-3xl p-6 border border-[#1B4B43]/12 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-[#1B4B43]" />
              <h3 className="text-base font-bold text-[#1A1A1A] font-display">
                ML Architecture & Metrics
              </h3>
            </div>
            <p className="text-xs text-[#1A1A1A]/60 font-body mt-0.5">
              Production regression evaluation criteria
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-[#1B4B43]/5 border border-[#1B4B43]/10 flex justify-between items-center">
              <span className="text-xs font-bold text-[#1A1A1A]/70">Model Architecture</span>
              <span className="text-xs font-extrabold text-[#1B4B43] font-mono text-right">
                {forecastData?.model_type || modelInfo?.model_type || 'GradientBoosting'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#E8F8F0] border border-[#1E824C]/20 flex justify-between items-center">
              <span className="text-xs font-bold text-[#1E824C]">Model Accuracy (R² Score)</span>
              <span className="text-sm font-extrabold text-[#1E824C] font-mono">
                {modelInfo?.metrics?.r2_score != null ? Number(modelInfo.metrics.r2_score).toFixed(3) : '—'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF1EB] border border-[#FF6B35]/20 flex justify-between items-center">
              <span className="text-xs font-bold text-[#C2410C]">Mean Absolute Error (MAE)</span>
              <span className="text-sm font-extrabold text-[#C2410C] font-mono">
                {modelInfo?.metrics?.mae != null ? `${Number(modelInfo.metrics.mae).toFixed(2)} bookings/day` : '—'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700">Trained Booking Samples</span>
              <span className="text-xs font-bold text-gray-900 font-mono">
                {(() => {
                  const samples = modelInfo?.train_samples ?? modelInfo?.dataset_records;
                  return samples != null ? samples.toLocaleString() : '—';
                })()}
              </span>
            </div>
          </div>

          {/* Feature Importance Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-display flex items-center gap-1.5">
              <span>Feature Importance Ranking</span>
              {!(modelInfo?.feature_importances && Object.keys(modelInfo.feature_importances).length > 0) && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFF1EB] text-[#FF6B35] font-bold normal-case tracking-normal">
                  demo
                </span>
              )}
            </h4>
            <div className="space-y-1.5 text-xs font-body">
              {(modelInfo?.feature_importances && Object.keys(modelInfo.feature_importances).length > 0
                ? Object.entries(modelInfo.feature_importances)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([feature, importance]) => ({
                      label: feature.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                      pct: Math.round(importance * 100),
                      color: '#1B4B43',
                    }))
                : [
                    { label: '7-Day Rolling Booking Average', pct: 42, color: '#1B4B43' },
                    { label: 'Weekend & Seasonality Multiplier', pct: 23, color: '#FF6B35' },
                    { label: 'Trade Service Type Encoding', pct: 16, color: '#FFC145' },
                  ]
              ).map((f) => (
                <div key={f.label}>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1A1A1A]/70">{f.label}</span>
                    <span className="font-mono font-bold" style={{ color: f.color }}>
                      {f.pct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-0.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
