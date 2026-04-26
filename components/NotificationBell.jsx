"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  // 🔥 mock data (palitan later from API)
  const notifications = [
    { id: 1, text: "New employee added" },
    { id: 2, text: "Payroll updated" },
  ];

  return (
    <div className="relative">

      {/* 🔔 ICON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5" />

        {/* BADGE */}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5">
            {notifications.length}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50">

          <div className="p-3 border-b font-medium text-sm">
            Notifications
          </div>

          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 text-sm hover:bg-gray-50 cursor-pointer"
                >
                  {n.text}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}