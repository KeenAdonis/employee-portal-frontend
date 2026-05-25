"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Sidebar({
    user,
    menu,
    collapsed,
    mobileOpen,
    setMobileOpen,
}) {
    const pathname = usePathname();
    const navRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        if (saved !== null) {
            document.documentElement.dataset.sidebar =
                JSON.parse(saved) ? "collapsed" : "expanded";
        }
    }, []);

    useEffect(() => {
        const el = navRef.current;
        if (!el) return;

        let timeout;

        const handleScroll = () => {
            el.classList.add("scrolling");

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                el.classList.remove("scrolling");
            }, 800); // hide after scroll stops
        };

        el.addEventListener("scroll", handleScroll);

        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <aside
            className={`
                fixed lg:static z-50 top-0 left-0 h-full
                bg-gradient-to-b from-[#0f172a] to-[#020617]
                text-white flex flex-col
                transition-all duration-300
                overflow-x-hidden
                ${collapsed ? "w-20" : "w-72"}
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
            `}
        >

            {/* HEADER */}
            <div
                className={`
                  h-20 flex items-center border-b border-white/10 mb-2
                  ${collapsed ? "justify-center px-0" : "px-4"}
                `}
            >
                <div
                    className={`
                      flex items-center
                      ${collapsed ? "flex-col gap-1" : "gap-3"}
                    `}
                >

                    {/* LOGO */}
                    <img
                        src="/logo.png"
                        alt="Company Logo"
                        className="w-9 h-9 object-contain drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]"
                    />

                    {/* TEXT */}
                    {!collapsed && (
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-sm tracking-wide text-white">
                                PSI, OPC Portal
                            </span>
                            <span className="text-[11px] text-white/50">
                                Secure access to your workspace
                            </span>
                        </div>
                    )}

                </div>
            </div>

            {/* MENU */}
            <nav
                ref={navRef}
                className="sidebar-scroll flex-1 px-2 py-4 space-y-6 overflow-y-auto overflow-x-hidden"
            >

                {menu.map((section, sIndex) => (
                    <div key={sIndex}>

                        {!collapsed && (
                            <p className="px-3 mb-2 text-xs text-white/40 uppercase tracking-wider">
                                {section.section}
                            </p>
                        )}

                        <div className="space-y-1">
                            {section.items.map((item, i) => {

                                // ✅ GUARD (fixes your error)
                                if (!item.href) return null;

                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`
                                            group relative flex items-center
                                            ${collapsed ? "justify-center px-2" : "gap-3 px-3"}
                                            py-2.5 rounded-xl
                                            transition-all duration-200
                                            ${isActive
                                                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f172a] shadow-lg shadow-amber-500/30"
                                                : "text-white hover:bg-amber-400/10"}
                                        `}
                                    >

                                        {/* ACTIVE INDICATOR */}
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r" />
                                        )}

                                        {/* ICON */}
                                        <span className="flex items-center justify-center w-5 h-5">
                                            {item.icon}
                                        </span>

                                        {/* LABEL */}
                                        {!collapsed && (
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                        )}

                                        {/* TOOLTIP */}
                                        {collapsed && (
                                            <span className="
                                                absolute left-full ml-2 px-2 py-1
                                                rounded-md bg-black text-xs text-white
                                                opacity-0 group-hover:opacity-100
                                                whitespace-nowrap pointer-events-none
                                                z-50
                                            ">
                                                {item.label}
                                            </span>
                                        )}

                                    </Link>
                                );
                            })}
                        </div>

                    </div>
                ))}

            </nav>

            {/* FOOTER */}
            {!collapsed && (
                <div className="p-4 border-t border-white/10 text-xs text-white/50">
                    Created by M.I.S. Team @ 2026
                </div>
            )}
        </aside>
    );
}