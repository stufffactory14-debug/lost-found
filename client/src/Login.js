import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 font-sans selection:bg-blue-500/30">
      
      {/* Left Area - Branding & Visuals */}
      <div className="relative hidden lg:flex w-1/2 p-12 items-center justify-center bg-gray-950 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-[pulse_10s_ease-in-out_infinite]" style={{ animationDelay: "2s" }}></div>
        
        {/* Glass Card in Background */}
        <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[2.5rem] shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-8 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200 mb-6 tracking-tight leading-tight">
            Lost &amp; Found
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-medium">
            A modern platform to reunite people with their belongings. Simple, fast, and secure.
          </p>
          
          <div className="mt-12 flex items-center gap-5">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-gray-900 bg-blue-400 z-[4]"></div>
              <div className="w-12 h-12 rounded-full border-2 border-gray-900 bg-indigo-400 z-[3]"></div>
              <div className="w-12 h-12 rounded-full border-2 border-gray-900 bg-purple-400 z-[2]"></div>
              <div className="w-12 h-12 rounded-full border-2 border-gray-900 bg-emerald-400 z-[1]"></div>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              Join <span className="text-white font-semibold">10,000+</span> users today
            </p>
          </div>
        </div>
      </div>

      {/* Right Area - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 text-base font-medium">
              Please enter your details to sign in to your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 text-red-600 text-sm font-medium p-4 rounded-2xl flex items-center shadow-sm border border-red-100">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 tracking-wide">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all duration-300 placeholder-gray-400 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-gray-700 tracking-wide">
                  Password
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-semibold">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all duration-300 placeholder-gray-400 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold rounded-2xl py-4 shadow-xl shadow-gray-900/10 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-base font-medium">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-gray-900 font-bold hover:text-blue-600 transition-colors ml-1"
              >
                Create one now
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;