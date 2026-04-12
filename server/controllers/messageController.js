import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.json(message);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

import User from "../models/User.js";

export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all messages where this user is sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    // Extract unique user IDs that the current user chatted with
    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.senderId !== userId) userIds.add(msg.senderId);
      if (msg.receiverId !== userId) userIds.add(msg.receiverId);
    });

    // Fetch user details for those IDs
    const users = await User.find({ _id: { $in: Array.from(userIds) } });

    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};