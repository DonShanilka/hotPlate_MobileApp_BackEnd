import express from "express";
import { protect } from "../../middleware/auth.middleware";
import { createMenu } from "./menu.controller";



const router = express.Router();

router.post("/create", createMenu);

// router.get("/getAll", getMenus);

// router.get("/getById/:id", getMenu);

// router.get("/restaurant/:restaurantId", getRestaurantMenus);

// router.put("/update/:id", updateMenu);

// router.delete("/delete/:id", deleteMenu);

export default router;