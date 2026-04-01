import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token");

  // 🔥 Fetch existing item
  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();

      const item = data.find((i) => i._id === id);

      if (item) {
        setTitle(item.title);
        setDescription(item.description);
        setCategory(item.category);
      }
    };

    fetchItem();
  }, [id]);

  // 🔥 Update item
  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        category
      })
    });

    alert("Updated successfully ✅");
    navigate("/my-items");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Edit Item</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 mb-2 w-full"
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 mb-2 w-full"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="border p-2 mb-4 w-full"
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
}

export default EditItem;