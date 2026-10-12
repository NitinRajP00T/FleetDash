import React, { createContext, useEffect, useState } from 'react';
import { socket } from './socket.client';
import { useAuthStore } from '../store/useAuthStore';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { useDriverStore } from '../store/useDriverStore';
import { useTripStore } from '../store/useTripStore';
import { useAlertStore } from '../store/useAlertStore';
import { useDashboardStore } from '../store/useDashboardStore';

interface SocketContextType {
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

export const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { isAuthenticated } = useAuthStore();

  const addTelemetryPoint = useTelemetryStore((s) => s.addTelemetryPoint);
  const upsertVehicle = useVehicleStore((s) => s.upsertVehicle);
  const upsertDriver = useDriverStore((s) => s.upsertDriver);
  const upsertTrip = useTripStore((s) => s.upsertTrip);
  const addAlert = useAlertStore((s) => s.addAlert);
  const fetchDashboardOverview = useDashboardStore((s) => s.fetchOverview);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket.connected) socket.disconnect();
      return;
    }

    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      console.log('⚡ Connected to FleetDash Socket.io Server');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('🔌 Disconnected from FleetDash Socket.io Server');
    };

    const onTelemetryUpdate = (data: any) => {
      addTelemetryPoint(data);
    };

    const onVehicleUpdate = (data: any) => {
      upsertVehicle(data);
    };

    const onDriverUpdate = (data: any) => {
      upsertDriver(data);
    };

    const onTripUpdate = (data: any) => {
      upsertTrip(data);
    };

    const onAlertNew = (data: any) => {
      addAlert(data);
    };

    const onDashboardUpdate = () => {
      fetchDashboardOverview();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('telemetry:update', onTelemetryUpdate);
    socket.on('vehicle:update', onVehicleUpdate);
    socket.on('driver:update', onDriverUpdate);
    socket.on('trip:update', onTripUpdate);
    socket.on('alert:new', onAlertNew);
    socket.on('dashboard:update', onDashboardUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('telemetry:update', onTelemetryUpdate);
      socket.off('vehicle:update', onVehicleUpdate);
      socket.off('driver:update', onDriverUpdate);
      socket.off('trip:update', onTripUpdate);
      socket.off('alert:new', onAlertNew);
      socket.off('dashboard:update', onDashboardUpdate);
      socket.disconnect();
    };
  }, [isAuthenticated]);

  const joinRoom = (room: string) => {
    if (socket.connected) {
      socket.emit('join:room', room);
    }
  };

  const leaveRoom = (room: string) => {
    if (socket.connected) {
      socket.emit('leave:room', room);
    }
  };

  return (
    <SocketContext.Provider value={{ isConnected, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
