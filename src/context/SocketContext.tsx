// context/SocketContext.tsx — Real-Time Socket.IO event hub
// Contract events:
//   client -> server: join_federation {federation_id}
//   server -> client: status_update | new_booking | location_update
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface BookingStatusEvent {
  booking_id: string;
  old_status?: string;
  new_status: string;
  timestamp?: string;
}

interface NewBookingEvent {
  booking_id: string;
  service_type?: string;
  region?: string;
  price?: number;
  created_at?: string;
}

interface LocationUpdateEvent {
  booking_id: string;
  worker_id: string;
  lat: number;
  lng: number;
  ts?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  liveUpdatesCount: number;
  lastStatusUpdate: BookingStatusEvent | null;
  latestNewBooking: NewBookingEvent | null;
  liveWorkerLocations: Record<string, { lat: number; lng: number }>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  liveUpdatesCount: 0,
  lastStatusUpdate: null,
  latestNewBooking: null,
  liveWorkerLocations: {},
});

// Derive socket origin from VITE_API_URL (strip a trailing /api), else same origin.
const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) || '';
const SOCKET_URL = rawApiUrl ? rawApiUrl.replace(/\/api\/?$/, '') : window.location.origin;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentFederation, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveUpdatesCount, setLiveUpdatesCount] = useState(0);
  const [lastStatusUpdate, setLastStatusUpdate] = useState<BookingStatusEvent | null>(null);
  const [latestNewBooking, setLatestNewBooking] = useState<NewBookingEvent | null>(null);
  const [liveWorkerLocations, setLiveWorkerLocations] = useState<Record<string, { lat: number; lng: number }>>({});

  // Single long-lived connection. The JWT travels in the handshake `auth`
  // payload — the backend refuses unauthenticated socket connections.
  useEffect(() => {
    if (!token) return;

    const socketInstance = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 5000,
      auth: { token },
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.IO] Connected to backend dispatch hub');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected from backend dispatch hub');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', () => {
      setIsConnected(false);
    });

    // Contract server -> client events
    socketInstance.on('status_update', (data: BookingStatusEvent) => {
      console.log('[Socket.IO] Live booking event:', data);
      setLiveUpdatesCount((c) => c + 1);
      if (data?.booking_id) {
        setLastStatusUpdate(data);
      }
    });

    socketInstance.on('new_booking', (data: NewBookingEvent) => {
      console.log('[Socket.IO] New federation booking:', data);
      setLiveUpdatesCount((c) => c + 1);
      if (data?.booking_id) {
        setLatestNewBooking(data);
      }
    });

    socketInstance.on('location_update', (data: LocationUpdateEvent) => {
      if (data?.worker_id) {
        setLiveWorkerLocations((prev) => ({
          ...prev,
          [data.worker_id]: { lat: data.lat, lng: data.lng },
        }));
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token]);

  // Join the active federation room whenever the connection or selection changes.
  // Contract: client emits `join_federation` with {federation_id}.
  useEffect(() => {
    if (socket && isConnected && currentFederation?.id) {
      socket.emit('join_federation', { federation_id: currentFederation.id });
    }
  }, [socket, isConnected, currentFederation?.id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        liveUpdatesCount,
        lastStatusUpdate,
        latestNewBooking,
        liveWorkerLocations,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
