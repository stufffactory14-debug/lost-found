import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cors());

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ---------------- SOCKET SETUP ---------------- */
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* 🔥 BETTER ONLINE USERS STORE (Map) */
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* 🔥 USER JOIN */
  socket.on("join", (userId) => {
    if (!userId) return;

    onlineUsers.set(userId, socket.id);

    // send only userIds array to frontend
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  /* 🔥 SEND MESSAGE */
  socket.on("sendMessage", async (data) => {
    try {
      const message = await Message.create(data);

      const receiverSocketId = onlineUsers.get(data.receiverId);

      // send to receiver
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);
      }

      // send to sender
      socket.emit("receiveMessage", message);

    } catch (err) {
      console.log("Message error:", err);
    }
  });

  /* 🔥 DISCONNECT */
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

/* ---------------- START SERVER ---------------- */
server.listen(5000, () => {
  console.log("Server running on port 5000");
});