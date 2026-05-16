"use client";

import { useEffect, useState } from "react";
import LeaveTable from "@/components/leave/LeaveTable";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/format";
import Pagination from "@/components/table/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import Tabs from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/ToastProvider";
import { useActionState } from "@/lib/useActionState";
import api from "@/services/api";

import { Eye, Download } from "lucide-react";

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

    /* ================= HANDLE BALANCES ================= */
    const getBalanceInfo = (selected) => {
        if (!selected) return null;

        const map = {
            "Vacation Leave": "VLBalance",
            "Sick Leave": "SLBalance",
            "Emergency Leave": "ELBalance",
            "Maternity Leave": "MLBalance",
            "Paternity Leave": "PLBalance",
            "Bereavement Leave": "BLBalance",
            "Birthday Leave": "BDLBalance",
        };

        const field = map[selected.LeaveType];

        if (!field) {
            return {
                balance: 0,
                requested: Number(selected.TotalDays || 0),
                isEnough: true, // for OL
                isOther: selected.LeaveType === "Other Leave",
            };
        }

        const balance = Number(selected?.credit?.[field] || 0);
        const requested = Number(selected.TotalDays || 0);

        return {
            balance,
            requested,
            isEnough: balance >= requested,
            isOther: false,
        };
    };

    const balanceInfo = getBalanceInfo(selected);

    /* ================= FETCH ================= */
    const fetchLeave = async (pageNumber = 1) => {

        try {

            setLoading(true);

            let statusFilter =
                tab === "requests"
                    ? "Pending"
                    : "Approved,Rejected";

            const res = await api.get(
                `/leave?page=${pageNumber}&status=${statusFilter}`
            );

            setData(
                res.data.data.data || []
            );

            setMeta(
                res.data.data
            );

        } catch (err) {

            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to fetch leave",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /* ================= ACTION ================= */
    const handleAction = async (type, id) => {
        try {
            await api.post(`/leave/${id}/${type}`);

            showToast({
                title: "Success",
                message: `Leave ${type} successfully`,
                type: "success",
            });

            fetchLeave(page);
            setOpenDrawer(false);

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Action failed",
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
    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            showToast({
                title: "Warning",
                message: "Reason is required.",
                type: "warning",
            });
            return;
        }

        try {
            await api.post(`/leave/${selected.id}/reject`, {
                reason: rejectReason
            });

            showToast({
                title: "Success",
                message: "Leave rejected",
                type: "success",
            });

            setRejectOpen(false);
            setRejectReason("");
            setOpenDrawer(false);
            fetchLeave(page);

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Reject failed",
                type: "error",
            });
        }
    };

    /* ================= PAGINATION ================= */
    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };



    /* ================= EFFECTS ================= */
    useEffect(() => {
        fetchLeave(page);
    }, [page, tab]);

    useEffect(() => {
        setPage(1);
    }, [tab]);

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <Tabs value={tab} onChange={setTab} />
            </div>

            {/* TABLE */}
            <LeaveTable
                data={data}
                loading={loading}
                onView={handleView}
            />

            {/* PAGINATION */}
            <div className="mt-4 flex justify-end">
                <Pagination
                    meta={meta}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* ================= DRAWER ================= */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Leave Details"

                footer={
                    selected && (
                        <div className="w-full flex gap-3">

                            {selected.Status === "Pending" && (
                                <>

                                    <button
                                        onClick={() =>
                                            approveAction.run(() =>
                                                handleAction("approve", selected.id)
                                            )
                                        }
                                        disabled={
                                            approveAction.loading ||
                                            (balanceInfo && !balanceInfo.isEnough)
                                        }
                                        className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all duration-200
                                            ${approveAction.loading
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
                                            }
                                        `}
                                    >
                                        {approveAction.loading
                                            ? "Approving..."
                                            : balanceInfo && !balanceInfo.isEnough
                                                ? "Insufficient Balance"
                                                : "Approve"}
                                    </button>

                                    <button
                                        onClick={() => setRejectOpen(true)}
                                        className="flex-1 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}

                        </div>
                    )
                }
            >
                {selected && (
                    <div className="space-y-5">

                        {/* LEAVE CARD */}
                        <div className="border rounded-2xl p-5 space-y-4">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {formatDate(selected.DateFrom)} - {formatDate(selected.DateTo)}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {selected.LeaveType}
                                    </p>
                                </div>

                                <StatusBadge status={selected.Status} />

                            </div>

                            <div className="grid grid-cols-2 gap-6 text-sm">

                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Total Days</p>
                                    <p className="font-medium text-gray-900">
                                        {selected.TotalDays}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Date Filed</p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(selected.DateFiled)}
                                    </p>
                                </div>

                            </div>

                            <div>
                                <p className="text-gray-500 text-xs mb-1">Reason</p>
                                <p className="text-sm text-gray-900">
                                    {selected.Reason || "—"}
                                </p>
                            </div>

                        </div>

                        {/* ================= ATTACHMENT ================= */}
                        <div className="border rounded-2xl p-5 space-y-4">
                            <h4 className="font-medium text-gray-900">
                                Attachment
                            </h4>

                            {selected.Attachment ? (
                                <div className="flex items-center justify-between bg-gray-50 border rounded-xl p-4">

                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Uploaded File
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Preview or download attachment
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() => window.open(selected.Attachment, "_blank")}
                                            className="p-2 rounded-lg hover:bg-gray-200 hover:text-indigo-600 transition"
                                            title="Preview"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>

                                    </div>

                                </div>
                            ) : (
                                <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-500">
                                    No Attachment
                                </div>
                            )}
                        </div>

                        {selected.Status === "Pending" && balanceInfo && (
                            <div className={`border rounded-2xl p-5 space-y-4 ${balanceInfo.isEnough
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                                }`}>

                                <h4 className="font-medium text-gray-900 flex justify-between">
                                    <span>{selected.LeaveType} Balance</span>
                                    {!balanceInfo.isEnough && (
                                        <span className="text-red-500 text-xs font-medium">
                                            Insufficient
                                        </span>
                                    )}
                                </h4>

                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Available</span>
                                        <span className="font-medium">
                                            {balanceInfo.balance} day(s)
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Requested</span>
                                        <span className="font-medium">
                                            {selected.TotalDays} day(s)
                                        </span>
                                    </div>
                                </div>

                                {!balanceInfo.isEnough && (
                                    <div className="text-xs text-red-600 font-medium bg-red-100 px-3 py-2 rounded-lg">
                                        Not enough balance. Only {balanceInfo.balance} day(s) available.
                                    </div>
                                )}

                            </div>
                        )}

                        {/* ================= OTHER LEAVE ================= */}
                        {balanceInfo?.isOther && (
                            <div className="border rounded-2xl p-5 bg-gray-50 text-sm text-gray-600">
                                Other Leave is unlimited but unpaid.
                            </div>
                        )}

                    </div>
                )}
            </Drawer>

            {/* ================= REJECT MODAL ================= */}
            <Modal
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                title="Reject Leave"
                subtitle="Provide a reason for rejecting this request"

                footer={
                    <>
                        <button
                            onClick={() => setRejectOpen(false)}
                            className="px-4 py-2 text-sm border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => rejectAction.run(handleRejectSubmit)}
                            disabled={rejectAction.loading}
                            className={`px-4 py-2 text-sm rounded-lg ${rejectAction.loading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-red-600 text-white"
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
                    rows={4}
                    className="w-full border rounded-lg p-3 text-sm"
                    placeholder="Enter reason..."
                />
            </Modal>

        </div>
    );
}


















