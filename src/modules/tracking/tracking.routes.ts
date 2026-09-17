import { Router } from "express";
import { TrackingController } from "./tracking.controller";
import  { protect }  from "../../middleware/auth.middleware";

const router = Router();

const trackingController = new TrackingController();

router.get(
  "/orders/:orderId",
  trackingController.getOrderTracking.bind(
    trackingController
  )
);

router.patch(
  "/driver/location",
  trackingController.updateDriverLocation.bind(
    trackingController
  )
);

export default router;