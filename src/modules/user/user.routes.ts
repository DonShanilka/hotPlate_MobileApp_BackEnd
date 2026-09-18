import express from "express";
import { protect } from "../../middleware/auth.middleware";

import {
  register,
  login,
  getAllUsers,
  getSingleUser,
  getProfile,
  update,
  remove,
} from "./user.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
