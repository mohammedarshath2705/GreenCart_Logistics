// src/pages/Drivers.tsx
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

type Driver = { id: number; name: string; currentShiftHours: number; past7DayHours: number };

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [name, setName] = useState("");
  const [cs, setCs] = useState(0);
  const [p7, setP7] = useState(0);

  const fetch = async () => {
    const res = await api.get("/drivers");
    setDrivers(res.data);
  };

  useEffect(() => { fetch(); }, []);

  const create = async () => {
    await api.post("/drivers", { name, currentShiftHours: cs, past7DayHours: p7 });
    setName(""); setCs(0); setP7(0);
    fetch();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete driver?")) return;
    await api.delete(`/drivers/${id}`);
    fetch();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl mb-4">Drivers</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="p-2 border rounded" />
            <input type="number" placeholder="Current Shift Hours" value={cs} onChange={(e)=>setCs(Number(e.target.value))} className="p-2 border rounded" />
            <input type="number" placeholder="Past 7-day Hours" value={p7} onChange={(e)=>setP7(Number(e.target.value))} className="p-2 border rounded" />
            <button onClick={create} className="bg-black text-white px-4 rounded">Add</button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <table className="w-full text-left">
            <thead><tr><th>Name</th><th>Shift Hrs</th><th>Past7</th><th>Actions</th></tr></thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id} className="border-t">
                  <td className="py-2">{d.name}</td>
                  <td>{d.currentShiftHours}</td>
                  <td>{d.past7DayHours}</td>
                  <td>
                    <button onClick={()=>remove(d.id)} className="text-red-600">Delete</button>
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
