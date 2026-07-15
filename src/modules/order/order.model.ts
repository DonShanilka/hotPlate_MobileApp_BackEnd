import mongoose, { Schema } from "mongoose";
import { IOrder } from "./order.interface";

// Sub-schema for individual order items
const orderItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }, // No separate _id for sub-documents
);

const orderSchema = new Schema<IOrder>(
  {
    // Optional references – allows guest and authenticated orders
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    // Cart items from the mobile client
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr: any[]) => arr.length > 0,
        message: "Order must contain at least one item",
      },
    },

    // Delivery information
    address: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order lifecycle status
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY_FOR_PICKUP",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    // Payment info
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED"],
      default: "UNPAID",
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "ONLINE"],
      default: "CASH",
    },

    // Extra fields
    notes: {
      type: String,
    },

    estimatedDeliveryTime: {
      type: Number, // minutes
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOrder>("Order", orderSchema);
