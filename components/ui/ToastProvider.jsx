"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Toast from "@/components/ui/toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const showToast = ({
        title,
        message,
        type = "info",
        duration = 3000,
    }) => {
        const id = Date.now();

        setToasts((prev) => [
            ...prev,
            { id, title, message, type, visible: false },
        ]);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, visible: true } : t
                )
            );
        }, 50);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, visible: false } : t
                )
            );

            setTimeout(() => {
                removeToast(id);
            }, 300);
        }, duration);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* ✅ Portal */}
            {mounted &&
                createPortal(
                    <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none">
                        {toasts.map((t) => (
                            <Toast
                                key={t.id}
                                toast={t}
                                onClose={() => removeToast(t.id)}
                            />
                        ))}
                    </div>,
                    document.body
                )}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);