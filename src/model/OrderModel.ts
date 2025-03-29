import mongoose, { Document, Schema } from "mongoose";

const cartItemSchema = new Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
});

const orderSchema = new Schema(
    {
        address: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        delivery: {type: String, required: true},
        discount: {type: String, required: [0]},
        totalPrice: { type: Number, required: true },
        items: { type: [cartItemSchema], required: true },
    },
    { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);

interface OrderModel extends Document {
    address: string;
    phoneNumber: string;
    totalPrice: number;
    items: {
        name: string;
        size: string;
        quantity: number;
        price: number;
    }[];
}

export { OrderModel };