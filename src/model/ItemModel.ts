import mongoose, { Schema, Document } from "mongoose";

interface Iitem extends Document {
    itemName: string; // itemName should be required
    category: string; // Fixed spelling
    description: string; // Fixed spelling
    shopName: string;
    price: number;
    image: string; // If you're storing the image URL, use String instead of Buffer
}

const ItemSchema: Schema<Iitem> = new Schema(
    {
        itemName: {
            type: String,
            required: [true, "Please enter a name"],
        },
        category: {  // Fixed spelling here as well
            type: String,
            required: [true, "Please enter a category"], // Fixed spelling
        },
        description: {  // Fixed spelling here as well
            type: String,
            required: [true, "Please enter a description"], // Fixed spelling
        },
        shopName: {
            type: String,
            required: [true, "Please enter a shop name"],
        },
        price: {
            type: Number,
            required: [true, "Please enter a price"],
        },
        image: {
            type: String, // Changed from Buffer to String (for image URL)
            required: [true, "Please select an image"], // Fixed spelling
        },
    },
    {
        timestamps: true,
    }
);

const Item = mongoose.model<Iitem>("Item", ItemSchema);

export default Item;
export { Iitem };
