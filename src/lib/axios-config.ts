import axios from "axios";

import { jwtDecode } from "jwt-decode";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});


axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token")?.trim();
      
      console.debug("[Axios] Making request to:", config.url);

      if (token) {
        
        const decodedToken: any = jwtDecode(token);
        if (decodedToken?.exp < Date.now() / 1000) {
          console.warn("[Axios] Token has expired");
          localStorage.removeItem("token");

          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login?error=session_expired";
          }
        } else {
          config.headers.Authorization = `Bearer ${token}`;
          console.debug("[Axios] Authorization header set");
        }
      } else {
        console.warn("[Axios] No token found in localStorage");
      }
    } catch (e) {
      console.error("[Axios] Error accessing localStorage:", e);
    }

    return config;
  },
  (error) => {
    console.error("[Axios] Request interceptor error:", error);
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    console.debug("[Axios] Response received:", {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });

   
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      console.debug("[Axios] Token saved to localStorage");
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.error || error.message;
    const errorCode = error.code;
    const requestUrl = error.config?.url;

    const errorData = {
      code: errorCode,
      status,
      message: errorMessage,
      url: requestUrl,
    };

    console.error("[Axios] API Error:", errorData);

    // Handle 403 Forbidden (AuthFilter failures)
    if (status === 403) {
      const errorMsg = errorMessage?.toLowerCase();

      const isAuthError =
        errorMsg?.includes("invalid/expired") ||
        errorMsg?.includes("must be provided") ||
        errorMsg?.includes("bearer");

      if (isAuthError) {
        console.warn("[Axios] Clearing invalid token (403 error)");
        localStorage.removeItem("token");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?error=auth_failed";
        }
      }
    }

    // Handle 401 Unauthorized (Session expired)
    if (status === 401) {
      console.warn("[Axios] Session expired (401 error)");
      localStorage.removeItem("token");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?error=session_expired";
      }
    }

    // Handle network errors
    if (errorCode === "ERR_NETWORK") {
      console.error("[Axios] Network error - Backend may be unreachable");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
