"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";
import SecureDocumentsTable from "@/components/secure-documents/SecureDocumentsTable";

export default function SecureDocumentWrapper({
    data,
    refresh,
    onViewHistory,
}) {

    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    /* =========================
       TOGGLE SINGLE
    ========================= */
    const toggle = (item) => {

        setSelectedRows((prev) => {

            const exists = prev.some(
                (row) => row.id === item.id
            );

            if (exists) {

                return prev.filter(
                    (row) => row.id !== item.id
                );
            }

            return [...prev, item];
        });
    };

    /* =========================
       SELECT ALL
    ========================= */
    const safeData = Array.isArray(data)
        ? data
        : [];

    const selectableRows = safeData.filter(
        (item) =>
            item.status !== "Sent" &&
            item.status !== "Queued" &&
            item.status !== "Processing"
    );

    const allSelected =
        selectableRows.length > 0 &&
        selectableRows.every((item) =>
            selectedRows.some(
                (row) => row.id === item.id
            )
        );

    const toggleAll = () => {

        if (allSelected) {

            setSelectedRows((prev) =>
                prev.filter(
                    (row) =>
                        !selectableRows.some(
                            (item) => item.id === row.id
                        )
                )
            );

        } else {

            setSelectedRows((prev) => {

                const existingIds = prev.map(
                    (row) => row.id
                );

                const newRows = selectableRows.filter(
                    (item) =>
                        !existingIds.includes(item.id)
                );

                return [...prev, ...newRows];
            });
        }
    };

    /* =========================
       BULK SEND
    ========================= */
    const bulkSend = async () => {

        try {

            setLoading(true);

            await api.post(
                "/secure-documents/bulk-send",
                {
                    ids: selectedRows.map(
                        (row) => row.id
                    ),
                }
            );

            showToast({
                title: "Success",
                message: "Documents queued successfully",
                type: "success",
            });

            setSelectedRows([]);

            refresh();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err?.response?.data?.message ||
                    "Bulk send failed",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /* =========================
       SEND SINGLE
    ========================= */
    const sendSingle = async (id) => {

        try {

            await api.post(
                `/secure-documents/send/${id}`
            );

            showToast({
                title: "Success",
                message: "Document queued successfully",
                type: "success",
            });

            refresh();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err?.response?.data?.message ||
                    "Send failed",
                type: "error",
            });
        }
    };

    /* =========================
       SEND GROUP
    ========================= */
    const sendGrouped = async (id) => {

        try {

            await api.post(
                `/secure-documents/grouped-send/${id}`
            );

            showToast({
                title: "Success",
                message:
                    "Grouped documents queued successfully",
                type: "success",
            });

            refresh();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err?.response?.data?.message ||
                    "Grouped send failed",
                type: "error",
            });
        }
    };

    /* =========================
       AUTO REFRESH
    ========================= */
    useEffect(() => {

        const hasProcessing = safeData.some(
            (doc) =>
                doc.status === "Queued" ||
                doc.status === "Processing"
        );

        if (!hasProcessing) return;

        const interval = setInterval(() => {
            refresh();
        }, 3000);

        return () => clearInterval(interval);

    }, [data, refresh]);

    return (

        <div>

            {/* BULK ACTION BAR */}
            {selectedRows.length > 0 && (

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        border-indigo-100
                        bg-indigo-50
                        px-4
                        py-3
                    "
                >

                    <div className="space-y-1">

                        <div
                            className="
                                text-sm
                                font-medium
                                text-indigo-700
                            "
                        >
                            {
                                new Set(
                                    selectedRows.map((item) => {

                                        const emails = item.recipients
                                            ?.map((r) => r.email)
                                            .sort()
                                            .join(",");

                                        return `${item.employee_name}-${emails}`;
                                    })
                                ).size
                            } row(s) selected (
                            {selectedRows.length} document(s))
                        </div>

                        <div
                            className="
                                text-xs
                                text-indigo-500
                            "
                        >
                            Documents for the same recipient
                            will be grouped automatically.
                        </div>

                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <button
                            onClick={bulkSend}
                            disabled={loading}
                            className="
                                px-4
                                py-2
                                rounded-xl
                                bg-indigo-600
                                text-white
                                text-sm
                                hover:bg-indigo-700
                                transition
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Sending..."
                                : "Send Selected"}
                        </button>

                        <button
                            onClick={() =>
                                setSelectedRows([])
                            }
                            className="
                                px-4
                                py-2
                                rounded-xl
                                border
                                text-sm
                                hover:bg-gray-100
                                transition
                            "
                        >
                            Clear
                        </button>

                    </div>

                </div>
            )}

            <SecureDocumentsTable
                data={safeData}
                selected={selectedRows.map(
                    (row) => row.id
                )}
                toggle={toggle}
                toggleAll={toggleAll}
                allSelected={allSelected}
                onSendSingle={sendSingle}
                onSendGrouped={sendGrouped}
                onViewHistory={onViewHistory}
            />

        </div>
    );
}