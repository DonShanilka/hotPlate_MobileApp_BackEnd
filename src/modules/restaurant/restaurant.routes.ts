import { Router } from "express";

import {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "./restaurant.controller";

const router = Router();

router.post("/create", createRestaurant);
router.get("/getAll", getRestaurants);
router.get("/getById/:id", getRestaurant);
router.put("/update/:id", updateRestaurant);
router.delete("/delete/:id", deleteRestaurant);

export default router;
