"use client";

import { useEffect, useState } from "react";
import RequisitionTable from "@/components/requisition/RequisitionTable";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/table/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import Tabs from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/ToastProvider";
import { useActionState } from "@/lib/useActionState";
import api from "@/services/api";
import { formatDate, formatCurrency } from "@/lib/format";

import { Eye, Paperclip } from "lucide-react";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState("requests");

    const { showToast } = useToast();

    const checkAction = useActionState();
    const rejectAction = useActionState();

    /* ================= FETCH ================= */
    const fetchRequisition = async (pageNumber = 1) => {

        try {

            setLoading(true);

            const statusFilter =
                tab === "requests"
                    ? "Pending"
                    : "Checked,Approved,Liquidated,Rejected";

            const res = await api.get(
                `/requisition?page=${pageNumber}&status=${statusFilter}`
            );

            setData(res.data.data.data || []);

            setMeta(res.data.data);

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Failed to fetch requisitions",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /* ================= ACTION ================= */
    const handleCheck = async () => {
        try {
            await api.post(`/requisition/${selected.id}/status`, {
                status: "Checked",
            });

            showToast({
                title: "Success",
                message: "Marked as Checked",
                type: "success",
            });

            setOpenDrawer(false);
            fetchRequisition(page);

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Failed to update status",
                type: "error",
            });
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            showToast({
                title: "Warning",
                message: "Reason is required.",
                type: "warning",
            });
            return;
        }

        try {
            await api.post(`/requisition/${selected.id}/status`, {
                status: "Rejected",
                reason: rejectReason,
            });

            showToast({
                title: "Success",
                message: "Requisition rejected",
                type: "success",
            });

            setRejectOpen(false);
            setOpenDrawer(false);
            setRejectReason("");
            fetchRequisition(page);

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Failed to reject",
                type: "error",
            });
        }
    };

    /* ================= VIEW ================= */
    const handleView = (item) => {
        setSelected(item);
        setOpenDrawer(true);
    };

    /* ================= EFFECTS ================= */
    useEffect(() => {
        fetchRequisition(page);
    }, [page, tab]);

    useEffect(() => {
        setPage(1);
    }, [tab]);

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="mb-4">
                <Tabs value={tab} onChange={setTab} />
            </div>

            {/* TABLE */}
            <RequisitionTable
                data={data}
                loading={loading}
                onView={handleView}
            />

            {/* PAGINATION */}
            <div className="mt-4 flex justify-end">
                <Pagination meta={meta} onPageChange={setPage} />
            </div>

            {/* ================= DRAWER ================= */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Requisition Details"

                footer={
                    selected?.Status?.toLowerCase() === "pending" && (
                        <div className="flex gap-3 w-full">

                            {/* CHECK */}
                            <button
                                onClick={() =>
                                    checkAction.run(handleCheck)
                                }
                                disabled={checkAction.loading}
                                className={`flex-1 h-12 rounded-xl font-semibold
                                    ${checkAction.loading
                                        ? "bg-gray-200 text-gray-500"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {checkAction.loading ? "Checking..." : "Check"}
                            </button>

                            {/* REJECT */}
                            <button
                                onClick={() => setRejectOpen(true)}
                                className="flex-1 h-12 rounded-xl bg-red-600 text-white hover:bg-red-700"
                            >
                                Reject
                            </button>

                        </div>
                    )
                }
            >
                {selected && (
                    <div className="space-y-6">

                        {/* INFO */}
                        <div className="border rounded-2xl p-5 space-y-4">
                            <div className="flex justify-between items-start">

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {selected.Type}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {selected.EmployeeName}
                                    </p>
                                </div>

                                <StatusBadge status={selected.Status} size="sm" />

                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Total</p>
                                    <p className="font-semibold">
                                        {formatCurrency(selected.TotalAmount)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Date Filed</p>
                                    <p>{formatDate(selected.DateFiled)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Remarks</p>
                                <p className="text-sm text-gray-900">
                                    {selected.Remarks || "—"}
                                </p>
                            </div>

                            {/* ✅ OVERDUE DATE */}
                            {selected.overdue_progress?.overdue_start && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-gray-500">
                                        Overdue starts on
                                    </p>
                                    <p className="text-sm font-medium text-red-600">
                                        {formatDate(selected.overdue_progress.overdue_start)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* PARTICULARS */}
                        <div className="border rounded-2xl p-5">
                            <h4 className="font-semibold mb-2">Particulars</h4>

                            {selected.particulars?.length ? (
                                selected.particulars.map((p, i) => (
                                    <div key={i} className="flex justify-between text-sm py-1">
                                        <span>{p.Particulars}</span>
                                        <span>{formatCurrency(p.Amount)}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">
                                    No particulars available
                                </p>
                            )}
                        </div>

                        {/* ATTACHMENTS */}
                        {selected.attachments?.length > 0 ? (
                            <div className="space-y-2">
                                {selected.attachments.map((file, i) => (
                                    <div key={i} className="flex justify-between border p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Paperclip />
                                            <span>{file.FileName}</span>
                                        </div>

                                        <button
                                            onClick={() => window.open(file.file_url, "_blank")}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center">
                                No attachments uploaded
                            </p>
                        )}

                    </div>
                )}
            </Drawer>

            {/* ================= REJECT MODAL ================= */}
            <Modal
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                title="Reject Requisition"
                subtitle="Provide a reason"
                footer={
                    <>
                        <button
                            onClick={() => setRejectOpen(false)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() =>
                                rejectAction.run(handleReject)
                            }
                            disabled={rejectAction.loading}
                            className={`px-4 py-2 rounded-lg text-white
                                ${rejectAction.loading
                                    ? "bg-gray-400"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {rejectAction.loading ? "Submitting..." : "Submit"}
                        </button>
                    </>
                }
            >
                <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full border p-3 rounded-lg"
                    rows={4}
                    placeholder="Enter reason..."
                />
            </Modal>

        </div>
    );
}