"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminAccountingDashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome, {user?.role}
      </h1>

      <p className="text-gray-600 mt-2">
        This is your dashboard.
      </p>
    </div>
  );
}