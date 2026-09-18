import { Order } from "./order.model";
import Driver from "../driver/driver.model";
import {
  IOrder,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "./order.interface";

// Convert unknown errors into a readable message
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

// Create Order
export async function createOrder(data: Partial<IOrder>) {
  try {
    const order = await Order.create(data);

    console.log("Order created:", order._id);

    return order;
  } catch (error: unknown) {
    console.error("Error creating order:", error);

    throw new Error(
      getErrorMessage(error, "Failed to create order"),
    );
  }
}

// Get All Order
export async function getAllOrders(filters: {
  status?: OrderStatus;
  userId?: string;
  restaurantId?: string;
  driverId?: string;
}) {
  try {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.restaurantId) {
      query.restaurantId = filters.restaurantId;
    }

    if (filters.driverId) {
      query.driverId = filters.driverId;
    }

    const orders = await Order.find(query)
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .sort({ createdAt: -1 })
      .exec();

    return orders;
  } catch (error: unknown) {
    console.error("Error getting orders:", error);

    throw new Error(
      getErrorMessage(error, "Failed to get orders"),
    );
  }
}

// Get order by ID
export async function getOrderById(id: string) {
  try {
    const order = await Order.findById(id)
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .exec();

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error: unknown) {
    console.error("Error getting order:", error);

    throw new Error(
      getErrorMessage(error, "Failed to get order"),
    );
  }
}

// Get orders by user ID
export async function getOrdersByUser(userId: string) {
  try {
    const orders = await Order.find({ userId })
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .sort({ createdAt: -1 })
      .exec();

    return orders;
  } catch (error: unknown) {
    console.error("Error getting user orders:", error);

    throw new Error(
      getErrorMessage(error, "Failed to get user orders"),
    );
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
) {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new Error("Cancelled orders cannot be updated");
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new Error("Delivered orders cannot be updated");
    }

    const updateFields: Record<string, unknown> = {
      status,
    };

    if (status === OrderStatus.DELIVERED) {
      updateFields.deliveredAt = new Date();
    }

    // Release driver when an order is cancelled
    if (
      status === OrderStatus.CANCELLED &&
      order.driverId
    ) {
      await Driver.findByIdAndUpdate(
        order.driverId,
        {
          $set: {
            isAvailable: true,
          },
        },
        {
          runValidators: true,
        },
      ).exec();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .exec();

    if (!updatedOrder) {
      throw new Error("Order not found after status update");
    }

    console.log(
      `Order ${orderId} status updated to ${status}`,
    );

    return updatedOrder;
  } catch (error: unknown) {
    console.error("Error updating order status:", error);

    throw new Error(
      getErrorMessage(error, "Failed to update order status"),
    );
  }
}

// Assign driver to order
export async function assignDriverToOrder(
  orderId: string,
  driverId: string,
  estimatedDeliveryTime?: number,
) {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Order not found");
    }

    const blockedStatuses: OrderStatus[] = [
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ];

    if (blockedStatuses.includes(order.status)) {
      throw new Error(
        `Cannot assign a driver to an order with status: ${order.status}`,
      );
    }

    const driver = await Driver.findById(driverId).exec();

    if (!driver) {
      throw new Error("Driver not found");
    }

    const existingDriverId = order.driverId
      ? order.driverId.toString()
      : null;

    if (existingDriverId === driverId) {
      throw new Error(
        "This driver is already assigned to the order",
      );
    }

    if (!driver.isAvailable) {
      throw new Error("Driver is not available");
    }

    // Release previous driver if the order already had one
    if (order.driverId) {
      await Driver.findByIdAndUpdate(
        order.driverId,
        {
          $set: {
            isAvailable: true,
          },
        },
        {
          runValidators: true,
        },
      ).exec();
    }

    // Mark new driver as unavailable
    await Driver.findByIdAndUpdate(
      driverId,
      {
        $set: {
          isAvailable: false,
        },
      },
      {
        runValidators: true,
      },
    ).exec();

    const updateFields: Record<string, unknown> = {
      driverId,
      status: OrderStatus.OUT_FOR_DELIVERY,
    };

    if (estimatedDeliveryTime !== undefined) {
      updateFields.estimatedDeliveryTime =
        estimatedDeliveryTime;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .exec();

    if (!updatedOrder) {
      throw new Error("Order not found after driver assignment");
    }

    console.log(
      `Driver ${driverId} assigned to order ${orderId}`,
    );

    return updatedOrder;
  } catch (error: unknown) {
    console.error("Error assigning driver:", error);

    throw new Error(
      getErrorMessage(error, "Failed to assign driver"),
    );
  }
}

// Update Payment Status
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  paymentMethod?: PaymentMethod,
) {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Order not found");
    }

    const updateFields: Record<string, unknown> = {
      paymentStatus,
    };

    if (paymentMethod !== undefined) {
      updateFields.paymentMethod = paymentMethod;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .exec();

    if (!updatedOrder) {
      throw new Error("Order not found after payment update");
    }

    console.log(
      `Order ${orderId} payment updated: ${paymentStatus}`,
    );

    return updatedOrder;
  } catch (error: unknown) {
    console.error("Error updating payment:", error);

    throw new Error(
      getErrorMessage(error, "Failed to update payment status"),
    );
  }
}

// Cancel Order
export async function cancelOrder(orderId: string) {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Order not found");
    }

    const cancellableStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
    ];

    if (!cancellableStatuses.includes(order.status)) {
      throw new Error(
        `Cannot cancel an order with status: ${order.status}. ` +
          "Only PENDING or CONFIRMED orders can be cancelled.",
      );
    }

    // Release driver if one is assigned
    if (order.driverId) {
      await Driver.findByIdAndUpdate(
        order.driverId,
        {
          $set: {
            isAvailable: true,
          },
        },
        {
          runValidators: true,
        },
      ).exec();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: OrderStatus.CANCELLED,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("userId", "first_name last_name email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .exec();

    if (!updatedOrder) {
      throw new Error("Order not found after cancellation");
    }

    console.log(`Order ${orderId} cancelled`);

    return updatedOrder;
  } catch (error: unknown) {
    console.error("Error cancelling order:", error);

    throw new Error(
      getErrorMessage(error, "Failed to cancel order"),
    );
  }
}

// Delete Order
export async function deleteOrder(orderId: string) {
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Order not found");
    }

    // Release assigned driver before deleting order
    if (order.driverId) {
      await Driver.findByIdAndUpdate(
        order.driverId,
        {
          $set: {
            isAvailable: true,
          },
        },
        {
          runValidators: true,
        },
      ).exec();
    }

    await Order.findByIdAndDelete(orderId).exec();

    console.log(`Order ${orderId} deleted`);

    return {
      message: "Order deleted successfully",
    };
  } catch (error: unknown) {
    console.error("Error deleting order:", error);

    throw new Error(
      getErrorMessage(error, "Failed to delete order"),
    );
  }
}

// Get pending orders by user ID
export async function getAllPendingOrdersByUserId(
  userId: string,
) {
  try {
    const orders = await Order.find({
      userId,
      status: OrderStatus.PENDING,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "first_name last_name email phone address")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "vehicleType vehicleNumber phone")
      .exec();

    return orders;
  } catch (error: unknown) {
    console.error("Error getting pending orders:", error);

    throw new Error(
      getErrorMessage(error, "Failed to get pending orders"),
    );
  }
}