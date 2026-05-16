"use client";

import { useEffect, useState } from "react";
import LiquidationTable from "@/components/liquidation/LiquidationTable";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/table/Pagination";
import { useToast } from "@/components/ui/ToastProvider";
import { useActionState } from "@/lib/useActionState";
import { formatCurrency } from "@/lib/format";
import api from "@/services/api";

export default function AccountingLiquidationPage() {

    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);

    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const [loadingList, setLoadingList] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const { showToast } = useToast();

    const approveAction = useActionState();
    const rejectAction = useActionState();

    /* ================= FETCH ================= */
    const fetchLiquidations = async (pageNumber = 1) => {

        setLoadingList(true);

        try {

            const res = await api.get(
                `/liquidations?page=${pageNumber}`
            );

            // Backend na magfi-filter (Pending only for accounting)
            setData(res.data.data.data || []);
            setMeta(res.data.data);

        } catch (err) {

            showToast({
                title: "Error",
                message: "Failed to fetch liquidations",
                type: "error",
            });

        } finally {
            setLoadingList(false);
        }
    };

    /* ================= VIEW ================= */
    const handleView = async (item) => {

        setSelected(item);
        setOpenDrawer(true);
        setLoadingDetails(true);

        try {

            const res = await api.get(
                `/liquidations/${item.id}`
            );

            setSelected(res.data);

        } catch {

            showToast({
                title: "Error",
                message: "Failed to load details",
                type: "error",
            });

        } finally {
            setLoadingDetails(false);
        }
    };

    /* ================= ACTION ================= */
    const handleAction = async (type) => {

        try {

            let status = "Rejected";

            if (type === "approve") {
                status = "Checked"; // 🔥 Accounting role
            }

            await api.put(
                `/liquidations/${selected.id}/status`,
                {
                    status,
                    remarks: rejectReason
                }
            );

            showToast({
                title: "Success",
                message: `Liquidation ${status}`,
                type: "success",
            });

            setOpenDrawer(false);
            setRejectOpen(false);
            setRejectReason("");

            fetchLiquidations(page);

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Action failed",
                type: "error",
            });
        }
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
            handleAction("reject")
        );
    };

    /* ================= EFFECT ================= */
    useEffect(() => {
        fetchLiquidations(page);
    }, [page]);

    return (
        <div className="p-6 space-y-4">

            {/* ================= TABLE ================= */}
            <LiquidationTable
                data={data}
                loading={loadingList}
                onView={handleView}
            />

            {/* ================= PAGINATION ================= */}
            <div className="flex justify-end">
                <Pagination
                    meta={meta}
                    onPageChange={setPage}
                />
            </div>

            {/* ================= DRAWER ================= */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Liquidation Details"

                footer={
                    selected?.status === "Pending" && (
                        <div className="w-full flex gap-3">

                            {/* CHECK BUTTON */}
                            <button
                                onClick={() =>
                                    approveAction.run(() =>
                                        handleAction("approve")
                                    )
                                }
                                disabled={approveAction.loading}
                                className={`flex-1 h-12 rounded-sm font-semibold
                                    ${approveAction.loading
                                        ? "bg-gray-200 text-gray-500"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {approveAction.loading
                                    ? "Processing..."
                                    : "Check"}
                            </button>

                            {/* REJECT BUTTON */}
                            <button
                                onClick={() => setRejectOpen(true)}
                                className="flex-1 h-12 rounded-sm font-semibold bg-red-600 text-white hover:bg-red-700"
                            >
                                Reject
                            </button>

                        </div>
                    )
                }
            >

                {loadingDetails ? (

                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>

                ) : selected && (

                    <div className="space-y-6">

                        {/* HEADER */}
                        <div className="border rounded-2xl p-5 space-y-2">
                            <p>
                                <strong>Reference:</strong>{" "}
                                {selected.request_id}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selected.status}
                            </p>
                        </div>

                        {/* PARTICULARS */}
                        <div className="border rounded-2xl p-5">
                            <h4 className="text-sm font-semibold mb-3">
                                Particulars
                            </h4>

                            <div className="overflow-hidden border rounded-xl">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-500">
                                        <tr>
                                            <th className="text-left px-4 py-2">Particular</th>
                                            <th className="text-left px-4 py-2">OR No</th>
                                            <th className="text-right px-4 py-2">Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selected.particulars?.length ? (
                                            selected.particulars.map((p, i) => (
                                                <tr key={i} className="border-t">
                                                    <td className="px-4 py-3">{p.particulars}</td>
                                                    <td className="px-4 py-3">{p.or_no || "-"}</td>
                                                    <td className="px-4 py-3 text-right font-medium">
                                                        {formatCurrency(p.amount)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-gray-400">
                                                    No particulars
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="border rounded-2xl p-5 text-sm space-y-2">
                            <p>
                                Cash Advance:{" "}
                                <strong>{formatCurrency(selected.cash_advance)}</strong>
                            </p>

                            <p>
                                Total Expenses:{" "}
                                <strong>{formatCurrency(selected.total_expenses)}</strong>
                            </p>

                            <p>
                                Returned:{" "}
                                <strong>{formatCurrency(selected.amount_returned)}</strong>
                            </p>

                            <p>
                                Reimbursement:{" "}
                                <strong>{formatCurrency(selected.amount_reimbursement)}</strong>
                            </p>
                        </div>

                    </div>

                )}

            </Drawer>

            {/* ================= REJECT MODAL ================= */}
            <Modal
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                title="Reject Liquidation"
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