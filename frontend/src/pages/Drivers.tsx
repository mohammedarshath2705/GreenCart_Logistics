import { useEffect, useState } from "react";
import api from "../services/api";

interface Driver {
  id: number;
  name: string;
  currentShiftHours: number;
  past7DayHours: number;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [form, setForm] = useState({
    name: "",
    currentShiftHours: 0,
    past7DayHours: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchDrivers = async () => {
    const res = await api.get("/drivers");
    setDrivers(res.data);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update driver
      await api.put(`/drivers/${editingId}`, form);
    } else {
      // Create new driver
      await api.post("/drivers", form);
    }

    // Reset form
    setForm({ name: "", currentShiftHours: 0, past7DayHours: 0 });
    setEditingId(null);
    fetchDrivers();
  };

  const handleEdit = (driver: Driver) => {
    setEditingId(driver.id);
    setForm({
      name: driver.name,
      currentShiftHours: driver.currentShiftHours,
      past7DayHours: driver.past7DayHours,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", currentShiftHours: 0, past7DayHours: 0 });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this driver?")) {
      await api.delete(`/drivers/${id}`);
      fetchDrivers();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4"> Drivers Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-5 gap-3"
      >
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Current Shift Hours"
          className="border p-2 rounded"
          value={form.currentShiftHours}
          onChange={(e) =>
            setForm({ ...form, currentShiftHours: Number(e.target.value) })
          }
          required
        />
        <input
          type="number"
          placeholder="Past 7-Day Hours"
          className="border p-2 rounded"
          value={form.past7DayHours}
          onChange={(e) =>
            setForm({ ...form, past7DayHours: Number(e.target.value) })
          }
          required
        />
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
      </form>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Current Shift Hours</th>
              <th className="p-2 border">Past 7-Day Hours</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="p-2 border">{driver.id}</td>
                <td className="p-2 border">{driver.name}</td>
                <td className="p-2 border">{driver.currentShiftHours}</td>
                <td className="p-2 border">{driver.past7DayHours}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(driver)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(driver.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
