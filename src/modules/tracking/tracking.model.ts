import mongoose, { Schema, Document } from "mongoose";

export interface ITracking extends Document {
  orderId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  isActive: boolean;
  updatedAt: Date;
}

const trackingSchema = new Schema<ITracking>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    heading: {
      type: Number,
      default: null,
    },

    speed: {
      type: Number,
      default: null,
    },

    accuracy: {
      type: Number,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Tracking = mongoose.model<ITracking>("Tracking", trackingSchema);
