"use client";

import { useEffect, useState } from "react";
import LiquidationTable from "@/components/liquidation/LiquidationTable";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/table/Pagination";
import { useToast } from "@/components/ui/ToastProvider";
import CustomSelect from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import { useActionState } from "@/lib/useActionState";
import { formatCurrency } from "@/lib/format";
import api from "@/services/api";

import {
    liquidationStatusOptions
} from "@/config/options";

import {
    DownloadCloud
} from "lucide-react";

export default function AccountingLiquidationPage() {

    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);

    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(1);

    const [selected, setSelected] = useState(null);
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState("all");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);

    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const [loadingList, setLoadingList] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const { showToast } = useToast();

    const approveAction = useActionState();
    const rejectAction = useActionState();
    const downloadAction = useActionState();

    /* ================= FETCH ================= */
    const fetchLiquidations = async (pageNumber = 1) => {

        setLoadingList(true);

        try {

            const params = {
                page: pageNumber,
            };

            if (search.trim()) {
                params.search = search;
            }

            if (selectedStatus !== "all") {
                params.status = selectedStatus;
            }

            const res = await api.get(
                "/liquidations",
                { params }
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

    const handleDownload = async () => {

        if (!fromDate || !toDate) {

            showToast({
                title: "Warning",
                message:
                    "Please select date range",
                type: "warning",
            });

            return;
        }

        try {

            const response = await api.get(
                "/liquidations/export",
                {
                    params: {
                        from: fromDate,
                        to: toDate,

                        search,

                        status:
                            downloadStatus !== "all"
                                ? downloadStatus
                                : undefined,
                    },

                    responseType: "blob",
                }
            );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "liquidation-report.xlsx"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            setDownloadOpen(false);

            showToast({
                title: "Success",
                message:
                    "Liquidation report downloaded",
                type: "success",
            });

        } catch {

            showToast({
                title: "Error",
                message:
                    "Failed to export report",
                type: "error",
            });
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

            if (type === "check") {
                status = "Checked";
            }

            if (type === "approve") {
                status = "Approved";
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
    }, [page, search, selectedStatus]);

    return (
        <div className="p-6 space-y-4">

            {/* HEADER */}
            <div className="
                mb-4
                flex
                items-center
                justify-between
                gap-4
            ">

                {/* TITLE */}
                <h2 className="
                    text-2xl
                    font-semibold
                    text-gray-900
                ">
                    Liquidation Requests
                </h2>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">

                    {/* SEARCH */}
                    <div className="w-[280px]">

                        <Input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search liquidation..."
                        />

                    </div>

                    {/* STATUS FILTER */}
                    <div className="w-[220px]">

                        <CustomSelect
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={liquidationStatusOptions}
                            placeholder="Filter Status"
                        />

                    </div>

                    {/* DOWNLOAD */}
                    <Button
                        onClick={() =>
                            setDownloadOpen(true)
                        }

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
                                        handleAction("check")
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

                            {/* APPROVE BUTTON */}
                            <button
                                onClick={() =>
                                    approveAction.run(() =>
                                        handleAction("approve")
                                    )
                                }
                            
                                disabled={approveAction.loading}
                            
                                className={`
                                    flex-1
                                    h-12
                                    rounded-sm
                                    font-semibold
                                
                                    ${approveAction.loading
                                        ? "bg-gray-200 text-gray-500"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                    }
                                `}
                            >
                                {
                                    approveAction.loading
                                        ? "Processing..."
                                        : "Approve"
                                }
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

            <Drawer
                open={downloadOpen}

                onClose={() =>
                    setDownloadOpen(false)
                }

                title="Download Liquidation Report"

                footer={

                    <div className="w-full flex gap-3">

                        <button
                            onClick={() =>
                                setDownloadOpen(false)
                            }

                            className="
                                flex-1
                                py-3
                                border
                                rounded-xl
                            "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() =>
                                downloadAction.run(
                                    handleDownload
                                )
                            }

                            disabled={downloadAction.loading}

                            className={`
                                flex-1
                                py-3
                                rounded-xl
                                text-white
                                transition
                            
                                ${downloadAction.loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }
                            `}
                        >
                            {
                                downloadAction.loading
                                    ? "Downloading..."
                                    : "Download"
                            }
                        </button>

                    </div>
                }
            >

                <div className="border rounded-2xl p-5 space-y-4">

                    <div>
                        <h3 className="text-sm font-semibold">
                            Date Range
                        </h3>

                        <p className="text-xs text-gray-500">
                            Select report coverage
                        </p>
                    </div>

                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Status
                        </label>

                        <CustomSelect
                            value={downloadStatus}
                            onChange={setDownloadStatus}
                            options={
                                liquidationStatusOptions
                            }
                            placeholder="Select Status"
                        />

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">

                            <label className="text-xs text-gray-500">
                                From
                            </label>

                            <CustomDatePicker
                                value={fromDate}
                                onChange={setFromDate}
                            />

                        </div>

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