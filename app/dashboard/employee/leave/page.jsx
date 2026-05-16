"use client";

import { useEffect, useState } from "react";

import LeaveTable from "@/components/leave/LeaveTable";
import CreateLeaveModal from "@/components/employee/CreateLeaveModal";

import Drawer from "@/components/ui/Drawer";
import Pagination from "@/components/table/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import Tabs from "@/components/ui/Tabs";

import { formatDate } from "@/lib/format";

import { useToast } from "@/components/ui/ToastProvider";

import api from "@/services/api";

import {
    Plus,
    Eye,
} from "lucide-react";

export default function Page() {

    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState("pending");
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    /* =========================
       FETCH LEAVE
    ========================= */
    const fetchLeave = async (
        pageNumber = 1
    ) => {

        try {

            setLoading(true);

            let statusFilter = "Pending";

            if (tab === "approved") {
                statusFilter = "Approved";
            }

            if (tab === "rejected") {
                statusFilter = "Rejected";
            }

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
                message:
                    "Failed to fetch leave requests.",
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
       PAGINATION
    ========================= */
    const handlePageChange = (
        newPage
    ) => {

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

        fetchLeave(page);

    }, [page, tab]);

    useEffect(() => {

        setPage(1);

    }, [tab]);

    return (

        <div className="p-6 space-y-6">

            {/* =========================
                HEADER
            ========================= */}
            <div className="
                flex flex-col gap-4
                lg:flex-row lg:items-center lg:justify-between
            ">

                {/* LEFT */}
                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Leave Requests
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track your leave applications.
                    </p>

                </div>

                {/* RIGHT */}
                <button
                    onClick={() =>
                        setOpenCreate(true)
                    }
                    className="
                        inline-flex items-center gap-2
                        bg-indigo-600 hover:bg-indigo-700
                        text-white text-sm font-medium
                        px-5 h-11 rounded-xl
                        transition
                    "
                >

                    <Plus className="w-4 h-4" />

                    New Leave

                </button>

            </div>

            {/* =========================
                TABS
            ========================= */}
            <div className="flex items-center justify-between">

                <Tabs
                    value={tab}
                    onChange={setTab}
                    options={[
                        {
                            label: "Pending",
                            value: "pending",
                        },
                        {
                            label: "Approved",
                            value: "approved",
                        },
                        {
                            label: "Rejected",
                            value: "rejected",
                        },
                    ]}
                />

            </div>

            {/* =========================
                TABLE
            ========================= */}
            <LeaveTable
                data={data}
                loading={loading}
                onView={handleView}
            />

            {/* =========================
                PAGINATION
            ========================= */}
            <div className="flex justify-end">

                <Pagination
                    meta={meta}
                    onPageChange={
                        handlePageChange
                    }
                />

            </div>

            {/* =========================
                VIEW DRAWER
            ========================= */}
            <Drawer
                open={openDrawer}
                onClose={() =>
                    setOpenDrawer(false)
                }
                title="Leave Details"
            >

                {selected && (

                    <div className="space-y-5">

                        {/* =========================
                            LEAVE DETAILS
                        ========================= */}
                        <div className="
                            border rounded-2xl
                            p-5 space-y-5
                        ">

                            {/* TOP */}
                            <div className="
                                flex items-start
                                justify-between
                                gap-4
                            ">

                                <div>

                                    <h3 className="
                                        text-lg font-semibold
                                        text-gray-900
                                    ">
                                        {selected.LeaveType}
                                    </h3>

                                    <p className="
                                        text-sm text-gray-500 mt-1
                                    ">
                                        {formatDate(
                                            selected.DateFrom
                                        )} - {formatDate(
                                            selected.DateTo
                                        )}
                                    </p>

                                </div>

                                <StatusBadge
                                    status={
                                        selected.Status
                                    }
                                />

                            </div>

                            {/* GRID */}
                            <div className="
                                grid grid-cols-2
                                gap-5 text-sm
                            ">

                                <div>

                                    <p className="
                                        text-xs text-gray-500 mb-1
                                    ">
                                        Total Days
                                    </p>

                                    <p className="
                                        font-semibold text-gray-900
                                    ">
                                        {selected.TotalDays}
                                    </p>

                                </div>

                                <div>

                                    <p className="
                                        text-xs text-gray-500 mb-1">
                                        Leave Duration
                                    </p>

                                    <p className="
                                        font-semibold text-gray-900
                                    ">
                                        {selected.LeaveDuration}
                                    </p>

                                </div>

                                <div>

                                    <p className="
                                        text-xs text-gray-500 mb-1
                                    ">
                                        Date Filed
                                    </p>

                                    <p className="
                                        font-semibold text-gray-900
                                    ">
                                        {formatDate(
                                            selected.DateFiled
                                        )}
                                    </p>

                                </div>

                                <div>

                                    <p className="
                                        text-xs text-gray-500 mb-1
                                    ">
                                        Request ID
                                    </p>

                                    <p className="
                                        font-semibold text-gray-900
                                    ">
                                        {selected.RequestId}
                                    </p>

                                </div>

                            </div>

                            {/* REASON */}
                            <div>

                                <p className="
                                    text-xs text-gray-500 mb-2
                                ">
                                    Reason
                                </p>

                                <div className="
                                    bg-gray-50 border
                                    rounded-xl p-4
                                    text-sm text-gray-700
                                    leading-relaxed
                                ">
                                    {selected.Reason || "—"}
                                </div>

                            </div>

                        </div>

                        {/* =========================
                            ATTACHMENT
                        ========================= */}
                        <div className="
                            border rounded-2xl
                            p-5 space-y-4
                        ">

                            <div className="
                                flex items-center justify-between
                            ">

                                <div>

                                    <h3 className="
                                        font-semibold text-gray-900
                                    ">
                                        Attachment
                                    </h3>

                                    <p className="
                                        text-xs text-gray-500 mt-1
                                    ">
                                        Uploaded supporting document
                                    </p>

                                </div>

                            </div>

                            {selected.Attachment ? (

                                <div className="
                                    flex items-center justify-between
                                    border rounded-xl
                                    bg-gray-50
                                    p-4
                                ">

                                    <div>

                                        <p className="
                                            text-sm font-medium text-gray-900
                                        ">
                                            Uploaded File
                                        </p>

                                        <p className="
                                            text-xs text-gray-500 mt-1
                                        ">
                                            Preview attachment
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            window.open(
                                                selected.Attachment,
                                                "_blank"
                                            )
                                        }
                                        className="
                                            w-10 h-10
                                            rounded-xl
                                            border bg-white
                                            hover:bg-indigo-50
                                            hover:text-indigo-600
                                            flex items-center justify-center
                                            transition
                                        "
                                    >

                                        <Eye className="w-4 h-4" />

                                    </button>

                                </div>

                            ) : (

                                <div className="
                                    border rounded-xl
                                    bg-gray-50
                                    p-4 text-sm text-gray-500
                                ">
                                    No attachment uploaded.
                                </div>

                            )}

                        </div>

                        {/* =========================
                            REJECTION REASON
                        ========================= */}
                        {selected.Status === "Rejected" &&
                            selected.DisapprovalReason && (

                                <div className="
                                    border border-red-200
                                    bg-red-50
                                    rounded-2xl
                                    p-5
                                ">

                                    <h3 className="
                                        font-semibold text-red-700
                                    ">
                                        Rejection Reason
                                    </h3>

                                    <p className="
                                        text-sm text-red-600
                                        mt-2 leading-relaxed
                                    ">
                                        {
                                            selected.DisapprovalReason
                                        }
                                    </p>

                                </div>
                            )
                        }

                    </div>
                )}

            </Drawer>

            {/* =========================
                CREATE MODAL
            ========================= */}
            <CreateLeaveModal
                open={openCreate}
                onClose={() =>
                    setOpenCreate(false)
                }
                onSuccess={() =>
                    fetchLeave(page)
                }
            />

        </div>
    );
}