"use client";

import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
  id: number;
  title?: string;
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastProps {
  toast: ToastData;
  onClose: () => void;
}

const variants = {
  success: {
    bg: "bg-green-50 border-green-200 text-green-800",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
  error: {
    bg: "bg-red-50 border-red-200 text-red-800",
    icon: <XCircle className="w-5 h-5 text-red-600" />,
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  },
  info: {
    bg: "bg-blue-50 border-blue-200 text-blue-800",
    icon: <Info className="w-5 h-5 text-blue-600" />,
  },
};

export default function Toast({ toast, onClose }: ToastProps) {
  const variant = variants[toast.type] || variants.info;

  return (
    <div
      className={`
        pointer-events-auto
        w-[320px] border rounded-lg shadow-lg p-4
        flex gap-3 items-start backdrop-blur-sm
        ${variant.bg}

        transform transition-all duration-300 ease-out

        ${toast.visible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-8 scale-95"
        }
      `}
    >
      {/* ICON */}
      <div className="mt-0.5">{variant.icon}</div>

      {/* CONTENT */}
      <div className="flex-1">
        {toast.title && (
          <div className="font-semibold text-sm">{toast.title}</div>
        )}
        <div className="text-sm">{toast.message}</div>
      </div>

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="opacity-60 hover:opacity-100 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}