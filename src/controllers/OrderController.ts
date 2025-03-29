import express from "express";
import {getAllOrders, saveOrder} from "../service/OrderService";

export async function AddOrder (req:any, res:any){
    const { address, phoneNumber, totalPrice, items } = req.body;
    try{
        const added = await saveOrder({
            address,
            phoneNumber,
            totalPrice,
            items,
        });
        res.status(201).json({ success: true, user: added });
    }catch (err){
        console.log("Error during order :",err);
    }
}

export async function getAllOrder (req:any, res: any)  {
    try {
        const orders = await getAllOrders();
        console.log(orders);
        res.status(200).json({
            success: true,
            orders: orders,
        });
    } catch (err) {
        console.log("Error during data fetching :", err);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
        });
    }
}
