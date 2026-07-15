import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  AddOrder,
  getOrders,
  getOrder,
  getMyOrders,
  updateStatus,
  assignDriver,
  updatePayment,
  cancelOrderHandler,
  deleteOrderHandler,
} from "./order.controller";

const router = Router();

// ─── Public / Mobile App Routes ───────────────────────────────────────────────

// POST   /api/order/AddOrder       → place a new order (mobile client endpoint)
router.post("/AddOrder", AddOrder);

// ─── Authenticated Customer Routes ───────────────────────────────────────────

// GET    /api/order/myOrders       → get logged-in user's order history
router.get("/myOrders", protect, getMyOrders);

// PATCH  /api/order/cancel/:id     → cancel an order (customer)
router.patch("/cancel/:id", protect, cancelOrderHandler);

// ─── Restaurant / Admin Routes ────────────────────────────────────────────────

// GET    /api/order/getAll         → get all orders with optional query filters
//        ?status=PENDING&userId=xxx&restaurantId=xxx&driverId=xxx
router.get("/getAll", protect, getOrders);

// GET    /api/order/getById/:id    → get a specific order by ID
router.get("/getById/:id", protect, getOrder);

// PATCH  /api/order/status/:id     → update order status lifecycle
router.patch("/status/:id", protect, updateStatus);

// PATCH  /api/order/assign-driver/:id → assign a driver to an order
router.patch("/assign-driver/:id", protect, assignDriver);

// PATCH  /api/order/payment/:id   → update payment status
router.patch("/payment/:id", protect, updatePayment);

// DELETE /api/order/delete/:id    → hard delete (admin only)
router.delete("/delete/:id", protect, deleteOrderHandler);

export default router;
