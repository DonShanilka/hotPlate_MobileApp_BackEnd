import { Tracking } from "./tracking.model";
import { Order } from "../order/order.model";
import { UpdateDriverLocationDTO } from "./tracking.types";

export class TrackingService {
  async updateDriverLocation(
    driverId: string,
    data: UpdateDriverLocationDTO
  ) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Important:
    // Verify that this driver is assigned to this order.
    if (String(order.driverId) !== driverId) {
      throw new Error(
        "Driver is not assigned to this order"
      );
    }

    if (
      !["DRIVER_ASSIGNED", "PICKED_UP", "DELIVERING", "ARRIVED"]
        .includes(order.status)
    ) {
      throw new Error(
        "Tracking is not available for this order status"
      );
    }

    const tracking = await Tracking.findOneAndUpdate(
      {
        orderId: data.orderId,
      },
      {
        orderId: data.orderId,
        driverId,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading ?? null,
        speed: data.speed ?? null,
        accuracy: data.accuracy ?? null,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    return tracking;
  }

  async getOrderTracking(
    orderId: string,
    customerId: string
  ) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify order ownership.
    if (String(order.userId) !== customerId) {
      throw new Error("You cannot access this order");
    }

    const tracking = await Tracking.findOne({
      orderId,
    });

    return {
      orderId: order._id,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      deliveryLocation: order.deliveryLocation,
      tracking,
    };
  }

  async stopTracking(orderId: string) {
    return Tracking.findOneAndUpdate(
      { orderId },
      { isActive: false },
      { new: true }
    );
  }
}