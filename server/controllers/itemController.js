import Item from "../models/Item.js";

/* 🔥 CREATE ITEM */
export const createItem = async (req, res) => {
  try {
    const item = await Item.create({
      ...req.body,
      user: req.user
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🔥 GET ALL ITEMS */
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🔥 GET MY ITEMS */
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🔥 DELETE ITEM */
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔐 SECURITY: only owner can delete
    if (item.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔐 Only owner can update
    if (item.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
