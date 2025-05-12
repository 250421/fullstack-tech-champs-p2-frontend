// src/lib/axios-config.ts
import axios from "axios";

// Create the Axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // not needed for JWT if you're passing token in headers
});

// Add interceptor to inject Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
