import { Server } from "socket.io";
import { registerTrackingSocket } from "../modules/tracking/tracking.socket";

export const registerSockets = (io: Server) => {
  io.on("connection", (socket) => {
    registerTrackingSocket(io, socket);
  });
};