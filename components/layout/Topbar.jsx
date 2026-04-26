"use client";

import { Menu, PanelLeft, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useEffect, useState, useRef } from "react";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";

export default function Topbar({
    user,
    collapsed,
    setCollapsed,
    setMobileOpen,
}) {
    const pathname = usePathname();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    /* =========================
       CLOSE DROPDOWN (outside click)
    ========================= */
    useEffect(() => {
        const handleClick = (e) => {
            if (!dropdownRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    /* =========================
       Persist collapse
    ========================= */
    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
    }, [collapsed]);

    /* =========================
       TITLE
    ========================= */
    const titleMap = [
        { match: "/employee-list", label: "Employee Directory" },
        { match: "/overtime-list", label: "Overtime" },
        { match: "/leave-list", label: "Leave" },
    ];

    const pageTitle = useMemo(() => {
        const found = titleMap.find((t) => pathname.includes(t.match));
        return found ? found.label : "Dashboard";
    }, [pathname]);

    /* =========================
       GREETING
    ========================= */
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }, []);

    const displayName = useMemo(() => {
        if (!user) return "User";
        if (user.role?.includes("admin")) return "Admin";
        return user.name?.split(" ")[0] || "User";
    }, [user]);

    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header className="h-16 bg-[#0f172a] text-white px-6 flex items-center justify-between border-b border-white/10">

            {/* LEFT */}
            <div className="flex items-center gap-4">

                <button
                    className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu size={20} />
                </button>

                <button
                    className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 transition"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <PanelLeft size={20} />
                </button>

                <div className="flex flex-col leading-tight">
                    <h1 className="text-lg font-semibold">
                        {pageTitle}
                    </h1>
                    <p className="text-sm text-white/60">
                        {greeting}, {displayName}
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

                {/* THEME */}
                <div className="p-2 rounded-lg hover:bg-white/10 transition">
                    <ThemeToggle />
                </div>

                {/* NOTIFICATION */}
                <div className="p-2 rounded-lg hover:bg-white/10 transition">
                    <NotificationBell />
                </div>

                {/* PROFILE DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition"
                    >

                        {/* USER INFO */}
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-medium">
                                {displayName}
                            </span>
                            <span className="text-xs text-white/60">
                                {user?.email}
                            </span>
                        </div>

                        {/* AVATAR */}
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
                            {initial}
                        </div>

                        <ChevronDown size={16} className="text-white/60" />
                    </button>

                    {/* DROPDOWN */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border overflow-hidden z-50">

                            <DropdownItem icon={<User size={16} />} label="Profile" />
                            <DropdownItem icon={<Settings size={16} />} label="Settings" />

                            <div className="border-t" />

                            <DropdownItem
                                icon={<LogOut size={16} />}
                                label="Logout"
                                danger
                            />
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}

/* =========================
   DROPDOWN ITEM
========================= */
function DropdownItem({ icon, label, danger }) {
    return (
        <button
            className={`
                w-full flex items-center gap-2 px-4 py-2 text-sm
                hover:bg-gray-100 transition
                ${danger ? "text-red-600" : ""}
            `}
        >
            {icon}
            {label}
        </button>
    );
}