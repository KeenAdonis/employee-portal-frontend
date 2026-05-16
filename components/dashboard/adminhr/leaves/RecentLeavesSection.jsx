"use client";

import RecentLeaveCard from "./RecentLeaveCard";

export default function RecentLeavesSection({
    leaves = [],
}) {

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* =========================================================
                HEADER
            ========================================================= */}
            <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                    Employees On Leave Today
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Approved employees currently on leave.
                </p>

            </div>

            {/* =========================================================
                EMPTY STATE
            ========================================================= */}
            {leaves.length === 0 && (

                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">

                    <p className="text-sm text-gray-500">
                        No employees on leave today.
                    </p>

                </div>
            )}

            {/* =========================================================
                LEAVES LIST
            ========================================================= */}
            {leaves.length > 0 && (

                <div className="max-h-[320px] space-y-4 overflow-y-auto pr-2">

                    {leaves.map((leave) => (

                        <RecentLeaveCard
                            key={leave.id}
                            employeeName={leave.EmployeeName}
                            leaveType={leave.LeaveType}
                            dateFrom={leave.DateFrom}
                            dateTo={leave.DateTo}
                        />

                    ))}

                </div>
            )}

        </div>
    );
}