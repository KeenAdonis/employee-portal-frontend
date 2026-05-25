"use client";

import DataTable from "@/components/table/DataTable";
import { Eye } from "lucide-react";

import {
    formatCurrency,
    formatDate,
} from "@/lib/format";

import StatusBadge from "@/components/ui/StatusBadge";

import { getInitials } from "@/lib/utils";
import { getStorageUrl } from "@/lib/storage";



export default function RequisitionTable({
    data = [],
    onView,
    loading = false,
}) {



    const columns = [
        "Date Filed",
        "Employee",
        "Type",
        "Total",
        "Overdue",
        "Status",
        "Actions",
    ];

    return (
        <div className="space-y-4">

            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                emptyTitle="No requisitions found"
                emptyDescription="There are currently no requisition records available."

                renderRow={(item) => {
                    const profileImage = getStorageUrl(item.employee?.ProfileImage);

                    return (

                        <tr
                            key={item.id}
                            className="
                        hover:bg-gray-50
                        transition-colors
                    "
                        >

                            {/* DATE FILED */}
                            <td className="px-4 py-3">
                                {formatDate(item.DateFiled)}
                            </td>

                            {/* EMPLOYEE */}
                            <td className="px-4 py-3">

                                <div className="flex items-center gap-3">

                                    {/* AVATAR */}
                                    <div
                                        className="
                                    w-10
                                    h-10
                                    rounded-full
                                    overflow-hidden
                                    bg-gradient-to-r
                                    from-slate-800
                                    to-slate-900
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    text-sm
                                    font-semibold
                                    shadow-sm
                                    shrink-0
                                "
                                    >

                                        {profileImage ? (

                                            <img
                                                src={profileImage}
                                                alt={item.EmployeeName}
                                                className="w-full h-full object-cover"
                                            />

                                        ) : (

                                            getInitials(item.EmployeeName, "")

                                        )}

                                    </div>

                                    {/* INFO */}
                                    <div className="min-w-0">

                                        <div
                                            className="
                                        font-medium
                                        text-gray-900
                                        truncate
                                    "
                                        >
                                            {item.EmployeeName}
                                        </div>

                                        <div
                                            className="
                                        text-xs
                                        text-gray-500
                                        truncate
                                    "
                                        >
                                            {item.Department || "—"}
                                        </div>

                                    </div>

                                </div>
                            </td>

                            {/* TYPE */}
                            <td className="px-4 py-3">
                                {item.Type}
                            </td>

                            {/* TOTAL */}
                            <td className="px-4 py-3 font-medium">
                                {formatCurrency(item.TotalAmount)}
                            </td>

                            {/* OVERDUE */}
                            <td className="px-4 py-3 w-[220px]">

                                {(() => {

                                    const progress =
                                        item.overdue_progress;

                                    if (!progress) return "—";

                                    /* ====================================
                                       COMPLETED
                                    ==================================== */
                                    if (progress.completed) {

                                        return (
                                            <div className="space-y-1">

                                                <div>
                                                    <span
                                                        className="
                                                    inline-flex
                                                    items-center
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    font-semibold
                                                    bg-green-100
                                                    text-green-700
                                                "
                                                    >
                                                        Completed
                                                    </span>
                                                </div>

                                                {progress.overdue_days > 0 ? (

                                                    <p
                                                        className="
                                                    text-xs
                                                    text-red-500
                                                    font-medium
                                                "
                                                    >
                                                        +{progress.overdue_days} overdue
                                                    </p>

                                                ) : (

                                                    <p
                                                        className="
                                                    text-xs
                                                    text-green-600
                                                    font-medium
                                                "
                                                    >
                                                        On Time
                                                    </p>

                                                )}

                                            </div>
                                        );
                                    }

                                    /* ====================================
                                       ACTIVE
                                    ==================================== */
                                    const percent = Math.min(
                                        (progress.days_passed /
                                            progress.grace) * 100,
                                        100
                                    );

                                    let color = "bg-green-500";

                                    if (
                                        progress.status === "warning"
                                    ) {
                                        color = "bg-yellow-500";
                                    }

                                    if (
                                        progress.status === "overdue"
                                    ) {
                                        color = "bg-red-500";
                                    }

                                    return (
                                        <div className="space-y-1">

                                            {/* BAR */}
                                            <div
                                                className="
                                            w-full
                                            bg-gray-200
                                            rounded-full
                                            h-2
                                            overflow-hidden
                                        "
                                            >
                                                <div
                                                    className={`
                                                h-2
                                                rounded-full
                                                transition-all
                                                duration-500
                                                ${color}
                                            `}
                                                    style={{
                                                        width: `${percent}%`,
                                                    }}
                                                />
                                            </div>

                                            {/* STATUS TEXT */}
                                            <div
                                                className="
                                            text-xs
                                            text-gray-500
                                            flex
                                            justify-between
                                        "
                                            >

                                                <span>
                                                    {progress.days_passed}/
                                                    {progress.grace}
                                                </span>

                                                {progress.overdue_days > 0 && (
                                                    <span
                                                        className="
                                                    text-red-500
                                                    font-medium
                                                "
                                                    >
                                                        +{progress.overdue_days} overdue
                                                    </span>
                                                )}

                                            </div>

                                            {/* OVERDUE START */}
                                            <div
                                                className="
                                            text-[11px]
                                            text-gray-400
                                        "
                                            >
                                                Overdue starts:{" "}

                                                {progress.overdue_start
                                                    ? new Date(
                                                        progress.overdue_start
                                                    ).toLocaleDateString()
                                                    : "—"}
                                            </div>

                                        </div>
                                    );
                                })()}

                            </td>

                            {/* STATUS */}
                            <td className="px-4 py-3">

                                <StatusBadge
                                    status={item.Status}
                                />

                            </td>

                            {/* ACTION */}
                            <td className="px-4 py-3">

                                <button
                                    onClick={() => onView(item)}
                                    className="
                                text-gray-500
                                hover:text-indigo-600
                                transition-colors
                            "
                                >
                                    <Eye className="w-4 h-4" />
                                </button>

                            </td>


                        </tr>
                    );

                }}

            />

        </div>
    );
}