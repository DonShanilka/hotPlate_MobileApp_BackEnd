import mongoose, { Schema } from "mongoose";
import {
  IOrder,
  IOrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "./order.interface";

// OrderItemSchema
const orderItemSchema = new Schema<IOrderItem>(
  {
    foodId: {
      type: Schema.Types.ObjectId,
      ref: "Food",
      required: false,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      required: false,
      trim: true,
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
  {
    _id: false,
  },
);

// Order Schema
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: false,
      default: null,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: false,
      default: null,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    deliveryLocation: {
      latitude: {
        type: Number,
        required: false,
      },
      longitude: {
        type: Number,
        required: false,
      },
    },

    subtotal: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },

    deliveryFee: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.CASH,
      required: true,
    },

    estimatedDeliveryTime: {
      type: Number,
      required: false,
      min: 1,
    },

    deliveredAt: {
      type: Date,
      required: false,
    },

    notes: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
