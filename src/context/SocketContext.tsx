// context/SocketContext.tsx — Real-Time Socket.IO event hub
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Booking } from '../types';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  liveUpdatesCount: number;
  lastUpdatedBooking: Booking | null;
  liveWorkerLocations: Record<string, { lat: number; lng: number }>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  liveUpdatesCount: 0,
  lastUpdatedBooking: null,
  liveWorkerLocations: {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentFederation, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveUpdatesCount, setLiveUpdatesCount] = useState(0);
  const [lastUpdatedBooking, setLastUpdatedBooking] = useState<Booking | null>(null);
  const [liveWorkerLocations, setLiveWorkerLocations] = useState<Record<string, { lat: number; lng: number }>>({});

  useEffect(() => {
    // Attempt real Socket.IO connection
    const socketInstance = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.IO] Connected to backend dispatch hub');
      setIsConnected(true);
      if (currentFederation?.id) {
        socketInstance.emit('join_federation_room', { federation_id: currentFederation.id });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected from backend dispatch hub');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', () => {
      setIsConnected(false);
    });

    // Listen for live booking updates
    socketInstance.on('booking_status_updated', (data: any) => {
      console.log('[Socket.IO] Live booking event:', data);
      setLiveUpdatesCount((c) => c + 1);
      if (data?.booking) {
        setLastUpdatedBooking(data.booking);
      }
    });

    // Listen for worker GPS stream
    socketInstance.on('worker_location_stream', (data: { worker_id: string; lat: number; lng: number }) => {
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
    };
  }, [currentFederation?.id, isAuthenticated]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        liveUpdatesCount,
        lastUpdatedBooking,
        liveWorkerLocations,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
