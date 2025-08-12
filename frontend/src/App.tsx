import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import type { JSX } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
}

// 💡 Hardcode token ONCE for testing
localStorage.setItem(
  "token",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NDk3OTYwNiwiZXhwIjoxNzU1MDY2MDA2fQ.PBAuLZJBUDWlkO4-GKn5Hj0Ww1jjuF7Ys9UaWEl1hXg"
);

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("token"); // ✅ read, not set
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
