// App.tsx — Application Routing and Protected Route Guards
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { WorkerRoster } from './pages/WorkerRoster';
import { LiveBookings } from './pages/LiveBookings';
import { DemandForecast } from './pages/DemandForecast';
import { WelfareFund } from './pages/WelfareFund';

// Guard for protected federation routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="workers" element={<WorkerRoster />} />
          <Route path="bookings" element={<LiveBookings />} />
          <Route path="forecast" element={<DemandForecast />} />
          <Route path="welfare" element={<WelfareFund />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
