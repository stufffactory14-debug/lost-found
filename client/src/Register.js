import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, PackageSearch, Loader2 } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
       setError("Please fill out all fields.");
       return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.message || "Registration failed");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-gray-900 relative overflow-hidden p-4">
      {/* Light Atmospheric Background Layers */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <PackageSearch className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">Join the Community</h1>
          <p className="text-gray-500 font-medium">Create an account to report or find lost items seamlessly.</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10">
          <form onSubmit={handleRegister} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold text-center">
                 {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 tracking-wide">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold placeholder-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 tracking-wide">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold placeholder-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 tracking-wide">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl py-4 shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] transform hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors">
              Log in securely
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;