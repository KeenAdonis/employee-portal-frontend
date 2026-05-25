"use client";

import { Eye } from "lucide-react";

import DataTable from "@/components/table/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

import { formatDate } from "@/lib/format";
import { getInitials } from "@/lib/utils";
import { getStorageUrl } from "@/lib/storage";

export default function PayrollTable({
    data = [],
    loading = false,
    onView,
}) {

    const columns = [
        "Pay Date",
        "Employee",
        "Gross",
        "Net Pay",
        "Status",
        "Actions",
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyTitle="No payroll records found"
            emptyDescription="There are currently no payroll records available."
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

                        {/* PAY DATE */}
                        <td className="px-4 py-3">
                            {formatDate(item.PayDate)}
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
                                        {item.Position || "—"}
                                    </div>

                                </div>

                            </div>

                        </td>

                        {/* GROSS */}
                        <td
                            className="
                            px-4 py-3
                            font-medium
                            text-green-600
                        "
                        >
                            ₱{" "}
                            {Number(
                                item.Gross || 0
                            ).toLocaleString()}
                        </td>

                        {/* NET PAY */}
                        <td
                            className="
                            px-4 py-3
                            font-semibold
                            text-blue-600
                        "
                        >
                            ₱{" "}
                            {Number(
                                item.NetPay || 0
                            ).toLocaleString()}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">

                            <StatusBadge
                                status={
                                    item.status || "Processed"
                                }
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