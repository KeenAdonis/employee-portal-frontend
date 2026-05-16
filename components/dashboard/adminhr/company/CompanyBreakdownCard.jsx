import { Building2, Users } from "lucide-react";

export default function CompanyBreakdownCard({
    company,
    totalEmployees,
    percentage = 0,
}) {

    /*
    |--------------------------------------------------------------------------
    | COMPANY INITIALS
    |--------------------------------------------------------------------------
    */
    const initials = company
        ?.split(" ")
        ?.map(word => word.charAt(0))
        ?.join("")
        ?.slice(0, 2)
        ?.toUpperCase();

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

            {/* =========================================================
                TOP SECTION
            ========================================================= */}
            <div className="flex items-start justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-4">

                    {/* ICON */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1739] text-white shadow-sm">

                        <span className="text-sm font-bold tracking-wide">
                            {initials}
                        </span>

                    </div>

                    {/* TEXT */}
                    <div className="space-y-1">

                        <h3 className="text-base font-semibold text-gray-900">
                            {company}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500">

                            <Building2 className="h-4 w-4" />

                            <span>Company Workforce</span>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">

                    <Users className="h-4 w-4" />

                    <span>{totalEmployees}</span>

                </div>

            </div>

            {/* =========================================================
                PROGRESS SECTION
            ========================================================= */}
            <div className="mt-5 space-y-2">

                <div className="flex items-center justify-between text-sm">

                    <span className="text-gray-500">
                        Workforce Distribution
                    </span>

                    <span className="font-semibold text-gray-900">
                        {percentage}%
                    </span>

                </div>

                {/* PROGRESS BAR */}
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                    <div
                        className="h-full rounded-full bg-[#0B1739] transition-all duration-500"
                        style={{
                            width: `${percentage}%`
                        }}
                    />

                </div>

            </div>

        </div>
    );
}