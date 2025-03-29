import express from "express";
import {getAllOrders, saveOrder} from "../service/OrderService";

const router = express.Router();

export async function AddOrder (req:any, res:any){
    const { address, phoneNumber, delivery, discount, totalPrice, items } = req.body;
    try{
        const added = await saveOrder({
            address,
            phoneNumber,
            delivery,
            discount,
            totalPrice,
            items,
        });
        res.status(201).json({ success: true, user: added });
    }catch (err){
        console.log("Error during order :",err);
    }
}

// router.get('/getAll', async (req, res) => {
//     try {
//         const orders = await getAllOrders();
//         console.log(orders);
//         res.status(200).json({
//             success: true,
//             orders: orders,
//         });
//     } catch (err) {
//         console.log("Error during data fetching :", err);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching orders",
//         });
//     }
// });
