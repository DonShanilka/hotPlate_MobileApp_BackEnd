import { Request, Response } from "express";
import {
  addOrderSchema,
  updateStatusSchema,
  assignDriverSchema,
  updatePaymentSchema,
} from "./order.validation";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  assignDriverToOrder,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
  getAllPendingOrdersByUserId,
} from "./order.service";

// add prder
// Mobile client: AddOrderDetails.tsx → sends { address, phoneNumber, totalPrice, items }
export async function AddOrder(req: Request, res: Response) {
  try {
    const { error, value } = addOrderSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    // Attach authenticated user if token present
    const userId = (req as any).user?.id || value.userId || null;

    const order = await createOrder({
      userId,
      restaurantId: value.restaurantId || null,
      address: value.address,
      phoneNumber: value.phoneNumber,
      totalPrice: value.totalPrice,
      items: value.items,
      paymentMethod: value.paymentMethod,
      notes: value.notes,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("AddOrder Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
}

// get all orders
export async function getOrders(req: Request, res: Response) {
  try {
    const { status, userId, restaurantId, driverId } = req.query;

    const orders = await getAllOrders({
      status: status as string | undefined,
      userId: userId as string | undefined,
      restaurantId: restaurantId as string | undefined,
      driverId: driverId as string | undefined,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error("getOrders Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get orders",
    });
  }
}

// get orderby id
export async function getOrder(req: Request, res: Response) {
  try {
    const order = await getOrderById(req.params.id as any);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("getOrder Error:", error);
    const statusCode = error.message === "Order not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to get order",
    });
  }
}

// get my order
// Uses the authenticated user's ID from the JWT token
export async function getMyOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await getOrdersByUser(userId);

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error("getMyOrders Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get your orders",
    });
  }
}

// update status
export async function updateStatus(req: Request, res: Response) {
  try {
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const order = await updateOrderStatus(req.params.id as any, value.status);

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${value.status}`,
      data: order,
    });
  } catch (error: any) {
    console.error("updateStatus Error:", error);
    const statusCode = error.message === "Order not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
}

// assign Driver
export async function assignDriver(req: Request, res: Response) {
  try {
    const { error, value } = assignDriverSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const order = await assignDriverToOrder(
      req.params.id as any,
      value.driverId,
      value.estimatedDeliveryTime,
    );

    return res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("assignDriver Error:", error);
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("not available")
        ? 400
        : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to assign driver",
    });
  }
}

// update payment
export async function updatePayment(req: Request, res: Response) {
  try {
    const { error, value } = updatePaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const order = await updatePaymentStatus(
      req.params.id as any,
      value.paymentStatus,
      value.paymentMethod,
    );

    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${value.paymentStatus}`,
      data: order,
    });
  } catch (error: any) {
    console.error("updatePayment Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update payment",
    });
  }
}

// cancel order
export async function cancelOrderHandler(req: Request, res: Response) {
  try {
    const order = await cancelOrder(req.params.id as any);

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("cancelOrder Error:", error);
    const statusCode =
      error.message === "Order not found"
        ? 404
        : error.message.includes("Cannot cancel")
          ? 400
          : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
}

//  delete
export async function deleteOrderHandler(req: Request, res: Response) {
  try {
    const result = await deleteOrder(req.params.id as any);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("deleteOrder Error:", error);
    const statusCode = error.message === "Order not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete order",
    });
  }
}

// get pending order by user id
export const getPendingOrdersByUser = async (req: Request, res: Response) => {
  try {
    const orders = await getAllPendingOrdersByUserId(req.params.userId as any);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};