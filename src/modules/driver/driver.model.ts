import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["BIKE", "CAR"],
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    profileImage: {
      type: Buffer,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalDeliveries: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Driver", driverSchema);
