import express from "express";
import {Iitem} from "../model/ItemModel";
const itemService =  require("../service/ItemService");

export async function AddItem (req : any, res : any) {
    const items = req.body;  // This will hold the item data sent from Postman or frontend
    console.log("Received Items in Controller: ", items);  // Log the received data

    // Check if the fields are missing from the request body
    if (!items.itemName || !items.category || !items.description || !items.shopName || !items.price || !items.image) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields: itemName, category, description, shopName, price, and image in Controller"
        });
    }

    try {
        const additems = await itemService.AddItem(items);  // Call your service to add the item
        return res.status(200).json({ success: true, items: additems });
    } catch (error) {
        console.error("Error Adding Items: ", error);
        return res.status(500).json({ success: false, message: "Error adding items" });
    }
}

export const getAllItemsController = async (req: Request, res: Response) => {
    try {
        await itemService.getAllItems(req, res);  // Call the service function that fetches items
    } catch (error) {
        console.error("Error in getAllItemsController:", error);
        // @ts-ignore
        res.status(500).json({ message: "Internal server error" });  // Send a generic error message if something goes wrong
    }
};
