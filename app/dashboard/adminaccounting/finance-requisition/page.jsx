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
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import CustomSelect from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import api from "@/services/api";
import { formatDate, formatCurrency } from "@/lib/format";

import { requisitionTypeOptions } from "@/config/options";

import { Eye, Paperclip, DownloadCloud } from "lucide-react";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [meta, setMeta] = useState(null);

    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] =
        useState("all");
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState("requests");

    const [downloadOpen, setDownloadOpen] =
        useState(false);

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [downloadType, setDownloadType] =
        useState("all");

    const { showToast } = useToast();

    const checkAction = useActionState();
    const approveAction = useActionState();
    const rejectAction = useActionState();
    const downloadAction = useActionState();

    /* ================= FETCH ================= */
    const fetchRequisition = async (pageNumber = 1) => {

        try {

            setLoading(true);

            const statusFilter =
                tab === "requests"
                    ? "Pending"
                    : "Checked,Approved,Liquidated,Rejected";

            const params = {
                page: pageNumber,
                status: statusFilter,
            };

            if (search.trim()) {
                params.search = search;
            }

            if (selectedType !== "all") {
                params.type = selectedType;
            }

            const res = await api.get(
                "/requisition",
                { params }
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

    const handleDownload = async () => {

        if (!fromDate || !toDate) {

            showToast({
                title: "Warning",
                message: "Please select date range",
                type: "warning",
            });

            return;
        }

        try {

            const statusFilter =
                "Approved,Liquidated";

            const response = await api.get(
                "/requisition/export",
                {
                    params: {
                        from: fromDate,
                        to: toDate,
                        type: downloadType,
                        status: statusFilter,
                        search,
                    },

                    responseType: "blob",
                }
            );

            /* =========================
               CREATE DOWNLOAD
            ========================= */

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "requisition-report.xlsx"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            showToast({
                title: "Success",
                message:
                    "Requisition report downloaded",
                type: "success",
            });

            setDownloadOpen(false);

            resetDownloadState();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    "Failed to export requisition report",
                type: "error",
            });
        }
    };

    const resetDownloadState = () => {
        setFromDate("");
        setToDate("");
        setDownloadType("all");
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

    const handleApprove = async () => {
        try {
            await api.post(`/requisition/${selected.id}/status`, {
                status: "Approved",
            });

            showToast({
                title: "Success",
                message: "Requisition approved",
                type: "success",
            });

            setOpenDrawer(false);
            fetchRequisition(page);

        } catch (err) {
            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Failed to approve requisition",
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
    }, [page, tab, search, selectedType]);

    useEffect(() => {
        setPage(1);
    }, [tab]);

    useEffect(() => {
        if (!downloadOpen) {
            resetDownloadState();
        }
    }, [downloadOpen]);

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className=" mb-4 flex items-center justify-between gap-4">
            
                {/* LEFT */}
                <Tabs
                    value={tab}
                    onChange={setTab}
                />

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* SEARCH */}
                    <div className="w-[280px]">

                        <Input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search requisition..."
                        />

                    </div>
                        
                    {/* TYPE FILTER */}
                    <div className="w-[240px]">
                        
                        <CustomSelect
                            value={selectedType}
                            onChange={setSelectedType}
                            options={requisitionTypeOptions}
                            placeholder="Filter Type"
                        />

                    </div>
                        
                    {/* DOWNLOAD */}
                    <Button
                        onClick={() => setDownloadOpen(true)}
                        className="
                            bg-green-600
                            text-white
                            px-4
                            py-2
                            rounded-xl
                            text-sm
                            hover:bg-green-700
                            transition
                            flex
                            items-center
                            gap-2
                            whitespace-nowrap
                        "
                    >
                        <DownloadCloud size={14} />
                        <span>Download</span>
                    </Button>
                        
                </div>
                        
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

                            {/* APPROVE */}
                            <button
                                onClick={() =>
                                    approveAction.run(handleApprove)
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

            <Drawer
                open={downloadOpen}
                onClose={() => {
                    setDownloadOpen(false);
                    resetDownloadState();
                }}
                title="Download Requisition Report"

                footer={
                    <div className="w-full flex gap-3">

                        <button
                            onClick={() => {
                                setDownloadOpen(false);
                                resetDownloadState();
                            }}
                            className="
                    flex-1
                    py-3
                    text-sm
                    border
                    rounded-xl
                    hover:bg-gray-50
                "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() =>
                                downloadAction.run(handleDownload)
                            }
                            disabled={downloadAction.loading}
                            className={`
                    flex-1
                    h-12
                    rounded-xl
                    text-sm
                    font-semibold
                    transition-all
                    duration-200

                    ${downloadAction.loading
                                    ? "bg-gray-300 text-gray-500"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }
                `}
                        >
                            {downloadAction.loading
                                ? "Downloading..."
                                : "Download"}
                        </button>

                    </div>
                }
            >
                <div className="space-y-6">

                    {/* TYPE */}
                    <div className="border rounded-2xl p-5 space-y-4">

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Requisition Type
                            </h3>

                            <p className="text-xs text-gray-500">
                                Select requisition type to export
                            </p>
                        </div>

                        <CustomSelect
                            value={downloadType}
                            onChange={setDownloadType}
                            options={requisitionTypeOptions}
                            placeholder="Select Type"
                        />

                    </div>

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

                                <label className="text-xs text-gray-500">
                                    From
                                </label>

                                <CustomDatePicker
                                    value={fromDate}
                                    onChange={setFromDate}
                                />

                            </div>

                            {/* TO */}
                            <div className="space-y-1">

                                <label className="text-xs text-gray-500">
                                    To
                                </label>

                                <CustomDatePicker
                                    value={toDate}
                                    onChange={setToDate}
                                />

                            </div>

                        </div>

                    </div>

                </div>
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