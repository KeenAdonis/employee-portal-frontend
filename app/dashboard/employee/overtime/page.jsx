"use client";

import { useEffect, useState } from "react";

import OvertimeTable from "@/components/overtime/OvertimeTable";
import Drawer from "@/components/ui/Drawer";
import Pagination from "@/components/table/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";

import { formatDate, formatHours, formatTime } from "@/lib/format";
import { useToast } from "@/components/ui/ToastProvider";

import CreateOvertimeModal from "@/components/employee/CreateOvertimeModal";
import CreateAccomplishmentModal from "@/components/employee/CreateAccomplishmentModal";

import api from "@/services/api";

import { Plus } from "lucide-react";
import { overtimeStatusOptions } from "@/config/options";

export default function Page() {

    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);

    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [page, setPage] = useState(1);
    const [createOpen, setCreateOpen] = useState(false);
    const [accomplishmentOpen, setAccomplishmentOpen] = useState(false);
    const [selectedOvertime, setSelectedOvertime] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [debouncedSearch, setDebouncedSearch] =
        useState(search);

    /* =========================
       FETCH OVERTIME
    ========================= */
    const fetchOvertime = async (pageNumber = 1) => {

        try {

            setLoading(true);

            const params = {
                page: pageNumber,
            };

            if (debouncedSearch.trim()) {
                params.search = debouncedSearch;
            }

            if (selectedStatus !== "all") {
                params.status = selectedStatus;
            }

            const res = await api.get(
                "/overtime",
                { params }
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
                message: "Failed to fetch overtime requests",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /* =========================
       VIEW
    ========================= */
    const handleView = (item) => {

        setSelected(item);

        setOpenDrawer(true);
    };

    /* =========================
       EDIT ACCOMPLISHMENT
    ========================= */
    const handleEditAccomplishment = (item) => {

        setSelectedOvertime(item);

        setAccomplishmentOpen(true);
    };

    /* =========================
       PAGINATION
    ========================= */
    const handlePageChange = (newPage) => {

        setPage(newPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =========================
       EFFECTS
    ========================= */
    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedSearch(search);

        }, 400);

        return () => clearTimeout(timer);

    }, [search]);

    useEffect(() => {

        setPage(1);

    }, [debouncedSearch, selectedStatus]);

    useEffect(() => {

        fetchOvertime(page);

    }, [page, debouncedSearch, selectedStatus]);

    return (

        <div className="p-6 space-y-6">

            {/* =========================
                HEADER
            ========================= */}
            <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                {/* LEFT */}
                <div className="flex flex-col sm:flex-row gap-3">

                    {/* SEARCH */}
                    <div className="w-[280px]">

                        <Input
                            value={search}
                            onChange={(e) => {

                                setSearch(e.target.value);
                            }}
                            placeholder="Search overtime..."
                        />

                    </div>

                    {/* STATUS */}
                    <div className="w-[220px]">

                        <CustomSelect
                            value={selectedStatus}
                            onChange={(value) => {

                                setSelectedStatus(value);

                                setPage(1);
                            }}
                            options={overtimeStatusOptions}
                            placeholder="Filter Status"
                        />

                    </div>

                </div>

                {/* RIGHT */}
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="
                        bg-gradient-to-r
                        from-indigo-600 to-blue-600
                        hover:from-indigo-700 hover:to-blue-700
                        text-white
                        shadow-md
                    "
                >
                    <Plus size={16} />
                    New Overtime
                </Button>

            </div>

            {/* =========================
                CREATE OVERTIME MODAL
            ========================= */}
            <CreateOvertimeModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={() => fetchOvertime(page)}
            />

            {/* =========================
                ADD ACCOMPLISHMENT MODAL
            ========================= */}
            <CreateAccomplishmentModal
                open={accomplishmentOpen}
                overtime={selectedOvertime}

                onClose={() => {

                    setAccomplishmentOpen(false);

                    setSelectedOvertime(null);
                }}

                onSuccess={() => fetchOvertime(page)}
            />

            {/* =========================
                TABLE
            ========================= */}
            <OvertimeTable
                data={data}
                loading={loading}
                onView={handleView}
                onEditAccomplishment={handleEditAccomplishment}
            />

            {/* =========================
                PAGINATION
            ========================= */}
            <div className="flex justify-end">

                <Pagination
                    meta={meta}
                    onPageChange={handlePageChange}
                />

            </div>

            {/* =========================
                VIEW DRAWER
            ========================= */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Overtime Details"
            >

                {selected && (

                    <div className="space-y-6">

                        {/* =========================
                            OVERTIME CARD
                        ========================= */}
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

                                <StatusBadge
                                    status={selected.Status}
                                    size="sm"
                                />

                            </div>

                            {/* TIME GRID */}
                            <div className="grid grid-cols-2 gap-6 text-sm">

                                <div>

                                    <p className="text-gray-500 text-xs mb-1">
                                        Requested
                                    </p>

                                    <p className="font-medium text-gray-900">
                                        {formatTime(selected.TimeFrom)} – {formatTime(selected.TimeTo)}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-gray-500 text-xs mb-1">
                                        Total Hours
                                    </p>

                                    <p className="font-medium text-gray-900">
                                        {formatHours(selected.TotalHours)}
                                    </p>

                                </div>

                            </div>

                            {/* REASON */}
                            <div>

                                <p className="text-gray-500 text-xs mb-1">
                                    Reason
                                </p>

                                <p className="text-sm text-gray-900">
                                    {selected.OvertimeReason || "—"}
                                </p>

                            </div>

                            {/* REJECTION */}
                            {selected.Status === "Rejected" &&
                                selected.DisapprovalReason && (

                                    <div>

                                        <p className="text-red-500 text-xs mb-1">
                                            Rejection Reason
                                        </p>

                                        <p className="text-sm text-red-600">
                                            {selected.DisapprovalReason}
                                        </p>

                                    </div>
                                )}

                        </div>

                        {/* =========================
                            WORKFLOW STATUS GUIDE
                        ========================= */}
                        <div
                            className={`
                                rounded-2xl border p-4
                                ${selected.Status === "Pending"
                                    ? "border-gray-200 bg-gray-50"
                                    : selected.Status === "Pre-Approved"
                                        ? "border-blue-200 bg-blue-50"
                                        : selected.Status === "Approved"
                                            ? "border-green-200 bg-green-50"
                                            : "border-red-200 bg-red-50"
                                }
                            `}
                        >

                            {/* PENDING */}
                            {selected.Status === "Pending" && (

                                <div>

                                    <p className="text-sm font-semibold text-gray-800">
                                        Waiting for Pre-Approval
                                    </p>

                                    <p className="text-xs text-gray-600 mt-1">
                                        Accomplishments can be added once HR pre-approves this overtime request.
                                    </p>

                                </div>
                            )}

                            {/* PRE-APPROVED */}
                            {selected.Status === "Pre-Approved" && (

                                <div>

                                    <p className="text-sm font-semibold text-blue-800">
                                        Ready for Accomplishments
                                    </p>

                                    <p className="text-xs text-blue-700 mt-1">
                                        Your overtime has been pre-approved. You may now submit accomplishments using the pencil button in the table.
                                    </p>

                                </div>
                            )}

                            {/* APPROVED */}
                            {selected.Status === "Approved" && (

                                <div>

                                    <p className="text-sm font-semibold text-green-800">
                                        Overtime Approved
                                    </p>

                                    <p className="text-xs text-green-700 mt-1">
                                        This overtime request has been fully approved.
                                    </p>

                                </div>
                            )}

                            {/* REJECTED */}
                            {selected.Status === "Rejected" && (

                                <div>

                                    <p className="text-sm font-semibold text-red-800">
                                        Overtime Rejected
                                    </p>

                                    <p className="text-xs text-red-700 mt-1">
                                        This overtime request was rejected by HR.
                                    </p>

                                </div>
                            )}

                        </div>

                        {/* =========================
                            ACCOMPLISHMENTS
                        ========================= */}
                        {selected?.accomplishments?.length > 0 && (

                            <div className="space-y-3">

                                <div>

                                    <h3 className="text-sm font-semibold text-gray-800">
                                        Accomplishments
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Submitted overtime accomplishments.
                                    </p>

                                </div>

                                {selected.accomplishments.map((acc, index) => (

                                    <div
                                        key={index}
                                        className="
                                            border rounded-2xl
                                            px-4 py-4
                                            flex items-center justify-between
                                            bg-white
                                        "
                                    >

                                        <div>

                                            <div className="text-sm font-semibold text-gray-900">
                                                {acc.Task}
                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">
                                                {acc.Category}
                                            </div>

                                        </div>

                                        <StatusBadge
                                            status={acc.TaskStatus}
                                        />

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>
                )}

            </Drawer>

        </div>
    );
}