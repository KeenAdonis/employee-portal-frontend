"use client";

import DataTable from "@/components/table/DataTable";

import {
    Eye,
    Check,
    X,
} from "lucide-react";

import {
    formatDate,
    formatHours,
    formatTime,
} from "@/lib/format";

import StatusBadge from "@/components/ui/StatusBadge";

import { getInitials } from "@/lib/utils";
import { getStorageUrl } from "@/lib/storage";

export default function DTRTable({
    data = [],
    loading = false,

    onView,
    onApprove,
    onReject,
}) {

    const columns = [
        "Date",
        "Employee",
        "Time In",
        "Time Out",
        "Work Hours",
        "OT Hours",
        "Status",
        "Actions",
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyTitle="No DTR records found"
            emptyDescription="There are currently no DTR records available."
            renderRow={(item) => {

                const profileImage =
                    getStorageUrl(
                        item.employee?.ProfileImage
                    );

                const employeeName = `
                    ${item.employee?.FirstName || ""}
                    ${item.employee?.LastName || ""}
                `.trim();

                return (

                    <tr
                        key={item.id}
                        className="
                            hover:bg-gray-50
                            transition-colors
                        "
                    >

                        {/* DATE */}
                        <td className="px-4 py-3">
                            {formatDate(item.date)}
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
                                            alt={employeeName}
                                            className="
                                                w-full
                                                h-full
                                                object-cover
                                            "
                                        />

                                    ) : (

                                        getInitials(
                                            employeeName,
                                            ""
                                        )

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
                                        {employeeName}
                                    </div>

                                    <div
                                        className="
                                            text-xs
                                            text-gray-500
                                            truncate
                                        "
                                    >
                                        {item.employee?.EmployeeNo || "—"}
                                    </div>

                                </div>

                            </div>

                        </td>

                        {/* TIME IN */}
                        <td className="px-4 py-3">
                            {formatTime(item.time_in)}
                        </td>

                        {/* TIME OUT */}
                        <td className="px-4 py-3">
                            {formatTime(item.time_out)}
                        </td>

                        {/* WORK HOURS */}
                        <td className="px-4 py-3">
                            {formatHours(
                                item.total_work_hours
                            )}
                        </td>

                        {/* OT HOURS */}
                        <td className="px-4 py-3">
                            {formatHours(
                                item.overtime_hours
                            )}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">

                            <StatusBadge
                                status={item.status}
                            />

                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3">

                            <div className="flex items-center gap-2">

                                {/* VIEW */}
                                <button
                                    onClick={() => onView(item)}
                                    className="
                                        w-9 h-9 rounded-lg
                                        flex items-center justify-center
                                        text-gray-500
                                        hover:text-indigo-600
                                        hover:bg-indigo-50
                                        transition
                                    "
                                >
                                    <Eye className="w-4 h-4" />
                                </button>

                                {/* APPROVE */}
                                {onApprove &&
                                    item.status === "pending" && (

                                        <button
                                            onClick={() =>
                                                onApprove(item)
                                            }
                                            className="
                                                w-9 h-9 rounded-lg
                                                flex items-center justify-center
                                                text-emerald-600
                                                hover:bg-emerald-50
                                                transition
                                            "
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>

                                    )}

                                {/* REJECT */}
                                {onReject &&
                                    item.status === "pending" && (

                                        <button
                                            onClick={() =>
                                                onReject(item)
                                            }
                                            className="
                                                w-9 h-9 rounded-lg
                                                flex items-center justify-center
                                                text-red-600
                                                hover:bg-red-50
                                                transition
                                            "
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                    )}

                            </div>

                        </td>

                    </tr>
                );
            }}
        />
    );
}