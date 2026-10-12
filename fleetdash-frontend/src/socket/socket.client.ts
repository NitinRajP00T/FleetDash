import { io, Socket } from 'socket.io-client';
import { storage } from '../utils/storage';

const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  auth: (cb) => {
    cb({ token: storage.getAccessToken() });
  },
});
