import { useEffect, useState } from "react";
import api from "../services/api";

interface RouteItem {
  id: number;
  routeId: string;
  distanceKm: number;
  trafficLevel: string;
  baseTimeMinutes: number;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [form, setForm] = useState({
    routeId: "",
    distanceKm: 0,
    trafficLevel: "HIGH",
    baseTimeMinutes: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    try {
      const res = await api.get("/routes");
      setRoutes(res.data);
    } catch (err: any) {
      console.error("Failed to fetch routes:", err);
      setError("Failed to fetch routes.");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        await api.put(`/routes/${editingId}`, form);
      } else {
        await api.post("/routes", form); // ✅ send all required fields
      }

      setForm({
        routeId: "",
        distanceKm: 0,
        trafficLevel: "HIGH",
        baseTimeMinutes: 0,
      });
      setEditingId(null);
      fetchRoutes();
    } catch (err: any) {
      console.error("Failed to save route:", err);
      setError(err.response?.data?.error || "Failed to save route.");
    }
  };

  const handleEdit = (route: RouteItem) => {
    setEditingId(route.id);
    setForm({
      routeId: route.routeId,
      distanceKm: route.distanceKm,
      trafficLevel: route.trafficLevel,
      baseTimeMinutes: route.baseTimeMinutes,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      routeId: "",
      distanceKm: 0,
      trafficLevel: "HIGH",
      baseTimeMinutes: 0,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this route?")) {
      try {
        await api.delete(`/routes/${id}`);
        fetchRoutes();
      } catch (err: any) {
        console.error("Delete failed:", err);
        setError("Failed to delete route.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4"> Routes Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-5 gap-3"
      >
        <input
          type="text"
          placeholder="Route ID"
          className="border p-2 rounded"
          value={form.routeId}
          onChange={(e) => setForm({ ...form, routeId: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Distance (km)"
          className="border p-2 rounded"
          value={form.distanceKm}
          onChange={(e) =>
            setForm({ ...form, distanceKm: Number(e.target.value) })
          }
          required
        />
        <select
          className="border p-2 rounded"
          value={form.trafficLevel}
          onChange={(e) =>
            setForm({ ...form, trafficLevel: e.target.value })
          }
        >
          <option value="HIGH">High Traffic</option>
          <option value="LOW">Low Traffic</option>
        </select>
        <input
          type="number"
          placeholder="Base Time (minutes)"
          className="border p-2 rounded"
          value={form.baseTimeMinutes}
          onChange={(e) =>
            setForm({ ...form, baseTimeMinutes: Number(e.target.value) })
          }
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white rounded px-4 py-2 hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Route ID</th>
              <th className="p-2 border">Distance (km)</th>
              <th className="p-2 border">Traffic Level</th>
              <th className="p-2 border">Base Time (min)</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="p-2 border">{route.id}</td>
                <td className="p-2 border">{route.routeId}</td>
                <td className="p-2 border">{route.distanceKm}</td>
                <td className="p-2 border">{route.trafficLevel}</td>
                <td className="p-2 border">{route.baseTimeMinutes}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(route)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(route.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {routes.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No routes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
