import { Cake } from "lucide-react";

export default function BirthdayCard({
    employeeName,
    birthday,
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
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */
    const formattedBirthday = new Date(birthday)
        .toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
        });

    return (
        <div className="flex items-center justify-between rounded-2xl border border-pink-100 bg-white p-4 transition-all duration-300 hover:shadow-md">

            {/* =========================================================
                LEFT SIDE
            ========================================================= */}
            <div className="flex items-center gap-4">

                {/* AVATAR */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500 text-sm font-bold text-white shadow-sm">

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

                <div className="flex items-center justify-end gap-2 text-sm font-medium text-pink-600">

                    <Cake className="h-4 w-4" />

                    <span>{formattedBirthday}</span>

                </div>

            </div>

        </div>
    );
}