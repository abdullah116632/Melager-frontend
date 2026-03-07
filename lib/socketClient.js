import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socketInstance = null;

export function getSocket(options = {}) {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
      ...options,
    });
  }

  return socketInstance;
}

export function connectSocket(token) {
  const socket = getSocket();

  if (token) {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
  }
}
