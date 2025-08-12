import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import type { Order } from "../types";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState("");
  const [valueRs, setValueRs] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(30);
  const [routeId, setRouteId] = useState<number | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const fetchData = async () => {
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
    fetchData();
  }, []);

  const createOrder = async () => {
    await api.post("/orders", {
      orderId,
      valueRs,
      deliveryTimeMinutes: deliveryTime,
      deliveredAt: new Date().toISOString(),
      routeId: routeId || null,
      driverId: driverId || null,
    });
    setOrderId("");
    setValueRs(0);
    setDeliveryTime(30);
    setRouteId(null);
    setDriverId(null);
    fetchData();
  };

  const removeOrder = async (id: number) => {
    if (!confirm("Delete order?")) return;
    await api.delete(`/orders/${id}`);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl mb-4">Orders</h1>

        {/* Create Form */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID"
              className="p-2 border rounded"
            />
            <input
              type="number"
              value={valueRs}
              onChange={(e) => setValueRs(Number(e.target.value))}
              placeholder="Value (Rs)"
              className="p-2 border rounded"
            />
            <input
              type="number"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(Number(e.target.value))}
              placeholder="Delivery Time (min)"
              className="p-2 border rounded"
            />
            <select
              value={routeId ?? ""}
              onChange={(e) => setRouteId(e.target.value ? Number(e.target.value) : null)}
              className="p-2 border rounded"
            >
              <option value="">Select Route</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeId}
                </option>
              ))}
            </select>
            <select
              value={driverId ?? ""}
              onChange={(e) => setDriverId(e.target.value ? Number(e.target.value) : null)}
              className="p-2 border rounded"
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <button onClick={createOrder} className="bg-black text-white px-4 rounded">
              Add
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Value</th>
                <th>Time (min)</th>
                <th>Route</th>
                <th>Driver</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="py-2">{o.orderId}</td>
                  <td>{o.valueRs}</td>
                  <td>{o.deliveryTimeMinutes}</td>
                  <td>{o.route?.routeId ?? o.routeId}</td>
                  <td>{o.driver?.name ?? o.driverId}</td>
                  <td>
                    <button
                      className="text-red-600"
                      onClick={() => removeOrder(o.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
