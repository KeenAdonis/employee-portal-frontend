"use client";

import CompanyBreakdownCard from "./CompanyBreakdownCard";

export default function CompanyBreakdownSection({
    companies = [],
    totalEmployees = 0,
}) {

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* =========================================================
                HEADER
            ========================================================= */}
            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-bold text-gray-900">
                        Employee Distribution
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Workforce breakdown across all companies.
                    </p>

                </div>

            </div>

            {/* =========================================================
                EMPTY STATE
            ========================================================= */}
            {companies.length === 0 && (

                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">

                    <p className="text-sm text-gray-500">
                        No company data available.
                    </p>

                </div>
            )}

            {/* =========================================================
                COMPANY GRID
            ========================================================= */}
            {companies.length > 0 && (

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                    {companies.map((company, index) => {

                        /*
                        |--------------------------------------------------------------------------
                        | PERCENTAGE
                        |--------------------------------------------------------------------------
                        */
                        const percentage = totalEmployees > 0
                            ? (
                                (company.total / totalEmployees) * 100
                            ).toFixed(1)
                            : 0;

                        return (
                            <CompanyBreakdownCard
                                key={index}
                                company={company.Company}
                                totalEmployees={company.total}
                                percentage={percentage}
                            />
                        );
                    })}

                </div>
            )}

        </div>
    );
}