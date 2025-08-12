// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface KPI {
  totalProfit: number;
  efficiencyScore: number;
  onTimeCount: number;
  lateCount: number;
  fuelBreakdown: { highTraffic: number; lowTraffic: number };
}

export default function Dashboard() {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const COLORS = ["#16a34a", "#ef4444", "#3b82f6", "#f59e0b"];

  useEffect(() => {
    api.get("/simulation/latest").then((res) => setKpi(res.data)).catch(() => setKpi(null));
  }, []);

  if (!kpi) {
    return (
      <div className="bg-white p-6 rounded shadow text-gray-600">
        No simulation data yet. Please run a simulation.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-gray-600">Total Profit</p>
          <h2 className="text-xl font-bold">₹{kpi.totalProfit.toFixed(2)}</h2>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-gray-600">Efficiency</p>
          <h2 className="text-xl font-bold">{kpi.efficiencyScore}%</h2>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-gray-600">On-Time</p>
          <h2 className="text-xl font-bold">{kpi.onTimeCount}</h2>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-gray-600">Late</p>
          <h2 className="text-xl font-bold">{kpi.lateCount}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* On-Time vs Late */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">On-Time vs Late Deliveries</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "On Time", value: kpi.onTimeCount },
                  { name: "Late", value: kpi.lateCount },
                ]}
                dataKey="value"
                outerRadius={90}
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

        {/* Fuel Breakdown */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Fuel Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "High Traffic", value: kpi.fuelBreakdown.highTraffic },
                  { name: "Low Traffic", value: kpi.fuelBreakdown.lowTraffic },
                ]}
                dataKey="value"
                outerRadius={90}
                label
              >
                <Cell fill={COLORS[2]} />
                <Cell fill={COLORS[3]} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
