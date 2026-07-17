import Driver from "./driver.model";
// import User from "../user/User";
import { IDriver } from "./driver.interface";

// Create Driver Profile
export async function createDriver(driverData: IDriver) {
  try {
    // Verify Driver exists
    const driver = await Driver.findById(driverData.userId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    // Check if driver profile already exists for this user
    const existingDriver = await Driver.findOne({ userId: driverData.userId });
    if (existingDriver) {
      throw new Error("Driver profile already exists for this user");
    }

    // Verify unique vehicleNumber
    const existingVehicle = await Driver.findOne({
      vehicleNumber: driverData.vehicleNumber,
    });
    if (existingVehicle) {
      throw new Error("Vehicle number is already registered");
    }

    // Verify unique licenseNumber
    const existingLicense = await Driver.findOne({
      licenseNumber: driverData.licenseNumber,
    });
    if (existingLicense) {
      throw new Error("License number is already registered");
    }

    // Create Driver
    const newDriver = await Driver.create({
      userId: driverData.userId,
      vehicleType: driverData.vehicleType,
      vehicleNumber: driverData.vehicleNumber,
      licenseNumber: driverData.licenseNumber,
      phone: driverData.phone,
      address: driverData.address,
      profileImage: driverData.profileImage,
      isAvailable:
        driverData.isAvailable !== undefined ? driverData.isAvailable : true,
      isActive: driverData.isActive !== undefined ? driverData.isActive : true,
      rating: 0,
      totalDeliveries: 0,
    });

    // Automatically update Driver role to DRIVER
    // if (driver. !== "DRIVER") {
    //   driver.role = "DRIVER";
    //   await driver.save();
    //   console.log(`Updated driver ${driver._id} role to DRIVER`);
    // }

    console.log("Driver Profile Created Successfully:", newDriver);

    // Populate user details before returning
    return await newDriver.populate(
      "userId",
      "first_name last_name email phone role profile_image status",
    );
  } catch (error: any) {
    console.error("Error Creating Driver:", error);
    throw new Error(error.message || "Failed to create driver profile");
  }
}

// Get All Drivers with Optional Filtering
export async function getAllDrivers(filters: {
  vehicleType?: string;
  isAvailable?: boolean;
  isActive?: boolean;
}) {
  try {
    const query: any = {};

    if (filters.vehicleType !== undefined) {
      query.vehicleType = filters.vehicleType;
    }
    if (filters.isAvailable !== undefined) {
      query.isAvailable = filters.isAvailable;
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const drivers = await Driver.find(query)
      .populate(
        "userId",
        "first_name last_name email phone role profile_image status",
      )
      .sort({ createdAt: -1 });

    return drivers;
  } catch (error: any) {
    console.error("Error Getting Drivers:", error);
    throw new Error("Failed to get drivers");
  }
}

// Get Driver By Profile ID
export async function getDriverById(id: string) {
  try {
    const driver = await Driver.findById(id).populate(
      "userId",
      "first_name last_name email phone role profile_image status",
    );

    if (!driver) {
      throw new Error("Driver not found");
    }

    return driver;
  } catch (error: any) {
    console.error("Error Finding Driver by ID:", error);
    throw new Error(error.message || "Failed to get driver");
  }
}

// Get Driver By User ID
export async function getDriverByUserId(userId: string) {
  try {
    const driver = await Driver.findOne({ userId }).populate(
      "userId",
      "first_name last_name email phone role profile_image status",
    );

    if (!driver) {
      throw new Error("Driver profile not found for this user");
    }

    return driver;
  } catch (error: any) {
    console.error("Error Finding Driver by User ID:", error);
    throw new Error(error.message || "Failed to get driver profile");
  }
}

// Update Driver Profile
export async function updateDriver(id: string, driverData: Partial<IDriver>) {
  try {
    const existingDriver = await Driver.findById(id);
    if (!existingDriver) {
      throw new Error("Driver profile not found");
    }

    // If updating unique fields, verify they aren't taken
    if (
      driverData.vehicleNumber &&
      driverData.vehicleNumber !== existingDriver.vehicleNumber
    ) {
      const duplicateVehicle = await Driver.findOne({
        vehicleNumber: driverData.vehicleNumber,
      });
      if (duplicateVehicle) {
        throw new Error(
          "Vehicle number is already registered to another driver",
        );
      }
    }

    if (
      driverData.licenseNumber &&
      driverData.licenseNumber !== existingDriver.licenseNumber
    ) {
      const duplicateLicense = await Driver.findOne({
        licenseNumber: driverData.licenseNumber,
      });
      if (duplicateLicense) {
        throw new Error(
          "License number is already registered to another driver",
        );
      }
    }

    const updateFields: any = {};
    if (driverData.vehicleType !== undefined)
      updateFields.vehicleType = driverData.vehicleType;
    if (driverData.vehicleNumber !== undefined)
      updateFields.vehicleNumber = driverData.vehicleNumber;
    if (driverData.licenseNumber !== undefined)
      updateFields.licenseNumber = driverData.licenseNumber;
    if (driverData.phone !== undefined) updateFields.phone = driverData.phone;
    if (driverData.address !== undefined)
      updateFields.address = driverData.address;
    if (driverData.profileImage !== undefined)
      updateFields.profileImage = driverData.profileImage;
    if (driverData.isAvailable !== undefined)
      updateFields.isAvailable = driverData.isAvailable;
    if (driverData.isActive !== undefined)
      updateFields.isActive = driverData.isActive;
    if (driverData.rating !== undefined)
      updateFields.rating = driverData.rating;

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).populate(
      "userId",
      "first_name last_name email phone role profile_image status",
    );

    console.log("Driver Updated Successfully");
    return updatedDriver;
  } catch (error: any) {
    console.error("Error Updating Driver:", error);
    throw new Error(error.message || "Failed to update driver profile");
  }
}

// Delete Driver Profile
export async function deleteDriver(id: string) {
  try {
    const existingDriver = await Driver.findById(id);
    if (!existingDriver) {
      throw new Error("Driver profile not found");
    }

    await Driver.findByIdAndDelete(id);

    // Option: Demote driver role back to CUSTOMER
    // const driver = await Driver.findById(existingDriver.userId);
    // if (driver && driver.role === "DRIVER") {
    //   driver.role = "CUSTOMER";
    //   await driver.save();
    //   console.log(`Reverted driver ${driver._id} role back to CUSTOMER`);
    // }

    console.log("Driver Deleted Successfully:", id);
    return {
      message: "Driver profile deleted successfully",
    };
  } catch (error: any) {
    console.error("Error Deleting Driver:", error);
    throw new Error(error.message || "Failed to delete driver profile");
  }
}
