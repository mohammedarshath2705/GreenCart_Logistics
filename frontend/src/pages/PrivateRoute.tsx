import { Navigate } from "react-router-dom";
import { getToken } from "../services/auth";
import type { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = getToken();
  return token ? children : <Navigate to="/auth" replace />;
}
