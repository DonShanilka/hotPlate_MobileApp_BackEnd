import { Request, Response } from "express";
import { TrackingService } from "./tracking.service";
import { updateDriverLocationSchema } from "./tracking.validation";

const trackingService = new TrackingService();

export class TrackingController {
  async getOrderTracking(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const customerId = req.customerId; // Assuming the authenticated user is stored in req.user

    //   const customerId = req.id;

    //   if (!customerId) {
    //     return res.status(401).json({
    //       success: false,
    //       message: "Customer authentication required",
    //     });
    //   }

      const result = await trackingService.getOrderTracking(
        orderId as any,
        customerId as any
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

      const driverId = req.params;

      if (!driverId) {
        return res.status(401).json({
          success: false,
          message: "Driver authentication required",
        });
      }

      const result = await trackingService.updateDriverLocation(
        driverId as any,
        data
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