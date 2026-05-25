"use client";

import { useEffect, useState } from "react";
import DailyTimeRecordTable from "@/components/dtr/DailyTimeRecordTable";
import Drawer from "@/components/ui/Drawer";
import Pagination from "@/components/table/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import { useToast } from "@/components/ui/ToastProvider";

import {
    formatDate,
    formatTime,
    formatHours,
} from "@/lib/format";

import CreateDTRModal from "@/components/employee/CreateDTRModal";
import api from "@/services/api";

import {
    Plus,
} from "lucide-react";

export default function Page() {

    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [page, setPage] = useState(1);
    const [createOpen, setCreateOpen] =
        useState(false);
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] =
        useState("all");
    const [debouncedSearch, setDebouncedSearch] =
        useState(search);

    /*
    |--------------------------------------------------------------------------
    | STATUS OPTIONS
    |--------------------------------------------------------------------------
    */

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

    const fetchDTR = async (
        pageNumber = 1
    ) => {

        try {

            setLoading(true);

            const params = {
                page: pageNumber,
            };

            if (
                debouncedSearch.trim()
            ) {

                params.search =
                    debouncedSearch;
            }

            if (
                selectedStatus !==
                "all"
            ) {

                params.status =
                    selectedStatus;
            }

            const res =
                await api.get(
                    "/dtr",
                    { params }
                );

            const responseData =
                res.data.data;

            const records =
                responseData.data || [];

            setData(records);

            setMeta(responseData);


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

        const timer =
            setTimeout(() => {

                setDebouncedSearch(
                    search
                );

            }, 400);

        return () =>
            clearTimeout(timer);

    }, [search]);

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

    return (

        <div className="p-6 space-y-6">

            {/* HEADER */}

            <div
                className="
                    mb-4
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                "
            >

                {/* LEFT */}

                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
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
                            placeholder="Search DTR..."
                        />

                    </div>

                    {/* STATUS */}

                    <div className="w-[220px]">

                        <CustomSelect
                            value={
                                selectedStatus
                            }
                            onChange={(value) => {

                                setSelectedStatus(
                                    value
                                );

                                setPage(1);
                            }}
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
                        setCreateOpen(true)
                    }
                    className="
                        bg-gradient-to-r
                        from-indigo-600
                        to-blue-600
                        hover:from-indigo-700
                        hover:to-blue-700
                        text-white
                        shadow-md
                    "
                >

                    <Plus size={16} />

                    New DTR

                </Button>

            </div>

            {/* CREATE MODAL */}

            <CreateDTRModal
                open={createOpen}
                onClose={() =>
                    setCreateOpen(false)
                }
                onSuccess={() =>
                    fetchDTR(page)
                }
            />

            {/* TABLE */}

            <DailyTimeRecordTable
                data={data}
                loading={loading}
                onView={handleView}
            />

            {/* PAGINATION */}

            <div className="flex justify-end">

                <Pagination
                    meta={meta}
                    onPageChange={
                        handlePageChange
                    }
                />

            </div>

            {/* DRAWER */}

            <Drawer
                open={openDrawer}
                onClose={() =>
                    setOpenDrawer(false)
                }
                title="DTR Details"
            >

                {selected && (

                    <div className="space-y-6">

                        {/* DTR CARD */}

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
                                    gap-5
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

                            {/* REJECTION */}

                            {selected.status ===
                                "rejected" &&
                                selected.remarks && (

                                    <div>

                                        <p
                                            className="
                                                text-red-500
                                                text-xs
                                                mb-1
                                            "
                                        >
                                            Rejection Reason
                                        </p>

                                        <p
                                            className="
                                                text-sm
                                                text-red-600
                                            "
                                        >
                                            {
                                                selected.remarks
                                            }
                                        </p>

                                    </div>
                                )}

                        </div>

                        {/* WORKFLOW GUIDE */}

                        <div
                            className={`
                                rounded-2xl
                                border
                                p-4
                                ${selected.status === "pending"
                                    ? "border-amber-200 bg-amber-50"
                                    : selected.status === "approved"
                                        ? "border-green-200 bg-green-50"
                                        : "border-red-200 bg-red-50"
                                }
                            `}
                        >

                            {/* PENDING */}

                            {selected.status ===
                                "pending" && (

                                    <div>

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-amber-800
                                            "
                                        >
                                            Waiting for HR Approval
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-amber-700
                                                mt-1
                                            "
                                        >
                                            Your DTR is currently under review by HR.
                                        </p>

                                    </div>
                                )}

                            {/* APPROVED */}

                            {selected.status ===
                                "approved" && (

                                    <div>

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-green-800
                                            "
                                        >
                                            DTR Approved
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-green-700
                                                mt-1
                                            "
                                        >
                                            This DTR has been approved by HR.
                                        </p>

                                    </div>
                                )}

                            {/* REJECTED */}

                            {selected.status ===
                                "rejected" && (

                                    <div>

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-red-800
                                            "
                                        >
                                            DTR Rejected
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-red-700
                                                mt-1
                                            "
                                        >
                                            This DTR was rejected by HR.
                                        </p>

                                    </div>
                                )}

                        </div>

                    </div>
                )}

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