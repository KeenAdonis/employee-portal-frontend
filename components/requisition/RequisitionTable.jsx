"use client";

import DataTable from "@/components/table/DataTable";
import { Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/ui/StatusBadge";
import { getInitials } from "@/lib/utils";

export default function RequisitionTable({ data, onView }) {

    const columns = [
        "Date Filed",
        "Employee",
        "Type",
        "Total",
        "Overdue",
        "Status",
        "Actions"
    ];

    const getProgress = (days) => {
        const max = 10;
        return Math.min((days / max) * 100, 100);
    };

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

                    {/* OVERDUE PROGRESS */}
                    <td className="px-4 py-3 w-[220px]">
                        {(() => {
                            const progress = item.overdue_progress;

                            if (!progress) return "—";

                            const percent = Math.min(
                                (progress.days_passed / progress.grace) * 100,
                                100
                            );

                            let color = "bg-green-500";

                            if (progress.status === "warning") color = "bg-yellow-500";
                            if (progress.status === "overdue") color = "bg-red-500";

                            return (
                                <div className="space-y-1">

                                    {/* BAR */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${color}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>

                                    {/* TEXT */}
                                    <div className="text-xs text-gray-500 flex justify-between">

                                        <span>
                                            {progress.days_passed}/{progress.grace}
                                        </span>

                                        {progress.overdue_days > 0 && (
                                            <span className="text-red-500 font-medium">
                                                +{progress.overdue_days} overdue
                                            </span>
                                        )}
                                    </div>

                                    {/* OVERDUE START DATE */}
                                    <div className="text-[11px] text-gray-400">
                                        Overdue starts:{" "}
                                        {progress.overdue_start
                                            ? new Date(progress.overdue_start).toLocaleDateString()
                                            : "—"}
                                    </div>

                                </div>
                            );
                        })()}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                        <StatusBadge status={item.Status} />
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3">
                        <button
                            onClick={() => onView(item)}
                            className="text-gray-500 hover:text-indigo-600 transition"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </td>

                </tr>
            )}
        />
    );
}