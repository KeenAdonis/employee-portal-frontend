"use client";

import DataTable from "@/components/table/DataTable";

import {
    Eye,
    Pencil,
} from "lucide-react";

import {
    formatDate,
    formatHours,
} from "@/lib/format";

import StatusBadge from "@/components/ui/StatusBadge";

import { getInitials } from "@/lib/utils";
import { getStorageUrl } from "@/lib/storage";

export default function OvertimeTable({
    data = [],
    loading = false,
    onView,
    onEditAccomplishment,
}) {

    const columns = [
        "Date Filed",
        "Employee",
        "Overtime Date",
        "Hours",
        "Status",
        "Actions",
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyTitle="No overtime requests found"
            emptyDescription="There are currently no overtime records available."
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
                                        {item.employee?.Position || "—"}
                                    </div>

                                </div>

                            </div>

                        </td>

                        {/* OT DATE */}
                        <td className="px-4 py-3">
                            {formatDate(item.OvertimeDate)}
                        </td>

                        {/* HOURS */}
                        <td className="px-4 py-3">
                            {formatHours(item.TotalHours)}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">

                            <StatusBadge
                                status={item.Status}
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

                                {/* EDIT */}
                                {onEditAccomplishment &&
                                    item.Status === "Pre-Approved" &&
                                    item.accomplishments?.length === 0 && (

                                        <button
                                            onClick={() =>
                                                onEditAccomplishment(item)
                                            }
                                            className="
                                                w-9 h-9 rounded-lg
                                                flex items-center justify-center
                                                text-amber-600
                                                hover:bg-amber-50
                                                transition
                                            "
                                        >
                                            <Pencil className="w-4 h-4" />
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