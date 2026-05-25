import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,

  (err) => {

    const requestUrl = err.config?.url || "";

    // Ignore login endpoint errors
    if (
      err.response?.status === 401 &&
      !requestUrl.includes("/login")
    ) {

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;