"use client";

import { useState } from "react";
import api from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";
import SecureDocumentTable from "@/components/admintesting/SecureDocumentTable";
import { useEffect } from "react";

export default function SecureDocumentWrapper({ data, refresh, onViewHistory }) {
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();


    const toggle = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    const allSelected = data.length > 0 && selected.length === data.length;

    const toggleAll = () => {
        if (allSelected) {
            setSelected([]);
        } else {
            setSelected(data.map(item => item.id));
        }
    };

    const bulkDelete = async () => {
        if (!confirm("Delete selected documents?")) return;

        try {
            await api.post("/secure-documents/bulk-delete", {
                ids: selected,
            });

            showToast({
                title: "Deleted",
                message: "Documents removed",
                type: "success",
            });

            setSelected([]);
            refresh();

        } catch {
            showToast({
                title: "Error",
                message: "Bulk delete failed",
                type: "error",
            });
        }
    };

    /* =========================
       BULK SEND
    ========================= */
    const bulkSend = async () => {
        try {
            setLoading(true);

            await api.post("/secure-documents/bulk-send", {
                ids: selected,
            });

            showToast({
                title: "Success",
                message: "Documents sent!",
                type: "success",
            });

            setSelected([]);
            refresh();

        } catch (err) {
            showToast({
                title: "Error",
                message: err?.response?.data?.message || "Bulk send failed",
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
            await api.post(`/secure-documents/send/${id}`);

            showToast({
                title: "Success",
                message: "Document sent!",
                type: "success",
            });

            refresh();
        } catch (err) {
            showToast({
                title: "Error",
                message: err?.response?.data?.message || "Send failed",
                type: "error",
            });
        }
    };

    /* =========================
       RESEND
    ========================= */
    const handleResend = async (id) => {
        try {
            await api.post(`/secure-documents/${id}/resend`);

            showToast({
                title: "Success",
                message: "Document resend queued",
                type: "success",
            });

            refresh();
        } catch (err) {
            showToast({
                title: "Error",
                message: "Resend failed",
                type: "error",
            });
        }
    };

    /* =========================
       VIEW
    ========================= */
    const handleView = (item) => {
        console.log("VIEW:", item);
        // next: modal PDF viewer
    };

    /* =========================
       DOWNLOAD
    ========================= */
    const handleDownload = (item) => {
        window.open(`/storage/${item.file_path}`, "_blank");
    };

    /* =========================
       DELETE
    ========================= */
    const handleDelete = async (id) => {
        if (!confirm("Delete this document?")) return;

        try {
            await api.delete(`/secure-documents/${id}`);

            showToast({
                title: "Deleted",
                message: "Document removed",
                type: "success",
            });

            refresh();
        } catch (err) {
            showToast({
                title: "Error",
                message: "Delete failed",
                type: "error",
            });
        }
    };

    useEffect(() => {
        const hasProcessing = data.some(
            (doc) => doc.status === "Queued" || doc.status === "Processing"
        );

        if (!hasProcessing) return;

        const interval = setInterval(() => {
            refresh();
        }, 3000);

        return () => clearInterval(interval);
    }, [data]);



    return (
        <div>
            <SecureDocumentTable
                data={data}
                selected={selected}
                toggle={toggle}
                onSendSingle={sendSingle}
                onResend={handleResend}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
                toggleAll={toggleAll}
                allSelected={allSelected}
                onBulkSend={bulkSend}
                onBulkDelete={bulkDelete}
                onViewHistory={onViewHistory}
            />
        </div>
    );
}