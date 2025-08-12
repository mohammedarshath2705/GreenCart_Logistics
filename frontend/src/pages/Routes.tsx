// src/pages/Routes.tsx
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

type RouteType = { id: number; routeId: string; distanceKm: number; trafficLevel: string; baseTimeMinutes: number };

export default function RoutesPage() {
  const [items, setItems] = useState<RouteType[]>([]);
  const [routeId, setRouteId] = useState("");
  const [distance, setDistance] = useState(0);
  const [traffic, setTraffic] = useState("Low");
  const [baseTime, setBaseTime] = useState(0);

  const fetch = async () => { const res = await api.get("/routes"); setItems(res.data); };

  useEffect(()=>{ fetch(); }, []);

  const create = async () => {
    await api.post("/routes", { routeId, distanceKm: distance, trafficLevel: traffic, baseTimeMinutes: baseTime });
    setRouteId(""); setDistance(0); setTraffic("Low"); setBaseTime(0);
    fetch();
  };

  const remove = async (id: number) => { if (!confirm("Delete route?")) return; await api.delete(`/routes/${id}`); fetch(); };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl mb-4">Routes</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <input value={routeId} onChange={(e)=>setRouteId(e.target.value)} placeholder="Route ID" className="p-2 border rounded" />
            <input type="number" value={distance} onChange={(e)=>setDistance(Number(e.target.value))} placeholder="Distance Km" className="p-2 border rounded" />
            <select value={traffic} onChange={(e)=>setTraffic(e.target.value)} className="p-2 border rounded">
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <input type="number" value={baseTime} onChange={(e)=>setBaseTime(Number(e.target.value))} placeholder="Base Time (min)" className="p-2 border rounded" />
            <button onClick={create} className="bg-black text-white px-4 rounded">Add</button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <table className="w-full text-left">
            <thead><tr><th>Route ID</th><th>Distance</th><th>Traffic</th><th>Base Time</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">{r.routeId}</td>
                  <td>{r.distanceKm} km</td>
                  <td>{r.trafficLevel}</td>
                  <td>{r.baseTimeMinutes} min</td>
                  <td><button className="text-red-600" onClick={()=>remove(r.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
