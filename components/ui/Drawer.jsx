"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export default function Drawer({ open, onClose, title, children, footer }) {

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div
            className={`fixed inset-0 z-50 flex transition-all duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"
                }`}
        >

            {/* OVERLAY */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* DRAWER PANEL */}
            <div
                className={`ml-auto w-full max-w-md h-full bg-white shadow-xl relative z-50 flex flex-col transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >

                {/* HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="text-lg font-semibold">{title}</h2>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {children}
                </div>

                {/* FOOTER */}
                {footer && (
                    <div className="border-t p-4 flex gap-2">
                        {footer}
                    </div>
                )}

            </div>
        </div>
    );
}