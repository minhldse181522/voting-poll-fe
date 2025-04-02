import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_DB_HOST_API;

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Không dùng polling, bắt buộc WebSocket
  reconnectionAttempts: 10, // Cố gắng reconnect tối đa 10 lần
  reconnectionDelay: 5000, // Mỗi lần cách nhau 5 giây
});
socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

export default socket;
