import { Router } from "express";
import { TrackingController } from "./tracking.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

const trackingController = new TrackingController();

router.get("/orders/:orderId", protect, trackingController.getOrderTracking.bind(trackingController));
router.patch( "/driver/location", protect, trackingController.updateDriverLocation.bind(trackingController));

export default router;
