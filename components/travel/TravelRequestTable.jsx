"use client";

import DataTable from "@/components/table/DataTable";

import { Eye } from "lucide-react";

import {
    formatDate,
} from "@/lib/format";

import StatusBadge from "@/components/ui/StatusBadge";

import { getInitials } from "@/lib/utils";

export default function TravelRequestTable({
    data = [],
    onView,
    loading = false,
}) {

    const columns = [
        "Travel No",
        "Employee",
        "Destination",
        "Transportation",
        "Departure",
        "Return",
        "Days",
        "Status",
        "Actions",
    ];

    /*
    |--------------------------------------------------------------------------
    | FORMAT TRANSPORTATION TYPE
    |--------------------------------------------------------------------------
    */
    const formatTransportationType = (
        type
    ) => {

        switch (type) {

            case "Company Vehicle":
                return "Company Vehicle";

            case "Personal Vehicle":
                return "Personal Vehicle";

            case "Commute":
                return "Commute";

            case "air_travel":
                return "Air Travel";

            default:
                return type;
        }
    };

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyTitle="No travel requests found"
            emptyDescription="There are currently no travel request records available."
            renderRow={(item) => (
                <tr
                    key={item.id}
                    className="
                        hover:bg-gray-50
                        transition-colors
                    "
                >

                    {/* TRAVEL NO */}
                    <td className="px-4 py-3">

                        <div
                            className="
                                font-medium
                                text-gray-900
                            "
                        >
                            {item.travel_no}
                        </div>

                    </td>

                    {/* EMPLOYEE */}
                    {/* EMPLOYEE */}
                    <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                            {/* AVATAR */}
                            <div
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    overflow-hidden
                                    bg-gradient-to-r
                                    from-slate-800
                                    to-slate-900
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    text-sm
                                    font-semibold
                                    shadow-sm
                                    shrink-0
                                "
                            >
                            
                                {item.employee?.ProfileImage ? (
                                
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.employee.ProfileImage}`}
                                        alt={item.employee ? [item.employee.FirstName, item.employee.LastName] .filter(Boolean) .join(" ") : "Employee"}
                                        className=" w-full h-full object-cover
                                        "
                                    />
                                
                                ) : (
                                
                                    getInitials(
                                        item.employee
                                            ? [
                                                item.employee.FirstName,
                                                item.employee.LastName
                                            ]
                                            .filter(Boolean)
                                            .join(" ")
                                            : "Unknown Employee"
                                    )
                                
                                )}

                            </div>
                            
                            {/* INFO */}
                            <div className="min-w-0">
                            
                                <div
                                    className="
                                        font-medium
                                        text-gray-900
                                        truncate
                                    "
                                >
                                    {
                                        item.employee
                                            ? [
                                                item.employee.FirstName,
                                                item.employee.MiddleInitial,
                                                item.employee.LastName
                                            ]
                                            .filter(Boolean)
                                            .join(" ")
                                            : "Unknown Employee"
                                    }
                                </div>
                            
                                <div
                                    className="
                                        text-xs
                                        text-gray-500
                                        truncate
                                    "
                                >
                                    {item.employee?.Position || "—"}
                                </div>
                            
                            </div>
                            
                        </div>
                            
                    </td>

                    {/* DESTINATION */}
                    <td className="px-4 py-3">

                        <div
                            className="
                                max-w-[220px]
                                truncate
                            "
                        >
                            {item.destination}
                        </div>

                    </td>

                    {/* TRANSPORTATION */}
                    <td className="px-4 py-3">

                        <span
                            className="
                                inline-flex
                                items-center
                                px-2.5
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                bg-slate-100
                                text-slate-700
                            "
                        >
                            {formatTransportationType(
                                item.transportation_type
                            )}
                        </span>

                    </td>

                    {/* DEPARTURE */}
                    <td className="px-4 py-3">

                        <div
                            className="
                                text-sm
                                text-gray-700
                            "
                        >
                            {formatDate(
                                item.departure_datetime
                            )}
                        </div>

                    </td>

                    {/* RETURN */}
                    <td className="px-4 py-3">

                        <div
                            className="
                                text-sm
                                text-gray-700
                            "
                        >
                            {formatDate(
                                item.return_datetime
                            )}
                        </div>

                    </td>

                    {/* TOTAL DAYS */}
                    <td className="px-4 py-3">

                        <div
                            className="
                                font-medium
                                text-gray-900
                            "
                        >
                            {item.total_days}
                        </div>

                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">

                        <StatusBadge
                            status={item.status}
                        />

                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">

                        <button
                            onClick={() => onView(item)}
                            className="
                                text-gray-500
                                hover:text-indigo-600
                                transition-colors
                            "
                        >
                            <Eye className="w-4 h-4" />
                        </button>

                    </td>

                </tr>
            )}
        />
    );
}