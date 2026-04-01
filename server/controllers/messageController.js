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