import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Lost & Found Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div
          onClick={() => navigate("/add-item")}
          className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold">➕ Add Item</h2>
          <p className="text-gray-500 mt-2">Report lost or found item</p>
        </div>

        <div
          onClick={() => navigate("/items")}
          className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold">📋 View Items</h2>
          <p className="text-gray-500 mt-2">See all reports</p>
        </div>

        <div
          onClick={() => navigate("/chat")}
          className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold">💬 Chat</h2>
          <p className="text-gray-500 mt-2">Talk to users</p>
        </div>

        <div
          onClick={() => navigate("/my-items")}
          className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold">📦 My Items</h2>
          <p className="text-gray-500 mt-2">Your posts</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;