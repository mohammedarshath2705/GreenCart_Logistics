// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Manager Login</h2>
        <label className="block mb-2 text-sm">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 mb-3 border rounded" />
        <label className="block mb-2 text-sm">Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
