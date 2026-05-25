"use client";

import DataTable from "@/components/table/DataTable";

import { Eye } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";

import { getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { getStorageUrl } from "@/lib/storage";

export default function LeaveTable({
    data = [],
    onView,
    loading = false,
}) {

    const columns = [
        "Date Filed",
        "Employee",
        "Leave Dates",
        "Days",
        "Type",
        "Status",
        "Actions",
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyTitle="No leave requests found"
            emptyDescription="There are currently no leave records available."
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

                                {/* PROFILE */}
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

                        {/* DATE RANGE */}
                        <td className="px-4 py-3 text-sm">

                            {formatDate(item.DateFrom)} -{" "}
                            {formatDate(item.DateTo)}

                        </td>

                        {/* DAYS */}
                        <td className="px-4 py-3">
                            {item.TotalDays}
                        </td>

                        {/* TYPE */}
                        <td className="px-4 py-3">
                            {item.LeaveType}
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
    );
}