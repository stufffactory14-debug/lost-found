import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Items() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filter === "all" || item.type === filter;

    const matchesSearch =
      (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleContact = (itemUser) => {
    if (!user) return alert("Login first");

    if (user._id === itemUser._id) {
      alert("This is your own item 😅");
      return;
    }

    localStorage.setItem("chatUser", JSON.stringify(itemUser));
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-3xl font-bold mb-4 text-center">
        All Items
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg"
      />

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6 justify-center">
        <button
          onClick={() => setFilter("all")}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          All
        </button>

        <button
          onClick={() => setFilter("lost")}
          className="px-4 py-2 bg-red-400 text-white rounded"
        >
          Lost
        </button>

        <button
          onClick={() => setFilter("found")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Found
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-bold">{item.title}</h3>

            <p className="text-gray-600 mt-2">{item.description}</p>

            <p className="mt-2">
              <span className="font-semibold">Category:</span> {item.category}
            </p>

            <p>
              <span className="font-semibold">Type:</span>{" "}
              <span
                className={
                  item.type === "lost"
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {item.type}
              </span>
            </p>

            <p>
              <span className="font-semibold">Posted by:</span>{" "}
              {item.user?.name}
            </p>

            {/* 🔥 CONTACT BUTTON */}
            <button
              onClick={() => handleContact(item.user)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Contact Owner
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Items;