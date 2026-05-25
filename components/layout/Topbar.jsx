"use client";

import {
    Menu,
    PanelLeft,
    PanelLeftClose,
    ChevronDown,
    User,
    Settings,
    LogOut,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useMemo, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import api from "@/services/api";
import { getStorageUrl } from "@/lib/storage";
import NotificationBell from "@/components/NotificationBell";

import { generateBreadcrumbs } from "@/utils/generateBreadcrumbs";

export default function Topbar({
    user,
    collapsed,
    setCollapsed,
    setMobileOpen,
}) {

    const pathname = usePathname();
    const router = useRouter();

    console.log(user);

    const profileImage = getStorageUrl(
        user?.profile_image
    );

    const breadcrumb = useMemo(() => {
        return generateBreadcrumbs(user?.role, pathname);
    }, [user, pathname]);

    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    const avatarColors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
    ];

    const getAvatarColor = (name = "") => {

        let hash = 0;

        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return avatarColors[
            Math.abs(hash) % avatarColors.length
        ];
    };

    /* ======================================================
       LOGOUT
    ====================================================== */
    const handleLogout = async () => {

        try {

            await api.post("/logout");

            localStorage.clear();
            sessionStorage.clear();

            router.replace("/login");

        } catch (error) {

            console.error("Logout failed:", error);
        }
    };

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
            document.removeEventListener(
                "keydown",
                handleEscape
            );
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

            console.error(
                "Failed to persist sidebar state:",
                error
            );
        }

    }, [collapsed]);

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
                sticky
                top-0
                z-40

                h-[78px]

                border-b
                border-white/[0.06]

                bg-[#0b1120]/90
                backdrop-blur-2xl

                text-white
            "
        >

            {/* ======================================================
                BACKGROUND GLOW
            ====================================================== */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        -top-24
                        right-0
                        h-64
                        w-64
                        rounded-full
                        bg-blue-500/10
                        blur-3xl
                    "
                />
            </div>

            {/* ======================================================
                BOTTOM GLOW BORDER
            ====================================================== */}
            <div
                className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-blue-400/40
                    to-transparent
                "
            />

            {/* ======================================================
                INNER CONTAINER
            ====================================================== */}
            <div
                className="
                    relative
                    h-full

                    px-4
                    sm:px-6

                    flex
                    items-center
                    justify-between

                    max-w-screen-2xl
                    mx-auto
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
                            p-2.5
                            rounded-2xl

                            bg-white/[0.03]
                            border border-white/[0.06]

                            hover:bg-white/[0.06]

                            transition-all
                            duration-300
                        "
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu size={20} />
                    </button>

                    {/* DESKTOP COLLAPSE BUTTON */}
                    <button
                        type="button"
                        aria-label="Toggle sidebar"
                        onClick={() => setCollapsed(!collapsed)}
                        className="
                            hidden
                            lg:flex

                            items-center
                            justify-center

                            p-2.5
                            rounded-2xl

                            bg-white/[0.03]
                            border border-white/[0.06]

                            hover:bg-white/[0.06]

                            active:scale-95

                            transition-all
                            duration-300

                            group
                        "
                    >
                        <div
                            className={`
                                transition-all duration-300
                                ${collapsed
                                    ? "rotate-180 scale-95"
                                    : "rotate-0 scale-100"
                                }
                            `}
                        >
                            {collapsed ? (
                                <PanelLeftClose
                                    size={20}
                                    className="
                                        text-blue-400
                                        group-hover:text-blue-300
                                        transition-colors
                                    "
                                />
                            ) : (
                                <PanelLeft
                                    size={20}
                                    className="
                                        text-white
                                        group-hover:text-blue-300
                                        transition-colors
                                    "
                                />
                            )}
                        </div>
                    </button>

                    {/* PAGE TITLE */}
                    <div
                        className="
                            flex
                            items-center
                            gap-3

                            px-3.5
                            py-2.5

                            rounded-2xl

                            bg-white/[0.03]
                            backdrop-blur-md

                            border
                            border-white/[0.06]

                            shadow-[0_0_0_1px_rgba(255,255,255,0.02)]

                            hover:bg-white/[0.05]

                            transition-all
                            duration-300
                        "
                    >

                        {/* ICON */}
                        <div
                            className="
                                flex
                                items-center
                                justify-center

                                w-9
                                h-9

                                rounded-xl

                                bg-blue-500/10
                                border border-blue-400/10

                                text-blue-400
                            "
                        >
                            {breadcrumb?.icon}
                        </div>

                        {/* LABEL */}
                        <div className="min-w-0">

                            <p
                                className="
                                    text-[11px]
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-400
                                "
                            >
                                Workspace
                            </p>

                            <h1
                                className="
                                    text-sm
                                    font-semibold
                                    tracking-tight
                                    text-white
                                    truncate
                                "
                            >
                                {breadcrumb?.label}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* ======================================================
                    RIGHT SECTION
                ====================================================== */}
                <div className="flex items-center gap-3">

                    {/* NOTIFICATIONS */}
                    <div
                        className="
                            rounded-2xl

                            bg-white/[0.03]
                            border border-white/[0.06]

                            hover:bg-white/[0.06]

                            transition-all
                            duration-300
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
                                flex
                                items-center
                                gap-3

                                rounded-2xl

                                p-2

                                hover:bg-white/[0.06]

                                transition-all
                                duration-300
                            "
                        >

                            {/* USER INFO */}
                            <div
                                className="
                                    hidden
                                    md:flex
                                    flex-col
                                    text-right
                                    max-w-[200px]
                                "
                            >

                                <span
                                    className="
                                        text-sm
                                        font-semibold
                                        text-white
                                        leading-none
                                        truncate
                                    "
                                >
                                    {greeting}, {displayName}
                                </span>

                                <span
                                    className="
                                        mt-1
                                        text-[11px]
                                        text-slate-400
                                        truncate
                                    "
                                >
                                    Ready for today's workflow
                                </span>
                            </div>

                            {/* AVATAR */}
                            <div
                                className="
                                    relative
                                            
                                    w-10
                                    h-10
                                            
                                    shrink-0
                                "
                            >
                                            
                                {/* IMAGE WRAPPER */}
                                <div
                                    className="
                                        h-full
                                        w-full
                                            
                                        rounded-full
                                        overflow-hidden
                                            
                                        ring-2
                                        ring-white/10
                                            
                                        shadow-lg
                                        shadow-blue-500/20
                                    "
                                >
                                
                                    {profileImage ? (
                                    
                                        <img
                                            src={profileImage}
                                            alt={displayName}
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    
                                    ) : (
                                    
                                        <div
                                            className={`
                                                flex
                                                h-full
                                                w-full
                                                items-center
                                                justify-center
                                            
                                                text-sm
                                                font-semibold
                                                text-white
                                            
                                                ${getAvatarColor(displayName)}
                                            `}
                                        >
                                            {initial}
                                        </div>
                                    )}
                                </div>
                                
                                {/* ONLINE INDICATOR */}
                                <div
                                    className="
                                        absolute

                                        -bottom-0.5
                                        -right-0.5

                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    {/* PING */}
                                    <span
                                        className="
                                            absolute

                                            h-3.5
                                            w-3.5

                                            rounded-full

                                            bg-green-400

                                            animate-ping

                                            opacity-75
                                        "
                                    />

                                    {/* DOT */}
                                    <span
                                        className="
                                            relative

                                            h-3.5
                                            w-3.5

                                            rounded-full

                                            border-2
                                            border-[#0b1120]

                                            bg-green-400
                                        "
                                    />
                                </div>
                            </div>

                            {/* CHEVRON */}
                            <ChevronDown
                                size={16}
                                className={`
                                    text-white/60
                                    transition-transform
                                    duration-300

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
                                    absolute
                                    right-0
                                    mt-3

                                    w-64

                                    overflow-hidden

                                    rounded-3xl

                                    border
                                    border-white/10

                                    bg-white

                                    shadow-[0_20px_60px_rgba(15,23,42,0.25)]

                                    z-50

                                    animate-in
                                    fade-in
                                    zoom-in-95
                                    duration-150
                                "
                            >

                                {/* USER HEADER */}
                                <div
                                    className="
                                        px-5
                                        py-4

                                        border-b

                                        bg-slate-50
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            truncate
                                        "
                                    >
                                        {user?.name || "User"}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                            truncate
                                        "
                                    >
                                        {user?.email || "No email"}
                                    </p>
                                </div>

                                {/* MENU ITEMS */}
                                <div className="py-2">

                                    {/*
                                    
                                    <DropdownItem
                                        icon={<User size={16} />}
                                        label="Profile"
                                    />

                                    <DropdownItem
                                        icon={<Settings size={16} />}
                                        label="Settings"
                                    />

                                    */}

                                    {/*<div className="my-2 border-t border-slate-100" />*/}

                                    <DropdownItem
                                        icon={<LogOut size={16} />}
                                        label="Logout"
                                        danger
                                        onClick={handleLogout}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
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

                flex
                items-center
                gap-3

                px-5
                py-3

                text-sm
                font-medium

                transition-all
                duration-200

                hover:bg-slate-100

                ${danger
                    ? "text-red-600"
                    : "text-slate-700"
                }
            `}
        >
            {icon}

            <span>{label}</span>
        </button>
    );
}