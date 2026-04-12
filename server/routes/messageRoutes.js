import express from "express";
import { sendMessage, getMessages, getConversations } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/conversations/:userId", getConversations);
router.get("/:user1/:user2", getMessages);

export default router;