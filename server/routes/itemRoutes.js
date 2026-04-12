import express from "express";
import {
  createItem,
  getItems,
  getMyItems,
  deleteItem
} from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateItem } from "../controllers/itemController.js";
import { resolveItem } from "../controllers/itemController.js";


const router = express.Router();

router.post("/", protect, createItem);
router.get("/", getItems);
router.get("/my", protect, getMyItems);
router.delete("/:id", protect, deleteItem);
router.put("/:id", protect, updateItem);
router.put("/:id/resolve", protect, resolveItem);


export default router;