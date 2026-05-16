"use client";

import Link from "next/link";

import {
    ReceiptText,
    ArrowRight,
} from "lucide-react";

export default function RecentRequisitionsCard({

    requisitions = [],

    loading,

}) {

    return (
        <div
            className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            {/* HEADER */}
            <div
                className="
                    mb-6
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <h2
                        className="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        Recent Requisitions
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Latest submitted requisition requests.
                    </p>

                </div>

                <Link
                    href="/adminaccounting/requisitions"
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-blue-600
                        transition-colors
                        hover:text-blue-700
                    "
                >

                    View All

                    <ArrowRight className="h-4 w-4" />

                </Link>

            </div>

            {/* CONTENT */}
            <div className="space-y-4">

                {loading ? (

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-6
                            text-center
                            text-sm
                            text-slate-500
                        "
                    >
                        Loading requisitions...
                    </div>

                ) : requisitions.length === 0 ? (

                    <div
                        className="
                            rounded-2xl
                            border
                            border-dashed
                            border-slate-300
                            bg-slate-50
                            p-8
                            text-center
                        "
                    >

                        <ReceiptText
                            className="
                                mx-auto
                                h-10
                                w-10
                                text-slate-400
                            "
                        />

                        <p
                            className="
                                mt-4
                                text-sm
                                text-slate-500
                            "
                        >
                            No recent requisitions found.
                        </p>

                    </div>

                ) : (

                    requisitions.map((item) => (

                        <div
                            key={item.id}
                            className="
                                group
                                flex
                                items-center
                                justify-between
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-blue-200
                                hover:shadow-lg
                            "
                        >

                            {/* LEFT */}
                            <div className="min-w-0">

                                <h3
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    {item.title ||
                                        item.reference_number ||
                                        "Requisition"}
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Requested by{" "}

                                    <span className="text-slate-700">
                                        {item.employee_name || "Employee"}
                                    </span>

                                </p>

                            </div>

                            {/* RIGHT */}
                            <div className="text-right">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        rounded-full
                                        border
                                        border-amber-200
                                        bg-amber-50
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        text-amber-700
                                    "
                                >
                                    {item.status || "Pending"}
                                </span>

                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    {item.created_at
                                        ? new Date(
                                            item.created_at
                                        ).toLocaleDateString()
                                        : "--"}
                                </p>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}