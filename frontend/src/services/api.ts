import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NDk3OTYwNiwiZXhwIjoxNzU1MDY2MDA2fQ.PBAuLZJBUDWlkO4-GKn5Hj0Ww1jjuF7Ys9UaWEl1hXg";
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
