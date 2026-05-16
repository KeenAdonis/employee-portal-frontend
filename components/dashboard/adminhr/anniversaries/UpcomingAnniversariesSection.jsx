"use client";

import AnniversaryCard from "./AnniversaryCard";

export default function UpcomingAnniversariesSection({
    anniversaries = [],
}) {

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* =========================================================
                HEADER
            ========================================================= */}
            <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                    Work Anniversaries
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Employees celebrating work milestones this month.
                </p>

            </div>

            {/* =========================================================
                EMPTY STATE
            ========================================================= */}
            {anniversaries.length === 0 && (

                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">

                    <p className="text-sm text-gray-500">
                        No work anniversaries this month.
                    </p>

                </div>
            )}

            {/* =========================================================
                ANNIVERSARY LIST
            ========================================================= */}
            {anniversaries.length > 0 && (

                <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">

                    {anniversaries.map((employee) => (

                        <AnniversaryCard
                            key={employee.EmployeeNo}
                            employeeName={
                                `${employee.FirstName} ${employee.LastName}`
                            }
                            dateHired={employee.DateHired}
                            department={employee.Department}
                        />

                    ))}

                </div>
            )}

        </div>
    );
}