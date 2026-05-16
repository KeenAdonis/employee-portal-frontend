"use client";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import {
    AlertTriangle,
    Trash2,
    CheckCircle2,
    Info,
} from "lucide-react";

const icons = {
    danger: AlertTriangle,
    success: CheckCircle2,
    info: Info,
};

const colors = {
    danger: {
        container: "bg-red-50 border-red-100",
        iconBox: "bg-red-100 text-red-600",
        title: "text-red-700",
        button: "bg-red-500 hover:bg-red-600",
    },

    success: {
        container: "bg-green-50 border-green-100",
        iconBox: "bg-green-100 text-green-600",
        title: "text-green-700",
        button: "bg-green-500 hover:bg-green-600",
    },

    info: {
        container: "bg-blue-50 border-blue-100",
        iconBox: "bg-blue-100 text-blue-600",
        title: "text-blue-700",
        button: "bg-blue-500 hover:bg-blue-600",
    },
};

export default function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    loading = false,

    type = "danger",

    title = "Confirm Action",
    message = "Are you sure you want to continue?",

    confirmText = "Confirm",
    cancelText = "Cancel",

    itemName = "",

    showIcon = true,
}) {

    const Icon =
        icons[type] || AlertTriangle;

    const theme =
        colors[type] || colors.danger;

    return (
        <Modal
            open={open}
            onClose={loading ? null : onClose}
            title={title}
            maxWidth="max-w-md"
        >

            <div className="space-y-6">

                {/* CONTENT */}
                <div
                    className={`
                        flex items-start gap-4
                        p-4 rounded-2xl border
                        ${theme.container}
                    `}
                >

                    {showIcon && (
                        <div
                            className={`
                                w-12 h-12 rounded-2xl
                                flex items-center justify-center
                                shrink-0
                                ${theme.iconBox}
                            `}
                        >
                            <Icon className="w-6 h-6" />
                        </div>
                    )}

                    <div className="flex-1">

                        <h3
                            className={`
                                font-semibold
                                ${theme.title}
                            `}
                        >
                            {title}
                        </h3>

                        <p
                            className="
                                text-sm text-gray-600
                                mt-1 leading-relaxed
                            "
                        >
                            {message}
                        </p>

                        {itemName && (
                            <div
                                className="
                                    mt-3 px-3 py-2
                                    rounded-xl border
                                    bg-white
                                    text-sm font-medium
                                    text-gray-800
                                "
                            >
                                {itemName}
                            </div>
                        )}

                    </div>

                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3">

                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl"
                    >
                        {cancelText}
                    </Button>

                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                            rounded-xl text-white
                            ${theme.button}
                        `}
                    >
                        {loading
                            ? "Processing..."
                            : confirmText}
                    </Button>

                </div>

            </div>

        </Modal>
    );
}