import { Request, Response } from "express";
import mongoose from "mongoose";

import {
  addOrderSchema,
  updateOrderStatusSchema,
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

import { OrderStatus, PaymentMethod, PaymentStatus } from "./order.interface";


// Safely extract a route parameter as a string.

const getParamString = (
  value: string | string[] | undefined,
): string | null => {
  return typeof value === "string" ? value : null;
};


// Get authenticated user ID.

const getAuthenticatedUserId = (req: Request): string | null => {
  const user = (
    req as Request & {
      user?: {
        id?: string;
        _id?: string;
        userId?: string;
      };
    }
  ).user;

  if (!user) {
    return null;
  }

  return user.id || user._id || user.userId || null;
};


// Convert unknown errors into readable messages.
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

// Validate MongoDB ObjectId.
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// create order
export const AddOrder = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { error, value } = addOrderSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const authenticatedUserId = getAuthenticatedUserId(req);
    const userId = authenticatedUserId || value.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication is required",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (value.restaurantId && !isValidObjectId(value.restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const order = await createOrder({
      userId,
      restaurantId: value.restaurantId,
      items: value.items,
      deliveryAddress: value.deliveryAddress,
      phoneNumber: value.phoneNumber,
      deliveryLocation: value.deliveryLocation,
      subtotal: value.subtotal,
      deliveryFee: value.deliveryFee,
      totalAmount: value.totalAmount,
      paymentMethod: value.paymentMethod as PaymentMethod,
      notes: value.notes,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Get All Orders
export const GetAllOrders = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const status = req.query.status;

    let orders;

    if (typeof status === "string") {
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      orders = await getAllOrders(status as any);
    } else {
      orders = await getAllOrders(status as any);
    }

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Get Order By Id
export const GetOrderById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = getParamString(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Get Order By User Id
export const GetOrdersByUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const userId = getParamString(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const orders = await getOrdersByUser(userId);

    return res.status(200).json({
      success: true,
      message: "User orders retrieved successfully",
      data: orders,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Update Order Status
export const UpdateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = getParamString(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { error, value } = updateOrderStatusSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const order = await updateOrderStatus(id, value.status as OrderStatus);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Assign driver to order
export const AssignDriverToOrder = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = getParamString(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { error, value } = assignDriverSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const driverId = value.driverId;

    if (!isValidObjectId(driverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid driver ID",
      });
    }

    const order = await assignDriverToOrder(id, driverId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      data: order,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Update Payement Status
export const UpdatePaymentStatus = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = getParamString(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { error, value } = updatePaymentSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const order = await updatePaymentStatus(
      id,
      value.paymentStatus as PaymentStatus,
      value.paymentMethod as PaymentMethod | undefined,
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Cancel Order
export const CancelOrder = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = getParamString(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await cancelOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Delete Order
export const DeleteOrder = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = getParamString(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const result = await deleteOrder(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Get pending orders by user ID
export const GetAllPendingOrdersByUserId = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const userId = getParamString(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const orders = await getAllPendingOrdersByUserId(userId);

    return res.status(200).json({
      success: true,
      message: "Pending orders retrieved successfully",
      data: orders,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// Aliases required by order.routes.ts
export const getOrders = GetAllOrders;
export const getOrder = GetOrderById;
export const getMyOrders = GetOrdersByUser;
export const updateStatus = UpdateOrderStatus;
export const assignDriver = AssignDriverToOrder;
export const updatePayment = UpdatePaymentStatus;
export const cancelOrderHandler = CancelOrder;
export const deleteOrderHandler = DeleteOrder;
export const getPendingOrdersByUser = GetAllPendingOrdersByUserId;
