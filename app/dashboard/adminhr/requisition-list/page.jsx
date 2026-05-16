"use client";

import { useEffect, useState } from "react";
import RequisitionTable from "@/components/requisition/RequisitionTable";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import { formatDate, formatCurrency } from "@/lib/format";
import Pagination from "@/components/table/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import Tabs from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/ToastProvider";
import { useActionState } from "@/lib/useActionState";
import api from "@/services/api";

import { Eye, Download, Paperclip } from "lucide-react";

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

    const approveAction = useActionState();
    const rejectAction = useActionState();

    /* ================= FETCH ================= */
    const fetchRequisition = async (pageNumber = 1) => {

        try {

            setLoading(true);

            let statusFilter =
                tab === "requests"
                    ? "Checked"
                    : "Approved,Liquidated,Rejected";

            const res = await api.get(
                `/requisition?page=${pageNumber}&status=${statusFilter}`
            );

            setData(res.data.data.data || []);

            setMeta(res.data.data);

        } catch (err) {

            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to fetch requisitions",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /* ================= ACTION ================= */
    const handleAction = async (type, id) => {
        try {
            const status =
                type === "approve"
                    ? (selected.Status === "Pending" ? "Checked" : "Approved")
                    : "Rejected";

            await api.post(`/requisition/${id}/status`, {
                status,
                reason: rejectReason
            });

            showToast({
                title: "Success",
                message: `Requisition ${type} successfully`,
                type: "success",
            });

            setOpenDrawer(false);
            setRejectOpen(false);
            setRejectReason("");

            fetchRequisition(page);

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Request failed",
                type: "error",
            });
        }
    };

    /* ================= VIEW ================= */
    const handleView = (item) => {
        setSelected(item);
        setOpenDrawer(true);
    };

    /* ================= REJECT ================= */
    const handleRejectSubmit = () => {
        if (!rejectReason.trim()) {
            showToast({
                title: "Warning",
                message: "Reason is required.",
                type: "warning",
            });
            return;
        }

        rejectAction.run(() =>
            handleAction("reject", selected.id)
        );
    };

    /* ================= EFFECTS ================= */
    useEffect(() => {
        const testUser = async () => {
            const res = await api.get("/me");
            console.log("USER:", res.data);
        };

        testUser();
    }, []);

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
                    selected?.Status === "Checked" && (
                        <div className="w-full flex gap-3">
                            <button
                                onClick={() =>
                                    approveAction.run(() =>
                                        handleAction("approve", selected.id)
                                    )
                                }
                                disabled={approveAction.loading}
                                className={`flex-1 h-12 rounded-xl font-semibold
                                    ${approveAction.loading
                                        ? "bg-gray-200 text-gray-500"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                            >
                                {approveAction.loading ? "Approving..." : "Approve"}
                            </button>

                            <button
                                onClick={() => setRejectOpen(true)}
                                className="flex-1 h-12 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                    )
                }
            >
                {selected && (
                    <div className="space-y-6">

                        {/* ================= MAIN CARD ================= */}
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

                            <div className="grid grid-cols-2 gap-6 text-sm">

                                <div>
                                    <p className="text-gray-500 text-xs">Total</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(selected.TotalAmount)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Date Filed</p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(selected.DateFiled)}
                                    </p>
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



                        {/* ================= PARTICULARS ================= */}
                        <div className="border rounded-2xl p-5 space-y-3">

                            <h4 className="text-sm font-semibold">Particulars</h4>

                            {selected.particulars?.length ? (
                                <div className="overflow-hidden border rounded-xl">

                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-xs text-gray-500">
                                            <tr>
                                                <th className="text-left px-4 py-2">Particular</th>
                                                <th className="text-right px-4 py-2">Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {selected.particulars.map((p, i) => (
                                                <tr key={i} className="border-t">
                                                    <td className="px-4 py-3">{p.Particulars}</td>
                                                    <td className="px-4 py-3 text-right font-medium">
                                                        {formatCurrency(p.Amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">
                                    No particulars available
                                </p>
                            )}

                        </div>

                        {/* ================= ATTACHMENT ================= */}
                        {selected.attachments?.length ? (
                            <div className="space-y-2">

                                {selected.attachments.map((file, index) => (
                                    <div className="flex items-center justify-between border rounded-xl p-4 hover:shadow-sm transition">

                                        {/* LEFT */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
                                                <Paperclip />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {file.FileName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {file.FileType}
                                                </p>
                                            </div>
                                        </div>

                                        {/* RIGHT */}
                                        <div className="flex gap-2">

                                            {/* PREVIEW */}
                                            <button
                                                onClick={() => window.open(file.file_url, "_blank")}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                No attachments uploaded
                            </div>
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
                            onClick={handleRejectSubmit}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                            Submit
                        </button>
                    </>
                }
            >
                <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    rows={4}
                    placeholder="Enter reason..."
                />
            </Modal>

        </div>
    );
}