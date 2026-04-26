"use client";

import { useAuth } from "@/context/AuthContext";
import { menuByRole } from "@/config/menu";
import DashboardShell from "@/components/layout/DashboardShell";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  const menu = menuByRole[user?.role] || [];

  return (
    <DashboardShell user={user} menu={menu}>
      {children}
    </DashboardShell>
  );
}