import mongoose from "mongoose";

export interface IDriver {

  userId: mongoose.Types.ObjectId | string;
  vehicleType: "BIKE" | "CAR";
  vehicleNumber: string;
  licenseNumber: string;
  phone: string;
  address: string;
  profileImage?: Buffer;
  isAvailable?: boolean;
  isActive?: boolean;
  rating?: number;

}
