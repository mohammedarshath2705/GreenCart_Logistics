import { useEffect, useState } from "react";
import api from "../services/api";

interface Order {
  id: number;
  orderId: string;
  valueRs: number;
  deliveryTimeMinutes: number;
  deliveredAt: string;
  routeId?: number;
  driverId?: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const [form, setForm] = useState({
    orderId: "",
    valueRs: 0,
    deliveryTimeMinutes: 30,
    deliveredAt: "",
    routeId: "",
    driverId: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchAll = async () => {
    const [o, r, d] = await Promise.all([
      api.get("/orders"),
      api.get("/routes"),
      api.get("/drivers"),
    ]);
    setOrders(o.data);
    setRoutes(r.data);
    setDrivers(d.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      routeId: form.routeId ? Number(form.routeId) : null,
      driverId: form.driverId ? Number(form.driverId) : null,
      deliveredAt: form.deliveredAt || new Date().toISOString(),
    };

    if (editingId) {
      await api.put(`/orders/${editingId}`, payload);
    } else {
      await api.post("/orders", payload);
    }

    setForm({
      orderId: "",
      valueRs: 0,
      deliveryTimeMinutes: 30,
      deliveredAt: "",
      routeId: "",
      driverId: "",
    });
    setEditingId(null);
    fetchAll();
  };

  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    setForm({
      orderId: order.orderId,
      valueRs: order.valueRs,
      deliveryTimeMinutes: order.deliveryTimeMinutes,
      deliveredAt: order.deliveredAt,
      routeId: order.routeId?.toString() || "",
      driverId: order.driverId?.toString() || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      orderId: "",
      valueRs: 0,
      deliveryTimeMinutes: 30,
      deliveredAt: "",
      routeId: "",
      driverId: "",
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this order?")) {
      await api.delete(`/orders/${id}`);
      fetchAll();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-6 gap-3"
      >
        <input
          type="text"
          placeholder="Order ID"
          className="border p-2 rounded"
          value={form.orderId}
          onChange={(e) => setForm({ ...form, orderId: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Value (Rs)"
          className="border p-2 rounded"
          value={form.valueRs}
          onChange={(e) =>
            setForm({ ...form, valueRs: Number(e.target.value) })
          }
          required
        />
        <input
          type="number"
          placeholder="Delivery Time (min)"
          className="border p-2 rounded"
          value={form.deliveryTimeMinutes}
          onChange={(e) =>
            setForm({ ...form, deliveryTimeMinutes: Number(e.target.value) })
          }
          required
        />
        <select
          className="border p-2 rounded"
          value={form.routeId}
          onChange={(e) => setForm({ ...form, routeId: e.target.value })}
        >
          <option value="">Select Route</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.routeId}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={form.driverId}
          onChange={(e) => setForm({ ...form, driverId: e.target.value })}
        >
          <option value="">Select Driver</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
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
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Value (Rs)</th>
              <th className="p-2 border">Time (min)</th>
              <th className="p-2 border">Route</th>
              <th className="p-2 border">Driver</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="p-2 border">{o.id}</td>
                <td className="p-2 border">{o.orderId}</td>
                <td className="p-2 border">{o.valueRs}</td>
                <td className="p-2 border">{o.deliveryTimeMinutes}</td>
                <td className="p-2 border">{o.routeId}</td>
                <td className="p-2 border">{o.driverId}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(o)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
