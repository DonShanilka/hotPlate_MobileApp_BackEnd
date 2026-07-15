import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  createDriver,
  getDrivers,
  getDriver,
  getProfile,
  updateDriver,
  deleteDriver,
  toggleAvailability,
} from "./driver.controller";

const router = Router();

// Register driver profile
router.post("/register", protect, createDriver);

// Get all driver profiles
router.get("/getAll", getDrivers);

// Get logged-in driver's profile
router.get("/profile", protect, getProfile);

// Get driver by driver profile ID
router.get("/getById/:id", getDriver);

// Update driver profile details
router.put("/update/:id", protect, updateDriver);

// Delete driver profile
router.delete("/delete/:id", protect, deleteDriver);

// Quick toggle driver availability status
router.patch("/:id/availability", protect, toggleAvailability);

export default router;
