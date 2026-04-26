"use client";

import { useEffect, useState } from "react";
import OvertimeTable from "@/components/overtime/OvertimeTable";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import { formatDate, formatTime, formatHours } from "@/lib/format";
import Pagination from "@/components/table/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/ui/Tabs";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import { useToast } from "@/components/ui/ToastProvider";
import { useActionState } from "@/lib/useActionState";
import api from "@/services/api";
import { DownloadCloud } from "lucide-react";

export default function Page() {

    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState("requests");
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [exportType, setExportType] = useState("detailed");
    const { showToast } = useToast();

    const preApproveAction = useActionState();
    const approveAction = useActionState();
    const rejectAction = useActionState();
    const downloadAction = useActionState();


    const fetchOvertime = async (pageNumber = 1) => {
        try {
            let statusFilter = tab === "requests"
                ? "Pending,Pre-Approved"
                : "Approved,Rejected";

            const res = await api.get(
                `/overtime?page=${pageNumber}&status=${statusFilter}`
            );

            setData(res.data.data.data || []);
            setMeta(res.data.data);

        } catch (err) {
            console.error(err);
            showToast({
                title: "Error",
                message: "Failed to fetch overtime",
                type: "error",
            });
        }
    };

    const resetDownloadState = () => {
        setFromDate("");
        setToDate("");
        setExportType("detailed"); // or "summary" default mo
    };

    const handleAction = async (type, id) => {
        try {
            await api.post(`/overtime/${id}/${type}`);

            let message = "";
            if (type === "pre-approve") message = "Overtime request pre-approved";
            if (type === "approve") message = "Overtime request approved";

            showToast({
                title: "Success",
                message,
                type: "success",
            });

            fetchOvertime(page);
            setOpenDrawer(false);

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Action failed",
                type: "error",
            });
        }
    };

    const handleView = (item) => {
        setSelected(item);
        setOpenDrawer(true);
    };

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
            await api.post(`/overtime/${selected.id}/reject`, {
                reason: rejectReason
            });

            setRejectOpen(false);
            setRejectReason("");
            setOpenDrawer(false);
            fetchOvertime(page);

        } catch (err) {
            console.error(err);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDownload = async () => {
        if (!fromDate || !toDate) {
            showToast({
                title: "Warning",
                message: "Please select date range",
                type: "warning",
            });
            return;
        }

        if (fromDate > toDate) {
            showToast({
                title: "Warning",
                message: "Invalid date range",
                type: "warning",
            });
            return;
        }

        const statusFilter =
            tab === "requests"
                ? "Pending,Pre-Approved"
                : "Approved,Rejected";

        const params = new URLSearchParams({
            from: fromDate,
            to: toDate,
            type: exportType,
            status: statusFilter,
        });

        const url = `http://127.0.0.1:8000/api/overtime/export?${params.toString()}`;

        window.open(url, "_blank");

        showToast({
            title: "Success",
            message: "Overtime record downloaded successfully!",
            type: "success",
        });

        setDownloadOpen(false);
        resetDownloadState();
    };

    useEffect(() => {
        if (!downloadOpen) {
            resetDownloadState();
        }
    }, [downloadOpen]);

    useEffect(() => {
        fetchOvertime(page);
    }, [page, tab]);

    useEffect(() => {
        setPage(1);
    }, [tab]);

    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-4">

                <Tabs value={tab} onChange={setTab} />

                <Button
                    onClick={() => setDownloadOpen(true)}
                    className="
                            bg-gradient-to-r from-amber-400 to-amber-500
                            text-white
                            font-medium
                            px-4 py-2 rounded-lg
                            shadow-md shadow-amber-500/30
                            hover:from-amber-300 hover:to-amber-400
                            hover:shadow-lg hover:shadow-amber-500/40
                            active:scale-[0.98]
                            transition-all duration-200
                            "
                >
                    <DownloadCloud size={14} /> Download
                </Button>

            </div>

            <OvertimeTable
                data={data}
                onView={handleView}
            />

            <div className="mt-4 flex justify-end">
                <Pagination
                    meta={meta}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* DRAWER */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Overtime Details"

                footer={
                    selected && (
                        <div className="w-full flex gap-3">

                            {selected.Status === "Pending" && (
                                <button
                                    onClick={() =>
                                        preApproveAction.run(() =>
                                            handleAction("pre-approve", selected.id)
                                        )
                                    }
                                    disabled={preApproveAction.loading}
                                    className={`flex-1 py-3 text-sm font-medium rounded-xl transition ${preApproveAction.loading
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    {preApproveAction.loading ? "Pre-Approving..." : "Pre-Approve"}
                                </button>
                            )}

                            {selected.Status === "Pre-Approved" && (
                                <>
                                    <button
                                        onClick={() =>
                                            approveAction.run(() =>
                                                handleAction("approve", selected.id)
                                            )
                                        }
                                        disabled={approveAction.loading}
                                        className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all duration-200
                                            ${approveAction.loading
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
                                            }
                                        `}
                                    >
                                        {approveAction.loading ? "Approving..." : "Approve"}
                                    </button>

                                    {/* REJECT */}
                                    <button
                                        onClick={() => setRejectOpen(true)}
                                        className="flex-1 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-all duration-200"
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
                    <div className="space-y-6">

                        {/* OVERTIME CARD */}
                        <div className="border rounded-2xl p-5 space-y-4">

                            {/* HEADER */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {formatDate(selected.OvertimeDate)}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        After shift
                                    </p>
                                </div>

                                {/* STATUS BADGE */}
                                <StatusBadge status={selected.Status} size="sm" />
                            </div>

                            {/* TIME GRID */}
                            <div className="grid grid-cols-2 gap-6 text-sm">

                                {/* REQUESTED */}
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Requested</p>
                                    <p className="font-medium text-gray-900">
                                        {formatTime(selected.TimeFrom)} – {formatTime(selected.TimeTo)}
                                    </p>
                                </div>

                                {/* APPROVED */}
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Total Hours</p>
                                    <p className="font-medium text-gray-900">
                                        {formatHours(selected.TotalHours)}
                                    </p>
                                </div>

                            </div>

                            {/* REASON */}
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Reason</p>
                                <p className="text-sm text-gray-900">
                                    {selected.OvertimeReason || "—"}
                                </p>
                            </div>

                        </div>

                        {/* ACCOMPLISHMENTS (OPTIONAL / FUTURE) */}
                        <div className="space-y-3">

                            {selected?.accomplishments?.length > 0 ? (
                                selected.accomplishments.map((acc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between border rounded-xl px-4 py-3"
                                    >

                                        {/* LEFT: Task + Category */}
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {acc.Task}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {acc.Category}
                                            </div>
                                        </div>

                                        {/* RIGHT: Status */}
                                        <StatusBadge status={acc.TaskStatus} />

                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-400">
                                    No accomplishments yet
                                </div>
                            )}

                        </div>

                    </div>
                )}
            </Drawer>

            <Modal
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                title="Reject Overtime"
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

            <Drawer
                open={downloadOpen}
                onClose={() => {
                    setDownloadOpen(false);
                    resetDownloadState();
                }}
                title="Download Overtime Report"

                footer={
                    <div className="w-full flex gap-3">

                        <button
                            onClick={() => {
                                setDownloadOpen(false);
                                resetDownloadState();
                            }}
                            className="flex-1 py-3 text-sm border rounded-xl hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <Button
                            onClick={() => downloadAction.run(handleDownload)}
                            disabled={downloadAction.loading}
                            className={`flex-1 h-12 text-sm font-semibold rounded-xl transition-all duration-200
                                    ${downloadAction.loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium px-4 py-2 rounded-lg shadow-md shadow-amber-500/30 hover:from-amber-300 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/40 active:scale-[0.98] transition-all duration-200"}
                            `}
                        >
                            {downloadAction.loading ? "Downloading..." : "Download"}
                        </Button>

                    </div>
                }
            >
                <div className="space-y-6">

                    {/* DATE RANGE */}
                    <div className="border rounded-2xl p-5 space-y-4">

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Date Range
                            </h3>
                            <p className="text-xs text-gray-500">
                                Select coverage of the report
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            {/* FROM */}
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">From</label>
                                <CustomDatePicker
                                    value={fromDate}
                                    onChange={(val) => setFromDate(val)}
                                />
                            </div>

                            {/* TO */}
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">To</label>
                                <CustomDatePicker
                                    value={toDate}
                                    onChange={(val) => setToDate(val)}
                                />
                            </div>

                        </div>

                    </div>


                    {/* EXPORT TYPE */}
                    <div className="border rounded-2xl p-5 space-y-4">

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Report Type
                            </h3>
                            <p className="text-xs text-gray-500">
                                Choose how data will be exported
                            </p>
                        </div>

                        <div className="space-y-3">

                            {/* SUMMARY */}
                            <label
                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition
                                        ${exportType === "summary"
                                        ? "border-amber-400 bg-amber-50 shadow-sm"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Summary
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Total overtime hours per employee
                                    </div>
                                </div>

                                <input
                                    type="radio"
                                    checked={exportType === "summary"}
                                    onChange={() => setExportType("summary")}
                                    className="accent-amber-500 w-4 h-4"
                                />
                            </label>

                            {/* DETAILED */}
                            <label
                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition
                                        ${exportType === "detailed"
                                        ? "border-amber-400 bg-amber-50 shadow-sm"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Detailed
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Full overtime records
                                    </div>
                                </div>

                                <input
                                    type="radio"
                                    checked={exportType === "detailed"}
                                    onChange={() => setExportType("detailed")}
                                    className="accent-amber-500 w-4 h-4"
                                />
                            </label>

                        </div>

                    </div>

                </div>
            </Drawer>

        </div>
    );
}