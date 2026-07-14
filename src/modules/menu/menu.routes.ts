import express from "express";
import { protect } from "../../middleware/auth.middleware";
import { createMenu, getMenu, updateMenu } from "./menu.controller";
import { getMenus } from "./menu.service";



const router = express.Router();

router.post("/create", createMenu);
router.get("/getAll", getMenus);
router.get("/getById/:id", getMenu);
// router.get("/restaurant/:restaurantId", getRestaurantMenus);

router.put("/update/:id", updateMenu);

// router.delete("/delete/:id", deleteMenu);

export default router;