import { Document, Types } from "mongoose";

/**
 * Order status values
 */
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  DRIVER_ASSIGNED = "DRIVER_ASSIGNED",
  PICKED_UP = "PICKED_UP",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERING = "DELIVERING",
  ARRIVED = "ARRIVED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

/**
 * Payment status values
 */
export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

/**
 * Payment method values
 */
export enum PaymentMethod {
  CASH = "CASH",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  CARD = "CARD",
  ONLINE = "ONLINE",
}

/**
 * Order item
 */
export interface IOrderItem {
  foodId?: Types.ObjectId;
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

/**
 * Delivery location
 */
export interface IDeliveryLocation {
  latitude: number;
  longitude: number;
}

/**
 * Order document
 */
export interface IOrder extends Document {
  userId: Types.ObjectId;
  restaurantId?: Types.ObjectId | null;
  driverId?: Types.ObjectId | null;

  items: IOrderItem[];

  deliveryAddress: string;
  phoneNumber: string;

  deliveryLocation?: IDeliveryLocation;

  subtotal?: number;
  deliveryFee?: number;
  totalAmount: number;

  status: OrderStatus;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  estimatedDeliveryTime?: number;
  deliveredAt?: Date;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}