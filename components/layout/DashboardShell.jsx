"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({ user, menu, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        user={user}
        menu={menu}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <Topbar
          user={user}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        {/* SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto">

          {/* OPTIONAL GLOBAL ALERT */}
          {/* 
          <div className="bg-yellow-100 text-yellow-800 px-6 py-2 text-sm">
            System maintenance tonight at 10PM
          </div>
          */}

          {/* CONTENT WRAPPER */}
          <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
}