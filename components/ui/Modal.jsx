"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({
    open,
    onClose,
    title,
    subtitle,
    children,
    footer,
}) {

    const [mounted, setMounted] = useState(false);

    // ✅ Fix hydration issue
    useEffect(() => {
        setMounted(true);
    }, []);

    // 🔒 Prevent background scroll
    useEffect(() => {
        if (!mounted) return;
        document.body.style.overflow = open ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open, mounted]);

    // ⌨️ Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // ❗ Prevent SSR mismatch
    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">

                    {/* OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* MODAL */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 10 }}
                        transition={{
                            duration: 0.18,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative z-10 w-full max-w-3xl mx-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] overflow-hidden">

                            {/* HEADER */}
                            <div className="flex items-start justify-between px-6 py-4 border-b">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {title}
                                    </h2>

                                    {subtitle && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* BODY */}
                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                {children}
                            </div>

                            {/* FOOTER */}
                            {footer && (
                                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
                                    {footer}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}