import Order from "./order.model";
import Driver from "../driver/driver.model";
import { IOrder } from "./order.interface";

// create order
export async function createOrder(data: Partial<IOrder>) {
  try {
    const order = await Order.create(data);
    console.log("Order Created:", order._id);
    return order;
  } catch (error: any) {
    console.error("Error Creating Order:", error);
    throw new Error(error.message || "Failed to create order");
  }
}

// get all orders
export async function getAllOrders(filters: {
  status?: string;
  userId?: string;
  restaurantId?: string;
  driverId?: string;
}) {
  try {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.userId) query.userId = filters.userId;
    if (filters.restaurantId) query.restaurantId = filters.restaurantId;
    if (filters.driverId) query.driverId = filters.driverId;

    const orders = await Order.find(query)
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .sort({ createdAt: -1 });

    return orders;
  } catch (error: any) {
    console.error("Error Getting Orders:", error);
    throw new Error("Failed to get orders");
  }
}

// get order by id
export async function getOrderById(id: string) {
  try {
    const order = await Order.findById(id)
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone");

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error: any) {
    console.error("Error Getting Order:", error);
    throw new Error(error.message || "Failed to get order");
  }
}

// Get orders by user ID
export async function getOrdersByUser(userId: string) {
  try {
    const orders = await Order.find({ userId })
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .sort({ createdAt: -1 });

    return orders;
  } catch (error: any) {
    console.error("Error Getting User Orders:", error);
    throw new Error("Failed to get user orders");
  }
}

// update order status
export async function updateOrderStatus(id: string, status: IOrder["status"]) {
  try {
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    // Auto-set deliveredAt when status becomes DELIVERED
    const update: any = { status };
    if (status === "DELIVERED") {
      update.deliveredAt = new Date();
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    )
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone");

    console.log(`Order ${id} status updated to: ${status}`);
    return updated;
  } catch (error: any) {
    console.error("Error Updating Order Status:", error);
    throw new Error(error.message || "Failed to update order status");
  }
}

//  assign driver to order
export async function assignDriverToOrder(
  orderId: string,
  driverId: string,
  estimatedDeliveryTime?: number,
) {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    // Verify driver exists and is available
    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error("Driver not found");
    if (!driver.isAvailable) throw new Error("Driver is not available");

    const updateFields: any = {
      driverId,
      status: "OUT_FOR_DELIVERY",
    };

    if (estimatedDeliveryTime !== undefined) {
      updateFields.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    // Mark driver as unavailable
    driver.isAvailable = false;
    await driver.save();

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true, runValidators: true },
    )
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone");

    console.log(`Driver ${driverId} assigned to order ${orderId}`);
    return updated;
  } catch (error: any) {
    console.error("Error Assigning Driver:", error);
    throw new Error(error.message || "Failed to assign driver");
  }
}

//  update payment status
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: IOrder["paymentStatus"],
  paymentMethod?: IOrder["paymentMethod"],
) {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    const updateFields: any = { paymentStatus };
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    console.log(`Order ${orderId} payment updated: ${paymentStatus}`);
    return updated;
  } catch (error: any) {
    console.error("Error Updating Payment:", error);
    throw new Error(error.message || "Failed to update payment status");
  }
}

// cancel order
export async function cancelOrder(orderId: string) {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    // Only allow cancellation for early statuses
    const cancellableStatuses: IOrder["status"][] = ["PENDING", "CONFIRMED"];
    if (!cancellableStatuses.includes(order.status)) {
      throw new Error(
        `Cannot cancel an order with status: ${order.status}. Only PENDING or CONFIRMED orders can be cancelled.`,
      );
    }

    // Free up the driver if assigned
    if (order.driverId) {
      await Driver.findByIdAndUpdate(order.driverId, {
        $set: { isAvailable: true },
      });
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: "CANCELLED" } },
      { new: true },
    );

    console.log(`Order ${orderId} cancelled`);
    return updated;
  } catch (error: any) {
    console.error("Error Cancelling Order:", error);
    throw new Error(error.message || "Failed to cancel order");
  }
}

//  delete order (admin only)
export async function deleteOrder(orderId: string) {
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) throw new Error("Order not found");

    console.log(`Order ${orderId} deleted`);
    return { message: "Order deleted successfully" };
  } catch (error: any) {
    console.error("Error Deleting Order:", error);
    throw new Error(error.message || "Failed to delete order");
  }
}

// get pending order by user ID
export async function getAllPendingOrdersByUserId(userId: string) {
  try {
    const orders = await Order.find({
      userId,
      status: "PENDING",
    })
      .sort({ createdAt: -1 })
      .populate("userId", "first_name last_name email phone address");

    return orders;
  } catch (error: any) {
    throw new Error(error.message || "Failed to get pending orders");
  }
}