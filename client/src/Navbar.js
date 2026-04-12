import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg cursor-pointer" onClick={() => navigate("/dashboard")}>
        Lost & Found
      </h1>

      <div className="flex gap-4">
        <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
        <Link to="/add-item" className="hover:text-blue-200 transition">Report Item</Link>
        <Link to="/items" className="hover:text-blue-200 transition">All Items</Link>
        <Link to="/my-items" className="hover:text-blue-200 transition">My Items</Link>
        <Link to="/chat" className="hover:text-blue-200 transition">Messages</Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="text-amber-300 hover:text-amber-200 font-bold transition">Admin Panel</Link>
        )}

        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;