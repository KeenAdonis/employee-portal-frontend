"use client";

import RecentOvertimeCard from "./RecentOvertimeCard";

export default function RecentOvertimeSection({
    overtimes = [],
}) {

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* =========================================================
                HEADER
            ========================================================= */}
            <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                    Approved Overtime Today
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Employees scheduled for overtime today.
                </p>

            </div>

            {/* =========================================================
                EMPTY STATE
            ========================================================= */}
            {overtimes.length === 0 && (

                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">

                    <p className="text-sm text-gray-500">
                        No approved overtime today.
                    </p>

                </div>
            )}

            {/* =========================================================
                OVERTIME LIST
            ========================================================= */}
            {overtimes.length > 0 && (

                <div className="max-h-[320px] space-y-4 overflow-y-auto pr-2">

                    {overtimes.map((overtime) => (

                        <RecentOvertimeCard
                            key={overtime.id}
                            employeeName={overtime.EmployeeName}
                            overtimeDate={overtime.OvertimeDate}
                            totalHours={overtime.TotalHours}
                        />

                    ))}

                </div>
            )}

        </div>
    );
}