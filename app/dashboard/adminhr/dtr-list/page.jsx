"use client";

import { useEffect, useState } from "react";

import DailyTimeRecordTable from "@/components/dtr/DailyTimeRecordTable";

import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";

import Pagination from "@/components/table/Pagination";

import StatusBadge from "@/components/ui/StatusBadge";

import { Button } from "@/components/ui/button";

import Input from "@/components/ui/Input";

import CustomSelect from "@/components/ui/CustomSelect";

import CustomDatePicker from "@/components/ui/CustomDatePicker";

import { useToast } from "@/components/ui/ToastProvider";

import { useActionState } from "@/lib/useActionState";


import {
    formatDate,
    formatTime,
    formatHours,
} from "@/lib/format";

import api from "@/services/api";

import {
    DownloadCloud,
} from "lucide-react";

export default function Page() {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");


    const { showToast } = useToast();
    const approveAction = useActionState();
    const rejectAction = useActionState();
    const downloadAction = useActionState();

    const statusOptions = [
        {
            value: "all",
            label: "All Status",
        },
        {
            value: "pending",
            label: "Pending",
        },
        {
            value: "approved",
            label: "Approved",
        },
        {
            value: "rejected",
            label: "Rejected",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | FETCH DTR
    |--------------------------------------------------------------------------
    */

    const fetchDTR = async (pageNumber = 1) => {

        try {

            setLoading(true);

            const params = {
                page: pageNumber,
            };

            if (debouncedSearch.trim()) {

                params.search = debouncedSearch;
            }

            if (
                selectedStatus !== "all"
            ) {

                params.status = selectedStatus;
            }

            const res = await api.get(
                "/dtr",
                { params }
            );

            const responseData =
                res.data.data;

            setData(
                responseData.data || []
            );

            setMeta(responseData);

            /*
            |--------------------------------------------------------------------------
            | SUMMARY
            |--------------------------------------------------------------------------
            */

            const records =
                responseData.data || [];

            setSummary({

                totalRecords:
                    records.length,

                pending:
                    records.filter(
                        (x) =>
                            x.status ===
                            "pending"
                    ).length,

                approved:
                    records.filter(
                        (x) =>
                            x.status ===
                            "approved"
                    ).length,

                totalOtHours:
                    records.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.overtime_hours || 0
                            ),
                        0
                    ),
            });

        } catch (err) {

            console.error(err);

            showToast({
                title: "Error",
                message:
                    "Failed to fetch DTR records",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | VIEW
    |--------------------------------------------------------------------------
    */

    const handleView = (item) => {

        setSelected(item);

        setOpenDrawer(true);
    };

    /*
    |--------------------------------------------------------------------------
    | APPROVE
    |--------------------------------------------------------------------------
    */

    const handleApprove = async (item) => {

        try {

            await api.put(
                `/dtr/${item.id}/approve`
            );

            showToast({
                title: "Success",
                message:
                    "DTR approved successfully.",
                type: "success",
            });

            fetchDTR(page);

            setOpenDrawer(false);

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Approval failed",
                type: "error",
            });
        }
    };

    /*
    |--------------------------------------------------------------------------
    | REJECT
    |--------------------------------------------------------------------------
    */

    const handleRejectSubmit = async () => {

        if (!rejectReason.trim()) {

            showToast({
                title: "Warning",
                message:
                    "Reason is required.",
                type: "warning",
            });

            return;
        }

        try {

            await api.put(
                `/dtr/${selected.id}/reject`,
                {
                    remarks: rejectReason,
                }
            );

            showToast({
                title: "Success",
                message:
                    "DTR rejected successfully.",
                type: "success",
            });

            setRejectOpen(false);

            setRejectReason("");

            setOpenDrawer(false);

            fetchDTR(page);

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Reject failed",
                type: "error",
            });
        }
    };

    /*
    |--------------------------------------------------------------------------
    | EXPORT
    |--------------------------------------------------------------------------
    */

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

        if (fromDate > toDate) {

            showToast({
                title: "Warning",
                message:
                    "Invalid date range",
                type: "warning",
            });

            return;
        }

        const params =
            new URLSearchParams({

                from: fromDate,

                to: toDate,

                status: selectedStatus,
            });

        const url =
            `${process.env.NEXT_PUBLIC_API_URL}/dtr/export?${params.toString()}`;

        window.open(url, "_blank");

        showToast({
            title: "Success",
            message:
                "DTR exported successfully.",
            type: "success",
        });

        setDownloadOpen(false);
    };

    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    const handlePageChange = (
        newPage
    ) => {

        setPage(newPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
    |--------------------------------------------------------------------------
    | SEARCH DEBOUNCE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedSearch(
                search
            );

        }, 400);

        return () =>
            clearTimeout(timer);

    }, [search]);

    /*
    |--------------------------------------------------------------------------
    | FETCH
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchDTR(page);

    }, [
        page,
        debouncedSearch,
        selectedStatus,
    ]);

    /*
    |--------------------------------------------------------------------------
    | RESET PAGE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setPage(1);

    }, [
        debouncedSearch,
        selectedStatus,
    ]);

    return (

        <div className="p-6 space-y-6">



            {/* FILTERS */}

            <div
                className="
                    flex
                    flex-col
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                    gap-4
                "
            >

                {/* LEFT */}

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
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search employee..."
                        />

                    </div>

                    {/* STATUS */}

                    <div className="w-[220px]">

                        <CustomSelect
                            value={
                                selectedStatus
                            }
                            onChange={
                                setSelectedStatus
                            }
                            options={
                                statusOptions
                            }
                            placeholder="Filter Status"
                        />

                    </div>

                </div>

                {/* RIGHT */}

                <Button
                    onClick={() =>
                        setDownloadOpen(true)
                    }
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

            {/* TABLE */}

            <DailyTimeRecordTable
                data={data}
                loading={loading}
                onView={handleView}
                onApprove={handleApprove}
                onReject={(item) => {

                    setSelected(item);

                    setRejectOpen(true);
                }}
            />

            {/* PAGINATION */}

            <div className="mt-4 flex justify-end">

                <Pagination
                    meta={meta}
                    onPageChange={
                        handlePageChange
                    }
                />

            </div>

            {/* DETAILS DRAWER */}

            <Drawer
                open={openDrawer}
                onClose={() =>
                    setOpenDrawer(false)
                }
                title="DTR Details"

                footer={
                    selected?.status ===
                    "pending" && (

                        <div className="w-full flex gap-3">

                            {/* APPROVE */}

                            <Button
                                onClick={() =>
                                    approveAction.run(
                                        () =>
                                            handleApprove(
                                                selected
                                            )
                                    )
                                }
                                disabled={
                                    approveAction.loading
                                }
                                className="
                                    flex-1
                                    h-12
                                    rounded-xl
                                    bg-emerald-600
                                    hover:bg-emerald-700
                                    text-white
                                "
                            >

                                {approveAction.loading
                                    ? "Approving..."
                                    : "Approve"}

                            </Button>

                            {/* REJECT */}

                            <Button
                                onClick={() =>
                                    setRejectOpen(
                                        true
                                    )
                                }
                                className="
                                    flex-1
                                    h-12
                                    rounded-xl
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                "
                            >

                                Reject

                            </Button>

                        </div>
                    )
                }
            >

                {selected && (

                    <div className="space-y-6">

                        {/* CARD */}

                        <div
                            className="
                                border
                                rounded-2xl
                                p-5
                                space-y-5
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>

                                    <h3
                                        className="
                                            font-semibold
                                            text-gray-900
                                        "
                                    >
                                        {formatDate(
                                            selected.date
                                        )}
                                    </h3>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                        "
                                    >
                                        Daily Time Record
                                    </p>

                                </div>

                                <StatusBadge
                                    status={
                                        selected.status
                                    }
                                    size="sm"
                                />

                            </div>

                            {/* GRID */}

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-4
                                    text-sm
                                "
                            >

                                <InfoItem
                                    label="Time In"
                                    value={formatTime(
                                        selected.time_in
                                    )}
                                />

                                <InfoItem
                                    label="Break Out"
                                    value={formatTime(
                                        selected.break_out
                                    )}
                                />

                                <InfoItem
                                    label="Break In"
                                    value={formatTime(
                                        selected.break_in
                                    )}
                                />

                                <InfoItem
                                    label="Time Out"
                                    value={formatTime(
                                        selected.time_out
                                    )}
                                />

                                <InfoItem
                                    label="Work Hours"
                                    value={formatHours(
                                        selected.total_work_hours
                                    )}
                                />

                                <InfoItem
                                    label="Break Hours"
                                    value={formatHours(
                                        selected.total_break_hours
                                    )}
                                />

                                <InfoItem
                                    label="OT Hours"
                                    value={formatHours(
                                        selected.overtime_hours
                                    )}
                                />

                                <InfoItem
                                    label="Late Minutes"
                                    value={`${selected.late_minutes || 0} mins`}
                                />

                            </div>

                            {/* REMARKS */}

                            <div>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mb-1
                                    "
                                >
                                    Remarks
                                </p>

                                <p
                                    className="
                                        text-sm
                                        text-gray-900
                                    "
                                >
                                    {selected.remarks ||
                                        "—"}
                                </p>

                            </div>

                        </div>

                    </div>
                )}

            </Drawer>

            {/* REJECT MODAL */}

            <Modal
                open={rejectOpen}
                onClose={() =>
                    setRejectOpen(false)
                }
                title="Reject DTR"
                subtitle="Provide a reason for rejection"

                footer={
                    <>

                        <button
                            onClick={() =>
                                setRejectOpen(false)
                            }
                            className="
                                px-4
                                py-2
                                text-sm
                                border
                                rounded-lg
                            "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() =>
                                rejectAction.run(
                                    handleRejectSubmit
                                )
                            }
                            disabled={
                                rejectAction.loading
                            }
                            className={`
                                px-4
                                py-2
                                text-sm
                                rounded-lg
                                ${rejectAction.loading
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-red-600 text-white"
                                }
                            `}
                        >

                            {rejectAction.loading
                                ? "Submitting..."
                                : "Submit"}

                        </button>

                    </>
                }
            >

                <textarea
                    value={rejectReason}
                    onChange={(e) =>
                        setRejectReason(
                            e.target.value
                        )
                    }
                    rows={4}
                    className="
                        w-full
                        border
                        rounded-lg
                        p-3
                        text-sm
                    "
                    placeholder="Enter reason..."
                />

            </Modal>

            {/* DOWNLOAD DRAWER */}

            <Drawer
                open={downloadOpen}
                onClose={() =>
                    setDownloadOpen(false)
                }
                title="Download DTR Report"

                footer={
                    <div className="w-full flex gap-3">

                        <button
                            onClick={() =>
                                setDownloadOpen(
                                    false
                                )
                            }
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

                        <Button
                            onClick={() =>
                                downloadAction.run(
                                    handleDownload
                                )
                            }
                            disabled={
                                downloadAction.loading
                            }
                            className="
                                flex-1
                                h-12
                                rounded-xl
                                bg-gradient-to-r
                                from-amber-400
                                to-amber-500
                                text-white
                            "
                        >

                            {downloadAction.loading
                                ? "Downloading..."
                                : "Download"}

                        </Button>

                    </div>
                }
            >

                <div className="space-y-6">

                    {/* DATE RANGE */}

                    <div
                        className="
                            border
                            rounded-2xl
                            p-5
                            space-y-4
                        "
                    >

                        <div>

                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Date Range
                            </h3>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Select report coverage
                            </p>

                        </div>

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                            "
                        >

                            <div>

                                <label
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    From
                                </label>

                                <CustomDatePicker
                                    value={
                                        fromDate
                                    }
                                    onChange={
                                        setFromDate
                                    }
                                />

                            </div>

                            <div>

                                <label
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    To
                                </label>

                                <CustomDatePicker
                                    value={
                                        toDate
                                    }
                                    onChange={
                                        setToDate
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </Drawer>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| INFO ITEM
|--------------------------------------------------------------------------
*/

function InfoItem({
    label,
    value,
}) {

    return (

        <div>

            <p
                className="
                    text-xs
                    text-gray-500
                    mb-1
                "
            >
                {label}
            </p>

            <p
                className="
                    font-medium
                    text-gray-900
                "
            >
                {value || "—"}
            </p>

        </div>
    );
}