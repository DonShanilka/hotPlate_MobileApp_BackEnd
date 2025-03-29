import { OrderModel } from "../model/OrderModel"; // Your Order Mongoose model

export async function saveOrder(order: { address: any; phoneNumber: any; totalPrice: any; items: any }) {
    try {
        const newOrder = new OrderModel({
            address: order.address,
            phoneNumber: order.phoneNumber,
            totalPrice: order.totalPrice,
            items: order.items,
        });
        await newOrder.save();
        console.log("Order Saved");
        return newOrder;
    } catch (error) {
        console.error("Error saving order:", error);
        throw new Error("Error saving order");
    }
}

export async function getAllOrders() {
    try {
        const orders = await OrderModel.find();
        return orders;
    } catch (err) {
        console.log("Error fetching orders", err);
        return [];  // Return an empty array if there's an error
    }
}