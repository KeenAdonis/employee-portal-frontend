"use client";

import RecentOvertimeCard from "./RecentOvertimeCard";

export default function RecentOvertimeSection({
    overtimes = [],
}) {

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* HEADER */}
            <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                    Employees On Overtime Today
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Approved employees currently on overtime.
                </p>

            </div>

            {/* EMPTY */}
            {overtimes.length === 0 && (

                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">

                    <p className="text-sm text-gray-500">
                        No employees on overtime today.
                    </p>

                </div>

            )}

            {/* LIST */}
            {overtimes.length > 0 && (

                <div className="max-h-[320px] space-y-4 overflow-y-auto pr-2">

                    {overtimes.map((overtime) => (

                        <RecentOvertimeCard
                            key={overtime.id}
                            employeeName={overtime.EmployeeName}
                            overtimeType={overtime.OvertimeType}
                            startTime={overtime.StartTime}
                            endTime={overtime.EndTime}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}