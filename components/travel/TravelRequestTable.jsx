"use client";

import DataTable from "@/components/table/DataTable";
import { useState } from "react";

import StatusBadge from "@/components/ui/StatusBadge";

import {
    Eye,
    CheckCircle2,
    XCircle,
    EllipsisVertical,
} from "lucide-react";

import {
    formatDate,
} from "@/lib/format";

import { getInitials } from "@/lib/utils";
import { getStorageUrl } from "@/lib/storage";

export default function TravelRequestTable({
    data = [],
    onView,
    onComplete,
    onCancel,
    loading = false,
    employeeView = false,
}) {

    const [openMenu, setOpenMenu] =
        useState(null);

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
            renderRow={(item) => {
                const profileImage = getStorageUrl(item.employee?.ProfileImage);

                return (
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

                                    {profileImage ? (

                                        <img
                                            src={profileImage}
                                            alt={item.EmployeeName}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        getInitials(item.EmployeeName, "")

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

                            <div className="relative">

                                <button
                                    onClick={() =>
                                        setOpenMenu(
                                            openMenu === item.id
                                                ? null
                                                : item.id
                                        )
                                    }
                                    className="
                                    w-9
                                    h-9
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-500
                                    hover:bg-gray-100
                                    transition
                                "
                                >
                                    <EllipsisVertical
                                        className="
                                        w-4
                                        h-4
                                    "
                                    />
                                </button>

                                {/* DROPDOWN */}
                                {openMenu === item.id && (

                                    <div
                                        className="
                                        absolute
                                        right-0
                                        mt-2
                                        w-52
                                        bg-white
                                        border
                                        rounded-xl
                                        shadow-xl
                                        z-50
                                        overflow-hidden
                                    "
                                    >

                                        {/* VIEW */}
                                        <button
                                            onClick={() => {

                                                onView(item);

                                                setOpenMenu(null);
                                            }}
                                            className="
                                            w-full
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            hover:bg-gray-50
                                        "
                                        >
                                            View Details
                                        </button>

                                        {/* COMPLETE */}
                                        {employeeView &&
                                            item.status ===
                                            "Approved" && (

                                                <button
                                                    onClick={() => {

                                                        onComplete?.(
                                                            item.id
                                                        );

                                                        setOpenMenu(null);
                                                    }}
                                                    className="
                                                w-full
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                hover:bg-gray-50
                                                text-green-600
                                            "
                                                >
                                                    Mark as Completed
                                                </button>

                                            )}

                                        {/* CANCEL */}
                                        {employeeView &&
                                            [
                                                "Pending",
                                                "Approved",
                                            ].includes(
                                                item.status
                                            ) && (

                                                <button
                                                    onClick={() => {

                                                        onCancel?.(
                                                            item
                                                        );

                                                        setOpenMenu(null);
                                                    }}
                                                    className="
                                                w-full
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                hover:bg-red-50
                                                text-red-600
                                            "
                                                >
                                                    Cancel Request
                                                </button>

                                            )}

                                    </div>

                                )}

                            </div>

                        </td>

                    </tr>
                );
            }}
        />
    );
}