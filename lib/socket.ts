import { io, Socket } from 'socket.io-client';

// Map to the standalone Node.js server we established in `/server/socket.ts`
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

// Create a globally persistent, singleton socket instance
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,          // Connect natively as soon as imported
  reconnection: true,         // Automatically try to reconnect
  reconnectionAttempts: 10,   // Try fairly often to resolve ghost disconnects
  reconnectionDelay: 1500,    // Space out reconnect attempts across 1.5 seconds
});

// Helper listeners strictly for local debug monitoring
socket.on('connect', () => {
  console.log(`[Socket.io] Connected to server bridging DB real-time events. ID: ${socket.id}`);
});

socket.on('disconnect', (reason) => {
  console.warn(`[Socket.io] Disconnected from server. Reason: ${reason}`);
});

export default socket;
