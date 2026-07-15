import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role: "CUSTOMER" | "DRIVER" | "RESTAURANT" | "ADMIN";
  profile_image: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

const UserSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "DRIVER", "RESTAURANT", "ADMIN"],
      default: "CUSTOMER",
    },

    profile_image: {
      type: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>("User", UserSchema);

