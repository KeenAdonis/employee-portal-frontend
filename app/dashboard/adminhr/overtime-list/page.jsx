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
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import { useToast } from "@/components/ui/ToastProvider";
import { useActionState } from "@/lib/useActionState";
import api from "@/services/api";
import { DownloadCloud } from "lucide-react";

import { overtimeStatusOptions } from "@/config/options";

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
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [exportType, setExportType] = useState("detailed");
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const { showToast } = useToast();

    const preApproveAction = useActionState();
    const approveAction = useActionState();
    const rejectAction = useActionState();
    const downloadAction = useActionState();



    const fetchOvertime = async (pageNumber = 1) => {
        try {

            setLoading(true);

            let statusFilter = tab === "requests"
                ? "Pending,Pre-Approved"
                : "Approved,Rejected";

            const params = {
                page: pageNumber,
            };

            if (statusFilter) {
                params.status = statusFilter;
            }

            if (debouncedSearch.trim()) {
                params.search = debouncedSearch;
            }

            if (selectedStatus !== "all") {

                if (tab === "requests") {

                    // requests tab only allows pending/pre-approved
                    params.status = selectedStatus;

                } else {

                    // history tab only allows approved/rejected
                    params.status = selectedStatus;
                }
            }

            const res = await api.get(
                "/overtime",
                { params }
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
        } finally {

            setLoading(false);
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

        try {

            const statusFilter =
                tab === "requests"
                    ? "Pending,Pre-Approved"
                    : "Approved,Rejected";

            const res = await api.get(
                "/overtime/export",
                {
                    params: {
                        from: fromDate,
                        to: toDate,
                        type: exportType,
                        status: statusFilter,
                    },
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([res.data])
            );

            const a = document.createElement("a");

            a.href = url;

            a.download =
                exportType === "summary"
                    ? "overtime-summary.csv"
                    : "overtime-detailed.csv";

            document.body.appendChild(a);

            a.click();

            a.remove();

            window.URL.revokeObjectURL(url);

            showToast({
                title: "Success",
                message: "Overtime record downloaded successfully!",
                type: "success",
            });

            setDownloadOpen(false);

            resetDownloadState();

        } catch (err) {

            console.error("Download failed:", err);

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message
                    || "Failed to download overtime report.",
                type: "error",
            });

        }
    };

    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedSearch(search);

        }, 400);

        return () => clearTimeout(timer);

    }, [search]);

    useEffect(() => {
        if (!downloadOpen) {
            resetDownloadState();
        }
    }, [downloadOpen]);

    useEffect(() => {
        fetchOvertime(page);
    }, [
        page,
        tab,
        debouncedSearch,
        selectedStatus,
    ]);

    useEffect(() => {

        setPage(1);

    }, [debouncedSearch, selectedStatus, tab]);

    return (
        <div className="p-6">

            <div
                className="
                    flex
                    flex-col
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                    gap-4
                    mb-4
                "
            >

                {/* LEFT */}
                <Tabs
                    value={tab}
                    onChange={setTab}
                />

                {/* RIGHT */}
                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        gap-3
                    "
                >

                    {/* SEARCH */}
                    <div className="w-[280px]">

                        <Input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search overtime..."
                        />

                    </div>

                    {/* STATUS FILTER */}
                    <div className="w-[220px]">

                        <CustomSelect
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={overtimeStatusOptions}
                            placeholder="Filter Status"
                        />

                    </div>

                    {/* DOWNLOAD */}
                    <Button
                        onClick={() => setDownloadOpen(true)}
                        className="
                            bg-gradient-to-r
                            from-amber-400
                            to-amber-500
                            text-white
                            font-medium
                            px-4
                            py-2
                            rounded-lg
                            shadow-md
                            shadow-amber-500/30
                            hover:from-amber-300
                            hover:to-amber-400
                            hover:shadow-lg
                            hover:shadow-amber-500/40
                            active:scale-[0.98]
                            transition-all
                            duration-200
                            whitespace-nowrap
                        "
                    >
                        <DownloadCloud size={14} />
                        Download
                    </Button>

                </div>

            </div>

            <OvertimeTable
                data={data}
                loading={loading}
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
                                <>
                                    <button
                                        onClick={() => setRejectOpen(true)}
                                        className="
                                            flex-1
                                            py-3
                                            text-sm
                                            font-medium
                                            rounded-xl
                                            bg-red-600
                                            text-white
                                            hover:bg-red-700
                                        "
                                    >
                                        Reject
                                    </button>
                                                        
                                    <button
                                        onClick={() =>
                                            preApproveAction.run(() =>
                                                handleAction("pre-approve", selected.id)
                                            )
                                        }
                                        disabled={preApproveAction.loading}
                                        className={`flex-1 py-3 text-sm font-medium rounded-xl transition ${
                                            preApproveAction.loading
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                    >
                                        {preApproveAction.loading
                                            ? "Pre-Approving..."
                                            : "Pre-Approve"}
                                    </button>
                                </>
                            )}

                            {selected.Status === "Pre-Approved" && (
                                <>
                                    <button
                                        onClick={() => setRejectOpen(true)}
                                        disabled={rejectAction.loading}
                                        className="
                                            flex-1
                                            h-12
                                            rounded-xl
                                            text-sm
                                            font-semibold
                                            bg-red-600
                                            text-white
                                            hover:bg-red-700
                                            active:scale-[0.98]
                                            transition-all
                                        "
                                    >
                                        Reject
                                    </button>

                                    <button
                                        onClick={() =>
                                            approveAction.run(() =>
                                                handleAction("approve", selected.id)
                                            )
                                        }
                                        disabled={
                                            approveAction.loading ||
                                            selected?.accomplishments?.length === 0
                                        }
                                        className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all duration-200
                                            ${
                                                approveAction.loading ||
                                                selected?.accomplishments?.length === 0
                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
                                            }
                                        `}
                                    >
                                        {approveAction.loading
                                            ? "Approving..."
                                            : selected?.accomplishments?.length === 0
                                                ? "No Accomplishments"
                                                : "Approve"}
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
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-sm font-medium text-amber-800">
                                        No accomplishments submitted yet.
                                    </p>

                                    <p className="text-xs text-amber-600 mt-1">
                                        Overtime cannot be approved until accomplishments are submitted.
                                    </p>
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