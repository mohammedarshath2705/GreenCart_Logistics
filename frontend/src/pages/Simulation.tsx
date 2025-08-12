// src/pages/Simulation.tsx
import { useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface KPIResponse {
  totalProfit: number;
  efficiencyScore: number;
  onTimeCount: number;
  lateCount: number;
  fuelBreakdown: {
    highTraffic: number;
    lowTraffic: number;
  };
  totalDeliveries?: number;
  assignedCount?: number;
}

export default function Simulation() {
  const [form, setForm] = useState({
    driversCount: 5,
    startTime: "08:00",
    maxHours: 8,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kpi, setKpi] = useState<KPIResponse | null>(null);

  const formatCurrency = (v: number) =>
    `₹${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const runSimulation = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/simulation/run", form);
      setKpi(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#16a34a", "#ef4444", "#3b82f6", "#f59e0b"];
  const deliveryChart = [
    { name: "On Time", value: kpi?.onTimeCount || 0 },
    { name: "Late", value: kpi?.lateCount || 0 },
  ];
  const fuelChart = [
    { name: "High Traffic", value: kpi?.fuelBreakdown?.highTraffic || 0 },
    { name: "Low Traffic", value: kpi?.fuelBreakdown?.lowTraffic || 0 },
  ];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-2xl font-bold text-center">⚙️ Run Simulation</h1>

        {/* Simulation Form */}
        <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              className="border rounded p-2 w-full"
              type="number"
              name="driversCount"
              min={1}
              value={form.driversCount}
              onChange={handleChange}
              placeholder="Drivers Count"
            />
            <input
              className="border rounded p-2 w-full"
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
            />
            <input
              className="border rounded p-2 w-full"
              type="number"
              name="maxHours"
              min={1}
              value={form.maxHours}
              onChange={handleChange}
              placeholder="Max Hours"
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={runSimulation}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Running..." : "Run Simulation"}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {kpi && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="bg-green-100 p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500">Total Profit</p>
                <div className="text-2xl font-bold">
                  {formatCurrency(kpi.totalProfit)}
                </div>
              </div>
              <div className="bg-blue-100 p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500">Efficiency</p>
                <div className="text-2xl font-bold">
                  {kpi.efficiencyScore.toFixed(2)}%
                </div>
              </div>
              <div className="bg-yellow-100 p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500">On-Time</p>
                <div className="text-2xl font-bold">{kpi.onTimeCount}</div>
              </div>
              <div className="bg-red-100 p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500">Late</p>
                <div className="text-2xl font-bold">{kpi.lateCount}</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* On-Time vs Late */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-3 text-center">
                  On-Time vs Late Deliveries
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={deliveryChart}
                      dataKey="value"
                      outerRadius={90}
                      label
                    >
                      {deliveryChart.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Fuel Breakdown */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-3 text-center">
                  Fuel Cost Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={fuelChart}
                      dataKey="value"
                      outerRadius={90}
                      label
                    >
                      {fuelChart.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={COLORS[(idx + 2) % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
