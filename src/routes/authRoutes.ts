import express from "express";
const router = express.Router();
// @ts-ignore
import authController from "../controllers/AuthController";

export default function authRouters() {
    router.post('/auth/saveAuth', authController.addAuth);
    router.post('/auth/updateAuth', authController.updateAuth);
}