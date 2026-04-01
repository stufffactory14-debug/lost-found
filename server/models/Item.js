import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  type: { type: String, enum: ["lost", "found"] },
  image: String,

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  date: Date,
  status: { type: String, default: "open" }

}, { timestamps: true });

export default mongoose.model("Item", itemSchema);