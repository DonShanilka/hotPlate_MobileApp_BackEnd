import { OrderModel } from "../model/OrderModel"; // Your Order Mongoose model

export async function saveOrder(order: { address: any; phoneNumber: any; delivery: any; discount:any; totalPrice: any; items: any }) {
    try {
        const newOrder = new OrderModel({
            address: order.address,
            phoneNumber: order.phoneNumber,
            delivery: order.delivery,
            discount: order.discount,
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
        return [];
    }
}