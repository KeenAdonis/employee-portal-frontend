"use client";

import { useEffect, useState } from "react";
import UploadForm from "@/components/admintesting/UploadForm";
import SecureDocumentWrapper from "@/components/admintesting/SecureDocumentWrapper";
import Pagination from "@/components/table/Pagination";
import api from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/Drawer";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/format";

import { documentStatusOptions } from "@/config/options";

/* =========================
   FORM FIELD
========================= */
function FormField({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
                {label}
            </label>
            {children}
        </div>
    );
}

export default function SecureDocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const { showToast } = useToast();

    /* ================= HISTORY STATES ================= */
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    /* ================= FETCH ================= */
    const fetchDocuments = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await api.get("/secure-documents", {
                params: {
                    page: pageNumber,
                    search,
                    status,
                },
            });

            setDocuments(res?.data?.data?.data || []);
            setMeta(res?.data?.data);

        } catch (err) {
            showToast({
                title: "Error",
                message: "Failed to fetch documents",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    /* ================= HISTORY FETCH ================= */
    const fetchHistory = async (email) => {
        try {
            setLoadingHistory(true);

            const res = await api.get("/secure-documents/history", {
                params: { email }
            });

            setHistoryData(res.data.data || []);

        } catch (err) {
            showToast({
                title: "Error",
                message: "Failed to fetch history",
                type: "error",
            });
        } finally {
            setLoadingHistory(false);
        }
    };

    /* ================= HANDLE HISTORY ================= */
    const handleViewHistory = (email) => {
        setSelectedEmail(email);
        setHistoryOpen(true);
        fetchHistory(email);
    };

    /* ================= PAGINATION ================= */
    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ================= EFFECTS ================= */
    useEffect(() => {
        fetchDocuments(page);
    }, [page]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setPage(1);
            fetchDocuments(1);
        }, 300);

        return () => clearTimeout(delay);
    }, [search, status]);

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">
                    Secure Documents
                </h1>
            </div>

            {/* UPLOAD */}
            <UploadForm onSuccess={() => fetchDocuments(page)} />

            {/* FILTERS */}
            <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                    Filters
                </h2>

                <div className="grid grid-cols-3 gap-4">

                    <FormField label="Search Document">
                        <Input
                            placeholder="Employee, email, file..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </FormField>

                    <FormField label="Status">
                        <CustomSelect
                            value={status}
                            options={documentStatusOptions}
                            onChange={(value) => setStatus(value)}
                        />
                    </FormField>

                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch("");
                                setStatus("All");
                            }}
                            className="w-full"
                        >
                            Clear Filters
                        </Button>
                    </div>

                </div>
            </div>

            {/* TABLE */}
            <SecureDocumentWrapper
                data={documents}
                refresh={() => fetchDocuments(page)}
                loading={loading}
                onViewHistory={handleViewHistory} // ✅ KEY
            />

            {/* PAGINATION */}
            <div className="flex justify-end">
                <Pagination
                    meta={meta}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* ================= HISTORY DRAWER ================= */}
            <Drawer
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                title={`History - ${selectedEmail}`}
            >
                <div className="space-y-4">

                    {loadingHistory ? (
                        <div className="text-center py-10 text-sm text-gray-500">
                            Loading history...
                        </div>
                    ) : historyData.length === 0 ? (
                        <div className="text-center py-10 text-sm text-gray-500">
                            No history found
                        </div>
                    ) : (
                        historyData.map((item, index) => (

                            <div key={index} className="flex gap-3">

                                {/* TIMELINE */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full 
                                        ${item.status === "Success" ? "bg-green-500" :
                                            item.status === "Failed" ? "bg-red-500" :
                                                "bg-gray-400"}
                                    `} />

                                    {index !== historyData.length - 1 && (
                                        <div className="w-px flex-1 bg-gray-200"></div>
                                    )}
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1 border rounded-xl p-4 bg-white">

                                    <div className="flex justify-between items-center">
                                        <StatusBadge status={item.status} />
                                        <span className="text-xs text-gray-500">
                                            {formatDate(item.created_at)}
                                        </span>
                                    </div>

                                    <p className="text-sm font-medium text-gray-900 mt-2">
                                        {item.file_name || "No file"}
                                    </p>

                                    {item.message && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {item.message}
                                        </p>
                                    )}

                                </div>

                            </div>

                        ))
                    )}

                </div>
            </Drawer>

        </div>
    );
}