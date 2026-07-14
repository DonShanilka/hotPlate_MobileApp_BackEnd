import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  profile_image: string;
  status: string;
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
      default: "CUSTOMER",
    },

    profile_image: {
      type: String,
    },

    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>("User", UserSchema);
