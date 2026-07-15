import { Request, Response } from "express";
import * as driverService from "./driver.service";
import { driverSchema, updateDriverSchema } from "./driver.validation";
import { IDriver } from "./driver.interface";
import { any } from "joi";

// Register / Create Driver Profile
export const createDriver = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId;

    // Validate body
    const { error } = driverSchema.validate({ ...req.body, userId });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Extract profile image if uploaded
    let profileImage: Buffer | undefined;
    if (req.files && req.files.profileImage) {
      profileImage = (req.files.profileImage as any).data;
    } else if (req.files && req.files.image) {
      profileImage = (req.files.image as any).data;
    }

    const driverData: IDriver = {
      userId,
      vehicleType: req.body.vehicleType,
      vehicleNumber: req.body.vehicleNumber,
      licenseNumber: req.body.licenseNumber,
      phone: req.body.phone,
      address: req.body.address,
      profileImage,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === "true" || req.body.isAvailable === true : true,
      isActive: req.body.isActive !== undefined ? req.body.isActive === "true" || req.body.isActive === true : true,
    };

    const newDriver = await driverService.createDriver(driverData);

    return res.status(201).json({
      success: true,
      message: "Driver profile created successfully",
      data: newDriver,
    });
  } catch (error: any) {
    console.error("Controller Create Driver Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Drivers
export const getDrivers = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.vehicleType) {
      filters.vehicleType = req.query.vehicleType as string;
    }
    if (req.query.isAvailable !== undefined) {
      filters.isAvailable = req.query.isAvailable === "true";
    }
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === "true";
    }

    const drivers = await driverService.getAllDrivers(filters);

    return res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error: any) {
    console.error("Controller Get Drivers Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Driver Profile by ID
export const getDriver = async (req: Request, res: Response) => {
  try {
    const driver = await driverService.getDriverById(req.params.id as any);

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error: any) {
    console.error("Controller Get Driver Error:", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in Driver's Profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const driver = await driverService.getDriverByUserId(userId);

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error: any) {
    console.error("Controller Get Profile Error:", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Driver Profile
export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { error } = updateDriverSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updateData: Partial<IDriver> = { ...req.body };

    // Extract new image if uploaded
    if (req.files && req.files.profileImage) {
      updateData.profileImage = (req.files.profileImage as any).data;
    } else if (req.files && req.files.image) {
      updateData.profileImage = (req.files.image as any).data;
    }

    // Convert string inputs to boolean if passed in form-data
    if (req.body.isAvailable !== undefined) {
      updateData.isAvailable = req.body.isAvailable === "true" || req.body.isAvailable === true;
    }
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    const updatedDriver = await driverService.updateDriver(
      req.params.id as any,
      updateData
    );

    return res.status(200).json({
      success: true,
      message: "Driver profile updated successfully",
      data: updatedDriver,
    });
  } catch (error: any) {
    console.error("Controller Update Driver Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Driver Profile
export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const result = await driverService.deleteDriver(req.params.id as any);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("Controller Delete Driver Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle Availability (Fast Patch)
export const toggleAvailability = async (req: Request, res: Response) => {
  try {
    const { isAvailable } = req.body;
    if (isAvailable === undefined) {
      return res.status(400).json({
        success: false,
        message: "isAvailable field is required",
      });
    }

    const updatedDriver = await driverService.updateDriver(req.params.id as any, {
      isAvailable: isAvailable === "true" || isAvailable === true,
    });

    return res.status(200).json({
      success: true,
      message: "Driver availability updated successfully",
      data: updatedDriver,
    });
  } catch (error: any) {
    console.error("Controller Toggle Availability Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
