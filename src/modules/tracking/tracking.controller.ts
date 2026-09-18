import { Request, Response } from "express";
import { TrackingService } from "./tracking.service";
import { updateDriverLocationSchema } from "./tracking.validation";
import Driver from "../driver/driver.model";

const trackingService = new TrackingService();

export class TrackingController {
  async getOrderTracking(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const customerId = req.user?.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Customer authentication required",
        });
      }

      const result = await trackingService.getOrderTracking(
        orderId as any,
        customerId as any,
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateDriverLocation(req: Request, res: Response) {
    try {
      const data = updateDriverLocationSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Driver authentication required",
        });
      }

      const driver = await Driver.findOne({ userId, isActive: true }).select(
        "_id",
      );

      if (!driver) {
        return res.status(403).json({
          success: false,
          message: "Active driver profile required",
        });
      }

      const result = await trackingService.updateDriverLocation(
        driver.id,
        data,
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
