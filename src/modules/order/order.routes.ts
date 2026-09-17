import { Router } from "express";

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
  getPendingOrdersByUser,
} from "./order.controller";

const router = Router();

/**
 * Create order
 * POST /orders
 */
router.post("/", AddOrder);

/**
 * Get all orders
 * GET /orders
 *
 * Optional query:
 * GET /orders?status=PENDING
 */
router.get("/", getOrders);

/**
 * Get orders belonging to a user
 * GET /orders/user/:userId
 */
router.get("/user/:userId", getMyOrders);

/**
 * Get pending orders belonging to a user
 * GET /orders/user/:userId/pending
 */
router.get(
  "/user/:userId/pending",
  getPendingOrdersByUser
);

/**
 * Get one order
 * GET /orders/:id
 */
router.get("/:id", getOrder);

/**
 * Update order status
 * PATCH /orders/:id/status
 */
router.patch("/:id/status", updateStatus);

/**
 * Assign driver
 * PATCH /orders/:id/driver
 */
router.patch("/:id/driver", assignDriver);

/**
 * Update payment status
 * PATCH /orders/:id/payment
 */
router.patch("/:id/payment", updatePayment);

/**
 * Cancel order
 * PATCH /orders/:id/cancel
 */
router.patch("/:id/cancel", cancelOrderHandler);

/**
 * Delete order
 * DELETE /orders/:id
 */
router.delete("/:id", deleteOrderHandler);

export default router;