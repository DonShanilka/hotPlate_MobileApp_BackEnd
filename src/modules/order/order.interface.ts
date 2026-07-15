import mongoose from "mongoose";

// Represents a single item in an order
export interface IOrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

// Main Order interface
export interface IOrder {
  userId?: mongoose.Types.ObjectId | string; // Optional – guest orders allowed
  restaurantId?: mongoose.Types.ObjectId | string;
  driverId?: mongoose.Types.ObjectId | string;

  items: IOrderItem[];

  address: string;
  phoneNumber: string;

  totalPrice: number;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";

  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  paymentMethod?: "CASH" | "CARD" | "ONLINE";

  notes?: string;

  estimatedDeliveryTime?: number; // minutes
  deliveredAt?: Date;
}
