import React, { useEffect, useState } from "react";

function MyItems() {
  const [items, setItems] = useState([]);

  const fetchMyItems = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/items/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  /* 🔥 DELETE FUNCTION */
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // refresh UI
    fetchMyItems();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">My Items</h2>

      {items.length === 0 ? (
        <p>No items found</p>
      ) : (
        items.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 mb-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p>{item.description}</p>
              <p className="text-sm text-gray-500">
                Type: {item.type}
              </p>
            </div>

            {/* 🔥 DELETE BUTTON */}
            <button
              onClick={() => handleDelete(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
  onClick={() => window.location.href = `/edit/${item._id}`}
  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
>
  Edit
</button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyItems;