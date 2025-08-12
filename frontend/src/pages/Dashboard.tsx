// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

type KPI = {
  totalProfit: number;
  efficiencyScore: number;
  onTimeCount: number;
  lateCount: number;
  fuelBreakdown: { highTraffic: number; lowTraffic: number };
};

export default function Dashboard() {
  const [data, setData] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      // backend should expose latest history; fallback to running simulation
      const res = await api.get("/simulation/latest").catch(() => null);
      if (res && res.data) {
        setData(res.data);
      } else {
        // run simulation with defaults if latest not available
        const sim = await api.post("/simulation/run", { driversCount: 5, startTime: "08:00", maxHours: 8 });
        setData(sim.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLatest(); }, []);

  const COLORS = ["#FF8042", "#0088FE"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Simulation Dashboard</h1>
          <div>
            <button onClick={fetchLatest} className="bg-black text-white px-4 py-2 rounded mr-2" disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-500">Total Profit</p>
                <div className="text-2xl font-bold text-green-600">₹{data.totalProfit.toFixed(2)}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-500">Efficiency Score</p>
                <div className="text-2xl font-bold text-blue-600">{data.efficiencyScore.toFixed(2)}%</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-500">On-Time</p>
                <div className="text-2xl font-bold text-green-600">{data.onTimeCount}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-500">Late</p>
                <div className="text-2xl font-bold text-red-600">{data.lateCount}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-3">Fuel Cost Breakdown</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "High Traffic", value: data.fuelBreakdown.highTraffic },
                          { name: "Low Traffic", value: data.fuelBreakdown.lowTraffic },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        <Cell fill={COLORS[0]} />
                        <Cell fill={COLORS[1]} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-3">On-Time vs Late</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <BarChart data={[{ name: "On-Time", value: data.onTimeCount }, { name: "Late", value: data.lateCount }]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
