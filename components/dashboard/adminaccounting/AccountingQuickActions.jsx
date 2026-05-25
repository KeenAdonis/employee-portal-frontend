"use client";

import Link from "next/link";

import {
    ReceiptText,
    WalletCards,
    FileSpreadsheet,
    Clock3,
    ArrowRight,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/
const actions = [

    {
        title: "Review Requisitions",
        description:
            "View and approve pending requisition requests.",
        href: "/dashboard/adminaccounting/finance-requisition",
        icon: ReceiptText,
        color: "text-blue-600",
        bg: "bg-blue-100",
        hover: "group-hover:bg-blue-600",
    },

    {
        title: "Review Liquidations",
        description:
            "Monitor liquidation submissions and validations.",
        href: "/dashboard/adminaccounting/finance-liquidation",
        icon: WalletCards,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        hover: "group-hover:bg-emerald-600",
    },

    {
        title: "Export Reports",
        description:
            "Generate accounting and financial reports.",
        href: "/dashboard/adminaccounting/finance-requisition",
        icon: FileSpreadsheet,
        color: "text-amber-600",
        bg: "bg-amber-100",
        hover: "group-hover:bg-amber-600",
    },

    {
        title: "Analytical Reports",
        description:
            "Monitor analytical report, monthly and yearly trend.",
        href: "/dashboard/adminaccounting/finance-report",
        icon: Clock3,
        color: "text-red-600",
        bg: "bg-red-100",
        hover: "group-hover:bg-red-600",
    },

];

export default function AccountingQuickActions() {

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
            <div className="mb-6">

                <h2
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    "
                >
                    Quick Actions
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Access commonly used accounting workflows
                    and financial operations.
                </p>

            </div>

            {/* GRID */}
            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {actions.map((action) => {

                    const Icon = action.icon;

                    return (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-slate-300
                                hover:shadow-xl
                            "
                        >

                            {/* TOP */}
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >

                                {/* ICON */}
                                <div
                                    className={`
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        transition-colors
                                        duration-300
                                        ${action.bg}
                                        ${action.hover}
                                    `}
                                >

                                    <Icon
                                        className={`
                                            h-7
                                            w-7
                                            transition-colors
                                            duration-300
                                            ${action.color}
                                            group-hover:text-white
                                        `}
                                    />

                                </div>

                                <ArrowRight
                                    className="
                                        h-5
                                        w-5
                                        text-slate-400
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                />

                            </div>

                            {/* CONTENT */}
                            <div className="mt-6">

                                <h3
                                    className="
                                        text-lg
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    {action.title}
                                </h3>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    {action.description}
                                </p>

                            </div>

                        </Link>
                    );
                })}

            </div>

        </div>
    );
}