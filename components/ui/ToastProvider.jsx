"use client";

import { createContext, useContext, useState } from "react";
import Toast from "@/components/ui/toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = ({
        title,
        message,
        type = "info",
        duration = 3000,
    }) => {
        const id = Date.now();

        // 1. ADD as hidden
        setToasts((prev) => [
            ...prev,
            { id, title, message, type, visible: false },
        ]);

        // 2. TRIGGER enter animation (important delay)
        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, visible: true } : t
                )
            );
        }, 50); // 👈 maliit delay para mag-render muna

        // 3. EXIT animation
        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, visible: false } : t
                )
            );

            // 4. REMOVE after animation
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

            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
                {toasts.map((t) => (
                    <Toast
                        key={t.id}
                        toast={t}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);