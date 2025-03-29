import express from "express";

const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.post("/order/AddOrder", OrderController.AddOrder);
router.get("/order/getAllOrder", OrderController.getAllOrder);


module.exports = router;
