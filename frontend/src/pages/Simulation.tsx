// src/pages/Simulation.tsx
import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Simulation() {
  const [driversCount, setDriversCount] = useState(5);
  const [startTime, setStartTime] = useState("08:00");
  const [maxHours, setMaxHours] = useState(8);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    try {
      setLoading(true);
      const res = await api.post("/simulation/run", { driversCount, startTime, maxHours });
      setResult(res.data);
    } catch (err) {
      alert("Simulation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Run Simulation</h1>
        <div className="bg-white p-6 rounded shadow space-y-4">
          <label className="block">
            <span className="text-sm text-gray-600">Drivers Count</span>
            <input type="number" value={driversCount} onChange={(e)=>setDriversCount(Number(e.target.value))} className="w-full border p-2 rounded mt-1" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Start Time</span>
            <input type="time" value={startTime} onChange={(e)=>setStartTime(e.target.value)} className="w-full border p-2 rounded mt-1" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Max Hours / Driver</span>
            <input type="number" value={maxHours} onChange={(e)=>setMaxHours(Number(e.target.value))} className="w-full border p-2 rounded mt-1" />
          </label>

          <div className="flex items-center gap-4">
            <button onClick={run} className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? "Running..." : "Run Simulation"}
            </button>
            {result && <div className="text-sm text-gray-600">Last run saved id: {result.savedHistoryId}</div>}
          </div>
        </div>

        {result && (
          <div className="mt-6 bg-white p-4 rounded shadow">
            <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
