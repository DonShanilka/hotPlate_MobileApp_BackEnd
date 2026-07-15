import mongoose, { Schema } from "mongoose";
import { IMenu } from "./menu.interface";

const menuSchema = new Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: String,

    price: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    image: Buffer,

    isAvailable: {
      type: Boolean,
      default: true,
    },

    preparationTime: {
      type: Number,
    },

    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IMenu>("Menu", menuSchema);
