"use client";

import DataTable from "@/components/table/DataTable";

import StatusBadge from "@/components/ui/StatusBadge";

import {
    Eye,
    Trash2,
} from "lucide-react";

export default function LoanTable({
    data = [],
    loading = false,
    onView,
    onDelete,
}) {

    const columns = [
        "Employee",
        "Loan Type",
        "Total",
        "Balance",
        "Monthly",
        "Status",
        "Actions",
    ];

    /* =========================================
       HELPERS
    ========================================= */
    const getEmployeeName = (loan) => {

        if (!loan.employee) {
            return "—";
        }

        return `${loan.employee.FirstName} ${loan.employee.LastName}`;
    };

    const getEmployeePosition = (loan) => {

        return loan.employee?.Position || "—";
    };

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyTitle="No loan records found"
            emptyDescription="There are currently no employee loan records available."
            renderRow={(loan) => (

                <tr
                    key={loan.id}
                    className="
                        hover:bg-gray-50
                        transition-colors
                    "
                >

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

                                {loan.employee?.ProfileImage ? (

                                    <img
                                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${loan.employee.ProfileImage}`}
                                        alt={getEmployeeName(loan)}
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                        "
                                    />

                                ) : (

                                    `${loan.employee?.FirstName?.charAt(0) || ""}${loan.employee?.LastName?.charAt(0) || ""}`

                                )}

                            </div>

                            {/* INFO */}
                            <div className="flex flex-col min-w-0">

                                <span
                                    className="
                                        font-medium
                                        text-gray-900
                                        truncate
                                    "
                                >
                                    {getEmployeeName(loan)}
                                </span>

                                <span
                                    className="
                                        text-xs
                                        text-gray-500
                                        truncate
                                    "
                                >
                                    {getEmployeePosition(loan)}
                                </span>

                            </div>

                        </div>

                    </td>

                    {/* LOAN TYPE */}
                    <td className="px-4 py-3">
                        {loan.loan_type}
                    </td>

                    {/* TOTAL */}
                    <td className="px-4 py-3">

                        ₱{" "}

                        {Number(
                            loan.total_amount
                        ).toFixed(2)}

                    </td>

                    {/* BALANCE */}
                    <td
                        className="
                            px-4 py-3
                            font-semibold
                            text-red-600
                        "
                    >

                        ₱{" "}

                        {Number(
                            loan.balance
                        ).toFixed(2)}

                    </td>

                    {/* MONTHLY */}
                    <td className="px-4 py-3">

                        ₱{" "}

                        {Number(
                            loan.monthly_amortization
                        ).toFixed(2)}

                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">

                        <StatusBadge
                            status={loan.status}
                        />

                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">

                        <div className="flex items-center gap-2">

                            {/* VIEW */}
                            <button
                                onClick={() => onView(loan)}
                                className="
                                    w-9 h-9 rounded-lg
                                    flex items-center justify-center
                                    text-gray-500
                                    hover:text-indigo-600
                                    hover:bg-indigo-50
                                    transition
                                "
                            >
                                <Eye size={16} />
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={() => onDelete(loan)}
                                className="
                                    w-9 h-9 rounded-lg
                                    flex items-center justify-center
                                    text-gray-500
                                    hover:text-red-600
                                    hover:bg-red-50
                                    transition
                                "
                            >
                                <Trash2 size={16} />
                            </button>

                        </div>

                    </td>

                </tr>
            )}
        />
    );
}