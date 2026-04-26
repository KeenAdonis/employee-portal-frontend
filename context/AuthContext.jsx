"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // ⬅️ use RELATIVE PATH (important)

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ type, email, password, employee_no }) => {
    const res = await api.post("/login", {
      type,
      email,
      password,
      employee_no,
    });

    const token = res.data.token;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(res.data.user);

    return res.data; // 🔥 IMPORTANT (for redirect logic)
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) { }

    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.get("/me");
      setUser(res.data);
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ SAFE HOOK (fixes your error)
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}