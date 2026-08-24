# 🤝 SahaKarya — Federation Admin Portal (Frontend Web App)

[![SIH Problem Statement](https://img.shields.io/badge/SIH_Problem_Statement-SIH26089-FF9933.svg)](https://smartindiahackathon.gov.in)
[![Ministry](https://img.shields.io/badge/Ministry-Ministry_of_Cooperation_(NCCT)-138808.svg)](https://cooperation.gov.in)
[![Theme](https://img.shields.io/badge/Theme-Smart_Automation-000080.svg)](https://smartindiahackathon.gov.in)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

> **Official Control Center for Labour Cooperative Federations**  
> An institutional digital command center that empowers Labour Cooperative Federations to manage certified worker rosters, monitor real-time geospatial dispatch, analyze AI-driven 7-day demand forecasts, and administer a 100% non-extractable worker welfare trust fund.

---

## 🏛️ Ecosystem Overview

| App | User Persona | Stack | Repository |
|---|---|---|---|
| **Admin Dashboard** | Federation Officials / Board | React / TypeScript / Vite / Tailwind / Recharts / Socket.IO | [Sahakaryaa/Frontend-Web-App](https://github.com/Sahakaryaa/Frontend-Web-App.git) |
| **Customer App** | Households & Community Clients | Flutter / Riverpod / GoRouter / OpenStreetMap | [Sahakaryaa/Customer-App](https://github.com/Sahakaryaa/Customer-App.git) |
| **Worker App** | Federation Trade Workers | Flutter / Riverpod / Socket.IO / Location Stream | [Sahakaryaa/Worker-App](https://github.com/Sahakaryaa/Worker-App.git) |
| **Backend API** | Unified Async Engine | FastAPI / MongoDB (2dsphere) / Scikit-Learn | [Sahakaryaa/Backend](https://github.com/Sahakaryaa/Backend.git) |

---

## ✨ Key Features & Capabilities

### 1. 📊 Executive Overview & KPI Command Center
- **Staggered Animated KPI Cards**: Real-time tracking of Active Federation Workers, Daily Bookings Volume, Gross GMV, and Liquid Welfare Pool Balance.
- **Weekly Revenue & Welfare Velocity Chart**: Recharts Area visualization contrasting direct worker earnings (95%) with automatic welfare accumulation (5%).
- **Skill Trade Distribution**: Real-time breakdown across Electricians, Plumbers, Cleaners, Caregivers, Carpenters, and Painters.
- **Actionable Governance Alerts**: Instant notifications for pending welfare claims and worker skill certifications.

### 2. 👷 Worker Roster & Trade Skill Vetting
- **Sortable & Filterable Roster**: Filter by trade category, availability (Online/Offline), and verification status.
- **Inline Certification Approvals**: Grant or revoke verified status with immediate state updates.
- **Worker Institutional Dossier**: Side drawer displaying verified trade badges, performance rating history, welfare balance, and geospatial 2dsphere anchor coordinates.

### 3. 📡 Real-Time Dispatch Console (Socket.IO)
- **Live Stream Hub**: Bi-directional real-time event listener tracking booking status transitions (`requested` → `matched` → `in_progress` → `completed` → `rated`).
- **Interactive Booking Console**: Comprehensive customer and assigned worker contact cards with full location addresses.
- **Dispatch Lifecycle Stepper**: Visual step progress indicator with administrative state override capabilities.

### 4. 🧠 AI Demand Forecasting & Workforce Allocation
- **7-Day Projected Demand**: Multi-zone Gradient Boosting regression model predictions with 90% confidence bands.
- **Operational Zone & Trade Filtering**: Granular projections across North, South, West, East, and Central zones.
- **ML Performance Transparency**: Model accuracy ($R^2 = 0.958$), Mean Absolute Error ($\text{MAE} = 0.84\text{ bookings/day}$), and feature importance ranking (Rolling averages, weekend seasonality multipliers).
- **Retrain Pipeline Trigger**: Live retraining trigger connected to `POST /forecast/train`.

### 5. 🛡️ Cooperative Welfare Fund Governance
- **100% Retained Member Social Security**: Demonstrates the cooperative differentiator where 5% of completed bookings are ring-fenced for member grants.
- **Actionable Claims Queue**: Approve or reject medical relief, accident aid, or education scholarship grants.
- **Audit Ledger**: Comprehensive immutable record of all 5% booking levies and approved disbursements.

---

## 🎨 Design System & Tokens

The application follows the official SahaKarya institutional design system:

| Design Token | Hex / Value | Usage |
|---|---|---|
| `--color-teal` | `#1B4B43` | Primary brand, institutional navigation, headers |
| `--color-orange` | `#FF6B35` | Primary CTA, urgent state alerts, active accents |
| `--color-gold` | `#FFC145` | Badges, ratings, certification stars |
| `--color-bg` | `#F7F3E9` | Warm ivory background |
| `--color-ink` | `#1A1A1A` | High-contrast body typography |
| **Display Font** | `Sora` | Headings, KPI values, screen titles |
| **Body Font** | `Inter` | Body copy, data labels, buttons |
| **Mono Font** | `JetBrains Mono` | IDs, timestamps, coordinates, metrics |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+ (or pnpm / yarn)
- **Backend API**: Running at `http://localhost:8000` (optional, offline demo mode with mock data built-in)

### Installation & Run

```bash
# Clone repository
git clone https://github.com/Sahakaryaa/Frontend-Web-App.git
cd Frontend-Web-App

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The portal will launch at **`http://localhost:5173`**.

---

## 🔑 Demo Credentials

| Role | Phone | Password |
|---|---|---|
| **Federation Secretary (Admin)** | `9999900000` | `admin123` |
| *Quick Login* | Click the **"Quick Demo Login"** button on the sign-in screen. |

---

## 📂 Project Structure

```
admin-dashboard/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── theme/
│   │   └── tokens.css            # Exact CSS design system tokens
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces matching backend models
│   ├── api/
│   │   ├── client.ts             # Axios instance + JWT interceptor
│   │   └── endpoints.ts          # Unified REST endpoints & offline fallback
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication & federation state
│   │   └── SocketContext.tsx     # Real-time Socket.IO dispatch stream
│   ├── data/
│   │   └── mockData.ts           # Labeled demo seed dataset
│   ├── components/
│   │   ├── common/
│   │   │   ├── CooperativeBadge.tsx  # Signature "Cooperative Verified" pill
│   │   │   ├── KpiCard.tsx           # Staggered animated KPI card
│   │   │   ├── StatusPill.tsx        # Semantic status badge with live pulse
│   │   │   ├── SkeletonLoader.tsx    # Shimmer loading states
│   │   │   ├── EmptyState.tsx        # Empty view handler
│   │   │   └── ErrorState.tsx        # Error boundary with retry
│   │   └── layout/
│   │       ├── Sidebar.tsx           # Institutional teal navigation
│   │       ├── Header.tsx            # Federation selector & status
│   │       └── DashboardLayout.tsx   # Shell container
│   └── pages/
│       ├── Login.tsx                 # Official gateway & 1-click login
│       ├── Overview.tsx              # First-impression KPI dashboard
│       ├── WorkerRoster.tsx          # Roster table & certification
│       ├── LiveBookings.tsx          # Real-time dispatch console
│       ├── DemandForecast.tsx        # 7-day AI demand regression
│       └── WelfareFund.tsx           # Welfare pool & claims queue
```

---

## 📜 License & Acknowledgments

Built for the **Smart India Hackathon (SIH 2024 / 2026)** under Problem Statement **SIH26089** by **Ministry of Cooperation (NCCT)**.
