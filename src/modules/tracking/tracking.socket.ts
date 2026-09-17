import { Server, Socket } from "socket.io";
import { TrackingService } from "./tracking.service";

const trackingService = new TrackingService();

export const registerTrackingSocket = (
  io: Server,
  socket: Socket
) => {
  socket.on(
    "join_order_tracking",
    async ({ orderId }) => {
      try {
        // TODO:
        // Verify authenticated customer owns this order.

        socket.join(`order:${orderId}`);

        socket.emit("tracking_joined", {
          orderId,
        });
      } catch (error: any) {
        socket.emit("tracking_error", {
          message: error.message,
        });
      }
    }
  );

  socket.on(
    "driver_location_update",
    async (data) => {
      try {
        // IMPORTANT:
        // Get driverId from authenticated socket user.
        const driverId = socket.data.user.id;

        const location =
          await trackingService.updateDriverLocation(
            driverId,
            data
          );

        io.to(`order:${data.orderId}`).emit(
          "driver_location_updated",
          {
            orderId: data.orderId,
            latitude: location.latitude,
            longitude: location.longitude,
            heading: location.heading,
            speed: location.speed,
            accuracy: location.accuracy,
            updatedAt: location.updatedAt,
          }
        );
      } catch (error: any) {
        socket.emit("tracking_error", {
          message: error.message,
        });
      }
    }
  );

  socket.on(
    "leave_order_tracking",
    ({ orderId }) => {
      socket.leave(`order:${orderId}`);
    }
  );
};