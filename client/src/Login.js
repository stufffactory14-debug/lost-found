import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");
  };

  return (
    

    <div className="h-screen flex items-center justify-center bg-gray-100">


      <div className="bg-white p-8 rounded shadow-md w-80">
       

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>


        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Login
        </button>
        <p className="text-center mt-3">
  Don't have an account?{" "}
  <span
    className="text-blue-500 cursor-pointer"
    onClick={() => navigate("/register")}
  >
    Register
  </span>
</p>
      </div>
    </div>
  );
}

export default Login;