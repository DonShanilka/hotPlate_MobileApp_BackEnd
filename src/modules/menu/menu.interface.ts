import mongoose from "mongoose";

export interface IMenu {

  restaurantId: mongoose.Types.ObjectId | string;
  name: string;
  description: string;
  price: number;
  image?: Buffer;
  isAvailable?: boolean;
  preparationTime?: number;
  discount?: number;
  
}
