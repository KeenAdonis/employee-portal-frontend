"use client";

import {
    Database,
    SearchX,
} from "lucide-react";

export default function DataTable({
    columns = [],
    data = [],
    renderRow,
    loading = false,
    emptyTitle = "No data found",
    emptyDescription = "There are currently no records to display.",
}) {
    return (
        <div className="w-full overflow-x-auto bg-white rounded-xl border">

            <table className="min-w-full text-sm">

                {/* HEADER */}
                <thead className="bg-gray-50 border-b">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="
                                    text-left
                                    px-4
                                    py-3
                                    font-medium
                                    text-gray-600
                                "
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* BODY */}
                <tbody>

                    {/* =========================================
                        LOADING SKELETON
                    ========================================= */}
                    {loading ? (
                        [...Array(5)].map((_, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b"
                            >
                                {columns.map((_, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-4 py-4"
                                    >
                                        <div
                                            className="
                                                h-4
                                                rounded-md
                                                bg-gray-200
                                                animate-pulse
                                            "
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (

                        /* =========================================
                            EMPTY STATE
                        ========================================= */
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="py-16 px-6"
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        text-center
                                    "
                                >

                                    {/* ICON */}
                                    <div
                                        className="
                                            w-16
                                            h-16
                                            rounded-2xl
                                            bg-gray-100
                                            flex
                                            items-center
                                            justify-center
                                            mb-4
                                        "
                                    >
                                        <SearchX
                                            size={30}
                                            className="text-gray-400"
                                        />
                                    </div>

                                    {/* TITLE */}
                                    <h3
                                        className="
                                            text-base
                                            font-semibold
                                            text-gray-800
                                        "
                                    >
                                        {emptyTitle}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-gray-500
                                            max-w-sm
                                        "
                                    >
                                        {emptyDescription}
                                    </p>

                                </div>
                            </td>
                        </tr>

                    ) : (

                        /* =========================================
                            DATA
                        ========================================= */
                        data.map((item) => renderRow(item))

                    )}

                </tbody>

            </table>
        </div>
    );
}