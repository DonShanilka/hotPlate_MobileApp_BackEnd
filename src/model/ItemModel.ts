import mongoose, { Schema, Document } from "mongoose";

interface Iitem extends Document {
  itemName?: string;
  catogory: string;
  discription: string;
  shopName: string;
  price: number;
}

const ItemSchema: Schema<Iitem> = new Schema(
  {
    itemName: {
      type: String,
      required: [true, "Please enter a name"],
      trim: true,
    },
    catogory: {
      type: String,
      required: [true, "Please enter a catogory"],
      trim: true,
    },
    discription: {
      type: String,
      required: [true, "Please enter a discription"],
      trim: true,
    },
    shopName: {
      type: String,
      required: [true, "Please enter a shop name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter a price"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model<Iitem>("Item", ItemSchema);

export default Item;
export { Iitem };
