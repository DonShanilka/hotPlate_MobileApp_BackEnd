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

router.post("/", AddOrder);
router.get("/", getOrders);
router.get("/user/:userId", getMyOrders);
router.get("/user/:userId/pending", getPendingOrdersByUser);
router.get("/:id", getOrder);
router.patch("/:id/status", updateStatus);
router.patch("/:id/driver", assignDriver);
router.patch("/:id/payment", updatePayment);
router.patch("/:id/cancel", cancelOrderHandler);
router.delete("/:id", deleteOrderHandler);

export default router;
