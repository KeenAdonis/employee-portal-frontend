"use client";

import DataTable from "@/components/table/DataTable";
import {
    Eye,
    Pencil,
} from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";

import { getInitials } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { getStorageUrl } from "@/lib/storage";

export default function LiquidationTable({
    data = [],
    loading = false,
    onView,
    onEdit,
}) {

    const columns = [
        "Reference",
        "Employee",
        "Cash Advance",
        "Expenses",
        "Returned",
        "Reimbursement",
        "Status",
        "Actions"
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            renderRow={(item) => {
                const profileImage = getStorageUrl(
                    item.requisition?.employee?.ProfileImage
                );

                return (

                    <tr key={item.id} className="hover:bg-gray-50">

                        {/* REFERENCE */}
                        <td className="px-4 py-3 font-medium">
                            {item.request_id}
                        </td>

                        {/* EMPLOYEE */}
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">

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
                                "
                                >

                                    {profileImage ? (

                                        <img
                                            src={profileImage}
                                            alt={item.requisition?.EmployeeName}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        getInitials(item.requisition?.EmployeeName, "")

                                    )}

                                </div>

                                <div>
                                    <div className="font-medium text-gray-900">
                                        {item.requisition?.EmployeeName || "—"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {item.requisition?.Department || "—"}
                                    </div>
                                </div>

                            </div>
                        </td>

                        {/* CASH ADVANCE */}
                        <td className="px-4 py-3">
                            {formatCurrency(item.cash_advance)}
                        </td>

                        {/* EXPENSES */}
                        <td className="px-4 py-3">
                            {formatCurrency(item.total_expenses)}
                        </td>

                        {/* RETURNED */}
                        <td className="px-4 py-3 text-green-600 font-medium">
                            {formatCurrency(item.amount_returned)}
                        </td>

                        {/* REIMBURSEMENT */}
                        <td className="px-4 py-3 text-red-600 font-medium">
                            {formatCurrency(item.amount_reimbursement)}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-3">

                            <div className="flex items-center gap-3">

                                {/* VIEW */}
                                <button
                                    onClick={() => onView(item)}
                                    className="
                                        text-gray-500
                                        hover:text-indigo-600
                                        transition
                                    "
                                >
                                    <Eye className="w-4 h-4" />
                                </button>

                                {/* EDIT DRAFT */}
                                {item.status === "Draft" && (

                                    <button
                                        onClick={() => onEdit(item)}
                                        className="
                                            text-amber-500
                                            hover:text-amber-600
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