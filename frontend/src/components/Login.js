import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !role)) {
      setError("Please fill all fields" + (isRegister ? " and select a role." : "."));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "register" : "login";
      const res = await fetch(`http://localhost:8000/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? { email, password, role } : { email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.detail || "Authentication failed.");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          AspiroNest {isRegister ? "Register" : "Login"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegister && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200 mb-2"
        >
          {loading ? (isRegister ? "Registering..." : "Logging in...") : (isRegister ? "Register" : "Login")}
        </button>
        <button
          type="button"
          className="w-full text-blue-700 underline mt-2"
          onClick={() => { setIsRegister(r => !r); setError(""); }}
        >
          {isRegister ? "Already have an account? Login" : "New user? Register here"}
        </button>
      </form>
    </div>
  );
}
