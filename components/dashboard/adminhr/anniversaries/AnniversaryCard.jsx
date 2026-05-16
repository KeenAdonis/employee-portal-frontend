import { Award } from "lucide-react";

export default function AnniversaryCard({
    employeeName,
    dateHired,
    department,
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

    /*
    |--------------------------------------------------------------------------
    | YEARS OF SERVICE
    |--------------------------------------------------------------------------
    */
    const hiredDate = new Date(dateHired);

    const currentYear = new Date().getFullYear();

    const yearsOfService =
        currentYear - hiredDate.getFullYear();

    /*
    |--------------------------------------------------------------------------
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */
    const formattedDate = hiredDate.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
        }
    );

    return (
        <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white p-4 transition-all duration-300 hover:shadow-md">

            {/* =========================================================
                LEFT SIDE
            ========================================================= */}
            <div className="flex items-center gap-4">

                {/* AVATAR */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-sm font-bold text-white shadow-sm">

                    {initials}

                </div>

                {/* INFO */}
                <div className="space-y-1">

                    <h3 className="text-sm font-semibold text-gray-900">
                        {employeeName}
                    </h3>

                    <p className="text-xs text-gray-500">
                        {department || "No Department"}
                    </p>

                </div>

            </div>

            {/* =========================================================
                RIGHT SIDE
            ========================================================= */}
            <div className="text-right">

                <div className="flex items-center justify-end gap-2 text-sm font-medium text-amber-600">

                    <Award className="h-4 w-4" />

                    <span>{formattedDate}</span>

                </div>

                <p className="mt-1 text-xs font-semibold text-gray-700">

                    {yearsOfService} Year
                    {yearsOfService > 1 ? "s" : ""}

                </p>

            </div>

        </div>
    );
}