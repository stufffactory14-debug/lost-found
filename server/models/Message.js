import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  text: String,
  type: { type: String, default: "text" },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  itemTitle: String
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);