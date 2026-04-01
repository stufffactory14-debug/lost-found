import React from "react";
import { useNavigate } from "react-router-dom";

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
        <button onClick={() => navigate("/items")}>Items</button>
        <button onClick={() => navigate("/my-items")}>My Items</button>
        <button onClick={() => navigate("/chat")}>Chat</button>

        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;