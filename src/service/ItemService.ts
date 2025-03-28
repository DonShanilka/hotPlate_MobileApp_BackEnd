import mongoose from "mongoose";
import Item , { Iitem } from "../model/ItemModel";

export async function AddItem(item: Iitem) {
    try {
        if (!item.itemName || !item.category || !item.description || !item.shopName || !item.price || !item.image) {
            throw new Error("Missing required fields in Service");
        }

        const newItem = new Item({
            itemName: item.itemName,
            category: item.category,
            description: item.description,
            shopName: item.shopName,
            price: item.price,
            image: item.image
        });

        const saveItem = await newItem.save();
        console.log("Item Saved: ", saveItem);
        return saveItem;
    } catch (error) {
        console.log("Error Save Item in Service", error);
        throw error;
    }
}

export async function getAllItems(req: any, res: any) {
    try {
        const items = await Item.find();  // Fetch all items from MongoDB
        if (!items) {
            return res.status(404).json({ message: "No items found" });  // Return 404 if no items are found
        }
        console.log(items);  // Log the items for debugging
        return res.json(items);  // Send the fetched items as JSON in the response
    } catch (error) {
        console.log("Error fetching items:", error);
        // @ts-ignore
        res.status(500).json({ message: "Error fetching items", error: error.message });  // Return error in case of failure
    }
}
