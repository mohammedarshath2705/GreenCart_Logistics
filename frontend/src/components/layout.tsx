import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // modern icons

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/simulation", label: "Simulation" },
    { path: "/drivers", label: "Drivers" },
    { path: "/routes", label: "Routes" },
    { path: "/orders", label: "Orders" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-white/10"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Centered nav links */}
            <div className="hidden sm:flex flex-1 justify-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-white text-gray-800 shadow"
                      : "hover:bg-white/20"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md shadow text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="sm:hidden bg-green-700 px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-white text-gray-800 shadow"
                    : "hover:bg-white/20"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
