import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER";
  profile_image?: string;
  address?: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

const UserSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },

    last_name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["CUSTOMER"],
      default: "CUSTOMER",
    },

    profile_image: {
      type: String,
    },

    address: {
      type: String,
      trim: true,
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

UserSchema.pre("save", function (next) {
  this.role = "CUSTOMER";
  next();
});

UserSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function (next) {
  const update = this.getUpdate() as Record<string, any>;

  if (!update) {
    return next();
  }

  if (update.$set) {
    update.$set.role = "CUSTOMER";
  } else {
    update.role = "CUSTOMER";
  }

  next();
});

export default mongoose.model<IUser>("User", UserSchema);