import express from "express";
import {getAllItemsController} from "../controllers/ItemController";

const router = express.Router();
const itemController = require("../controllers/ItemController");

router.post('/item/saveItem', itemController.AddItem);
router.get('/item/getAllItem', itemController.getAllItemsController);

module.exports = router;