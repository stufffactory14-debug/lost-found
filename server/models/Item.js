// import mongoose from "mongoose";

// const itemSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   category: String,
//   type: { type: String, enum: ["lost", "found"] },
//   image: String,

//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//   date: Date,
//   status: { type: String, default: "open" }

// }, { timestamps: true });

// export default mongoose.model("Item", itemSchema);


import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  type: { type: String, enum: ["lost", "found"] },
  image: String,

  //  NEW (VERY IMPORTANT)
  location: {
    type: String,
    required: true
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  date: Date,

  // IMPROVED
  status: {
    type: String,
    enum: ["open", "resolved"],
    default: "open"
  }

}, { timestamps: true });

export default mongoose.model("Item", itemSchema);