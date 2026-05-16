import { CalendarRange } from "lucide-react";

export default function RecentLeaveCard({
    employeeName,
    leaveType,
    dateFrom,
    dateTo,
}) {

    /*
    |--------------------------------------------------------------------------
    | INITIALS
    |--------------------------------------------------------------------------
    */
    const initials = employeeName
        ?.split(" ")
        ?.map(word => word.charAt(0))
        ?.slice(0, 2)
        ?.join("")
        ?.toUpperCase();

    return (
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md">

            {/* =========================================================
                LEFT SIDE
            ========================================================= */}
            <div className="flex items-center gap-4">

                {/* AVATAR */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1739] text-sm font-bold text-white">

                    {initials}

                </div>

                {/* INFO */}
                <div className="space-y-1">

                    <h3 className="text-sm font-semibold text-gray-900">
                        {employeeName}
                    </h3>

                    <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">

                        {leaveType}

                    </div>

                </div>

            </div>

            {/* =========================================================
                RIGHT SIDE
            ========================================================= */}
            <div className="flex items-center gap-2 text-sm text-gray-500">

                <CalendarRange className="h-4 w-4" />

                <span>
                    {dateFrom} - {dateTo}
                </span>

            </div>

        </div>
    );
}