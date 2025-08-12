// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="text-xl font-bold">GreenCart</Link>
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
          <Link to="/simulation" className="text-sm text-gray-600 hover:text-gray-900">Simulation</Link>
          <Link to="/drivers" className="text-sm text-gray-600 hover:text-gray-900">Drivers</Link>
          <Link to="/routes" className="text-sm text-gray-600 hover:text-gray-900">Routes</Link>
          <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900">Orders</Link>
        </div>
        <div>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
