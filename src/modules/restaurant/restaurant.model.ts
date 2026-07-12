import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  description: string;
  image: string;
  phone: string;
  email: string;
  address: string;

  cuisine: string[];

  openingTime: string;
  closingTime: string;

  rating: number;

  isActive: boolean;

  owner: mongoose.Types.ObjectId;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    cuisine: [
      {
        type: String,
      },
    ],

    openingTime: {
      type: String,
      required: true,
    },

    closingTime: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
