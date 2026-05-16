"use client";

import Modal from "@/components/ui/Modal";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function SurveyCommentsModal({
    open,
    onClose,
    employee,
}) {

    const { showToast } = useToast();

    if (!employee) return null;

    const handleCopy = (comments = []) => {

        const text = comments
            .map(comment => `• ${comment}`)
            .join("\n");

        navigator.clipboard.writeText(text);

        showToast({
            title: "Copied",
            message: "Comments copied successfully.",
            type: "success",
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`${employee.name} Feedback`}
            maxWidth="3xl"
        >

            <div className="space-y-6">

                {/* HEADER */}
                <div className="border rounded-2xl p-5 bg-gray-50">

                    <h2 className="text-xl font-semibold text-gray-900">
                        {employee.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {employee.department}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                        {employee.score} points
                    </div>

                </div>

                {/* POSITIVE */}
                <div className="border rounded-2xl p-5">

                    <div className="flex items-center justify-between mb-4">

                        <div>
                            <h3 className="font-semibold text-green-700">
                                Positive Feedback
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                                Why employees ranked this person highly
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                handleCopy(employee.positive_comments)
                            }
                            className="
                                flex items-center gap-2
                                text-sm text-blue-600
                                hover:text-blue-700
                            "
                        >
                            <Copy className="w-4 h-4" />
                            Copy
                        </button>

                    </div>

                    {(employee.positive_comments || []).length > 0 ? (

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">

                            {employee.positive_comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="
                                        border border-green-100
                                        bg-green-50
                                        rounded-xl
                                        p-4
                                        text-sm text-gray-700
                                    "
                                >
                                    • {comment}
                                </div>
                            ))}

                        </div>

                    ) : (

                        <div className="text-sm text-gray-400">
                            No positive feedback available.
                        </div>

                    )}

                </div>

                {/* NEGATIVE */}
                <div className="border rounded-2xl p-5">

                    <div className="flex items-center justify-between mb-4">

                        <div>
                            <h3 className="font-semibold text-red-700">
                                Improvement Feedback
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                                Why employees ranked this person lower
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                handleCopy(employee.negative_comments)
                            }
                            className="
                                flex items-center gap-2
                                text-sm text-blue-600
                                hover:text-blue-700
                            "
                        >
                            <Copy className="w-4 h-4" />
                            Copy
                        </button>

                    </div>

                    {(employee.negative_comments || []).length > 0 ? (

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">

                            {employee.negative_comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="
                                        border border-red-100
                                        bg-red-50
                                        rounded-xl
                                        p-4
                                        text-sm text-gray-700
                                    "
                                >
                                    • {comment}
                                </div>
                            ))}

                        </div>

                    ) : (

                        <div className="text-sm text-gray-400">
                            No improvement feedback available.
                        </div>

                    )}

                </div>

            </div>

        </Modal>
    );
}