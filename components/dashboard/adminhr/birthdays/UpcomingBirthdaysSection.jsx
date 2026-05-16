"use client";

import BirthdayCard from "./BirthdayCard";

export default function UpcomingBirthdaysSection({
    birthdays = [],
}) {

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* =========================================================
                HEADER
            ========================================================= */}
            <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                    Upcoming Birthdays
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Celebrants for this month.
                </p>

            </div>

            {/* =========================================================
                EMPTY STATE
            ========================================================= */}
            {birthdays.length === 0 && (

                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">

                    <p className="text-sm text-gray-500">
                        No upcoming birthdays this month.
                    </p>

                </div>
            )}

            {/* =========================================================
                BIRTHDAY LIST
            ========================================================= */}
            {birthdays.length > 0 && (

                <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">

                    {birthdays.map((employee) => (

                        <BirthdayCard
                            key={employee.EmployeeNo}
                            employeeName={
                                `${employee.FirstName} ${employee.LastName}`
                            }
                            birthday={employee.Birthday}
                            department={employee.Department}
                        />

                    ))}

                </div>
            )}

        </div>
    );
}