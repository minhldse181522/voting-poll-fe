import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_DB_HOST_API;

const socket = io(SOCKET_URL);
socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

export default socket;
