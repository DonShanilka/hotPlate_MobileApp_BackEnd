import express from "express";

const router = express.Router();
const userController = require("../controllers/AuthController");

router.post("/auth/saveUser", userController.addAuth);
router.post("/auth/verifyUser", userController.verifyUser);
router.put("/auth/updateUser", userController.updateAuth);

module.exports = router;
