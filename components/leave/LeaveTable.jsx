"use client";

import DataTable from "@/components/table/DataTable";
import { Eye } from "lucide-react";
import { formatDate } from "@/lib/format";
import StatusBadge from "@/components/ui/StatusBadge";
import { getInitials } from "@/lib/utils";

export default function LeaveTable({ data, onView }) {

    const columns = ["Date Filed", "Employee", "Leave Dates", "Days", "Type", "Status", "Actions"];

    return (
        <DataTable
            columns={columns}
            data={data}
            renderRow={(item) => (
                <tr key={item.id} className="hover:bg-gray-50">

                    {/* DATE FILED */}
                    <td className="px-4 py-3">
                        {formatDate(item.DateFiled)}
                    </td>

                    {/* EMPLOYEE */}
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                                {getInitials(item.EmployeeName)}
                            </div>

                            <div>
                                <div className="font-medium text-gray-900">
                                    {item.EmployeeName}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.employee?.Position || "—"}
                                </div>
                            </div>

                        </div>
                    </td>

                    {/* DATE RANGE */}
                    <td className="px-4 py-3 text-sm">
                        {formatDate(item.DateFrom)} - {formatDate(item.DateTo)}
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
                        <StatusBadge status={item.Status} />
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3">
                        <button
                            onClick={() => onView(item)}
                            className="text-gray-500 hover:text-indigo-600"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </td>

                </tr>
            )}
        />
    );
}