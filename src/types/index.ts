// types/index.ts — SahaKarya Domain Types & Interfaces

export type UserRole = 'admin' | 'worker' | 'customer';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  language_pref: string;
  created_at: string;
}

// Contract TokenResponse = {access_token, token_type, user: UserResponse}
export interface AuthSession {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Federation {
  id: string;
  name: string;
  region: string;
  admin_user_id?: string;
  created_at: string;
}

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export type WorkerAvailability = 'online' | 'offline';
// Contract: certification: "pending" | "verified" | "rejected"
export type CertificationStatus = 'pending' | 'verified' | 'rejected';

export interface Worker {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  federation_id: string;
  federation_name?: string;
  skills: string[];
  certification_status: CertificationStatus;
  rating_avg: number;
  total_ratings?: number;
  completion_rate?: number;
  welfare_fund_balance: number;
  availability: WorkerAvailability;
  lat: number;
  lng: number;
  distance_m?: number;
}

export type BookingStatus =
  | 'requested'
  | 'matched'
  | 'in_progress'
  | 'completed'
  | 'rated';

export interface Booking {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  worker_id?: string;
  worker_name?: string;
  worker_phone?: string;
  service_type: string;
  status: BookingStatus;
  lat: number;
  lng: number;
  address?: string;
  scheduled_time?: string;
  is_emergency: boolean;
  price: number;
  created_at: string;
  updated_at?: string;
}

export interface FederationOverview {
  federation_id: string;
  federation_name: string;
  active_workers: number;
  total_workers: number;
  bookings_today: number;
  total_bookings: number;
  total_revenue: number;
  welfare_fund_total: number;
  pending_claims_count: number;
  pending_certifications_count: number;
  active_bookings_count: number;
}

export type WelfareTxType = 'contribution' | 'claim';
export type WelfareTxStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface WelfareTransaction {
  id: string;
  worker_id: string;
  worker_name?: string;
  worker_phone?: string;
  federation_id?: string;
  type: WelfareTxType;
  amount: number;
  status: WelfareTxStatus;
  reason?: string;
  created_at: string;
}

export interface FederationWelfareOverview {
  federation_id: string;
  total_pool_balance: number;
  total_contributions: number;
  total_claims_disbursed: number;
  pending_claims: WelfareTransaction[];
  recent_transactions: WelfareTransaction[];
}

// Contract: GET /forecast/{region} -> snake_case shape with nested model_info
export interface DayForecast {
  date: string;
  predicted_bookings: number;
  day_of_week?: string;
  is_weekend?: boolean;
}

export interface ForecastModelMetrics {
  mae: number;
  rmse: number;
  r2: number;
}

export interface ForecastModelInfo {
  model_type: string;
  metrics: ForecastModelMetrics;
  train_samples: number;
  training_timestamp: string;
}

export interface ForecastResponse {
  region: string;
  daily_forecast: DayForecast[];
  model_info: ForecastModelInfo;
}

// Alias kept for callers that only need the nested model info block
export type ModelInfo = ForecastModelInfo;
