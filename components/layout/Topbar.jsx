"use client";

import {
    Menu,
    PanelLeft,
    ChevronDown,
    User,
    Settings,
    LogOut,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useMemo, useEffect, useState, useRef } from "react";

import NotificationBell from "@/components/NotificationBell";

import { TOPBAR_META } from "@/config/topbar.config";

export default function Topbar({
    user,
    collapsed,
    setCollapsed,
    setMobileOpen,
}) {
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    /* ======================================================
       CLOSE DROPDOWN ON OUTSIDE CLICK
    ====================================================== */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    /* ======================================================
       CLOSE DROPDOWN ON ESCAPE
    ====================================================== */
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    /* ======================================================
       PERSIST SIDEBAR STATE
    ====================================================== */
    useEffect(() => {
        try {
            localStorage.setItem(
                "sidebarCollapsed",
                JSON.stringify(collapsed)
            );
        } catch (error) {
            console.error("Failed to persist sidebar state:", error);
        }
    }, [collapsed]);

    /* ======================================================
       PAGE META
    ====================================================== */
    const currentMeta = useMemo(() => {
        const matchedRoute = Object.keys(TOPBAR_META).find((route) =>
            pathname.startsWith(route)
        );

        return matchedRoute
            ? TOPBAR_META[matchedRoute]
            : {
                  title: "Dashboard",
                  description: "Welcome back",
              };
    }, [pathname]);

    /* ======================================================
       GREETING
    ====================================================== */
    const greeting = useMemo(() => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";

        return "Good evening";
    }, []);

    /* ======================================================
       DISPLAY NAME
    ====================================================== */
    const displayName = useMemo(() => {
        if (!user) return "User";

        if (user.role?.includes("admin")) {
            return "Admin";
        }

        return user.name?.split(" ")[0] || "User";
    }, [user]);

    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header
            className="
                sticky top-0 z-40
                h-16
                border-b border-white/10
                bg-[#0f172a]/95
                backdrop-blur-xl
                text-white
                px-4 sm:px-6
                flex items-center justify-between
            "
        >
            {/* ======================================================
                LEFT SECTION
            ====================================================== */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                {/* MOBILE SIDEBAR BUTTON */}
                <button
                    type="button"
                    aria-label="Open sidebar"
                    className="
                        lg:hidden
                        p-2
                        rounded-xl
                        hover:bg-white/10
                        transition-colors
                    "
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu size={20} />
                </button>

                {/* DESKTOP COLLAPSE BUTTON */}
                <button
                    type="button"
                    aria-label="Toggle sidebar"
                    className="
                        hidden lg:flex
                        p-2
                        rounded-xl
                        hover:bg-white/10
                        transition-colors
                    "
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <PanelLeft size={20} />
                </button>

                {/* PAGE META */}
                <div className="flex flex-col leading-tight min-w-0">

                    <h1
                        className="
                            text-base sm:text-lg
                            font-semibold
                            tracking-tight
                            truncate
                        "
                    >
                        {currentMeta.title}
                    </h1>

                    <p
                        className="
                            text-xs sm:text-sm
                            text-white/60
                            truncate
                        "
                    >
                        {currentMeta.description}
                    </p>
                </div>
            </div>

            {/* ======================================================
                RIGHT SECTION
            ====================================================== */}
            <div className="flex items-center gap-2 sm:gap-3">

                {/* NOTIFICATIONS */}
                <div
                    className="
                        rounded-xl
                        hover:bg-white/10
                        transition-colors
                    "
                >
                    <NotificationBell user={user} />
                </div>

                {/* PROFILE DROPDOWN */}
                <div
                    className="relative"
                    ref={dropdownRef}
                >
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={() => setOpen((prev) => !prev)}
                        className="
                            flex items-center gap-3
                            rounded-xl
                            p-2
                            hover:bg-white/10
                            transition-colors
                        "
                    >
                        {/* USER INFO */}
                        <div className="hidden md:flex flex-col text-right max-w-[180px]">

                            <span className="text-sm font-medium truncate">
                                
                                {greeting}, {displayName}
                            </span>

                            <span className="text-xs text-white/60 truncate">
                                Welcome back!
                            </span>
                        </div>

                        {/* AVATAR */}
                        <div
                            className="
                                w-9 h-9
                                rounded-full
                                bg-blue-600
                                flex items-center justify-center
                                text-sm font-semibold
                                shrink-0
                            "
                        >
                            {initial}
                        </div>

                        <ChevronDown
                            size={16}
                            className={`
                                text-white/60
                                transition-transform
                                ${open ? "rotate-180" : ""}
                            `}
                        />
                    </button>

                    {/* ======================================================
                        DROPDOWN MENU
                    ====================================================== */}
                    {open && (
                        <div
                            className="
                                absolute right-0 mt-2
                                w-56
                                overflow-hidden
                                rounded-2xl
                                border border-gray-200
                                bg-white
                                shadow-2xl
                                z-50
                            "
                        >
                            {/* USER HEADER */}
                            <div className="px-4 py-3 border-b bg-gray-50">

                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user?.name || "User"}
                                </p>

                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || "No email"}
                                </p>
                            </div>

                            {/* MENU ITEMS */}
                            <div className="py-2">

                                <DropdownItem
                                    icon={<User size={16} />}
                                    label="Profile"
                                />

                                <DropdownItem
                                    icon={<Settings size={16} />}
                                    label="Settings"
                                />

                                <div className="my-2 border-t" />

                                <DropdownItem
                                    icon={<LogOut size={16} />}
                                    label="Logout"
                                    danger
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

/* ======================================================
   DROPDOWN ITEM
====================================================== */
function DropdownItem({
    icon,
    label,
    danger = false,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full
                flex items-center gap-3
                px-4 py-2.5
                text-sm
                transition-colors
                hover:bg-gray-100

                ${danger ? "text-red-600" : "text-gray-700"}
            `}
        >
            {icon}

            <span>{label}</span>
        </button>
    );
}
