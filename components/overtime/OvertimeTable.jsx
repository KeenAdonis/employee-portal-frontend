import DataTable from "@/components/table/DataTable";
import { Eye } from "lucide-react";
import { formatDate, formatHours } from "@/lib/format";
import StatusBadge from "@/components/ui/StatusBadge";
import { getInitials } from "@/lib/utils";

export default function OvertimeTable({ data, onView }) {
    const columns = ["Date Filed", "Employee", "Overtime Date", "Hours", "Status", "Actions"];

    return (
        <DataTable
            columns={columns}
            data={data}
            renderRow={(item) => (
                <tr key={item.id} className="hover:bg-gray-50">

                    <td className="px-4 py-3">
                        {formatDate(item.DateFiled)}
                    </td>

                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">

                            {/* AVATAR */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                                {getInitials(item.EmployeeName)}
                            </div>

                            {/* NAME + POSITION */}
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

                    <td className="px-4 py-3">
                        {formatDate(item.OvertimeDate)}
                    </td>

                    <td className="px-4 py-3">
                        {formatHours(item.TotalHours)}
                    </td>

                    <td className="px-4 py-3">
                        <StatusBadge status={item.Status} />
                    </td>

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