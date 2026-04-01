import React, { useState } from "react";
import Navbar from "./Navbar";

function AddItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("lost");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    if (!title || !description || !category || !date) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        category,
        type,
        date
      })
    });

    alert("Item added successfully ✅");

    // reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setType("lost");
    setDate("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex justify-center items-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Add Item
          </h2>

          {/* Title */}
          <input
            placeholder="Item Title (e.g. iPhone)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          {/* Description */}
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          {/* Category */}
          <input
            placeholder="Category (phone, wallet...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>

        </div>
      </div>
    </div>
  );
}

export default AddItem;