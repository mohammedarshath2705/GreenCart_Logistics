// src/services/auth.ts
import api from "./api";

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

/**
 * Login with username & password
 */
export async function login(username: string, password: string) {
  try {
    const res = await api.post("/auth/login", { username, password });
    if (res.data?.token) {
      saveToken(res.data.token);
    }
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Login failed");
  }
}



/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  removeToken();
}