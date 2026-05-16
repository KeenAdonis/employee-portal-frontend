"use client";

import {

    Wallet,

    RotateCcw,

    ReceiptText,

    Clock3,

    TrendingUp,

} from "lucide-react";

/*
|--------------------------------------------------------------------------
| FORMAT CURRENCY
|--------------------------------------------------------------------------
*/
const formatCurrency = (amount = 0) => {

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }
    ).format(amount);
};

export default function LiquidationSummaryGrid({

    liquidationSummary,

    loading,

}) {

    /*
    |--------------------------------------------------------------------------
    | CARDS
    |--------------------------------------------------------------------------
    */
    const cards = [

        {
            title: "Total Expenses",
            value:
                liquidationSummary.totalExpenses,
            icon: Wallet,
            color: "text-blue-600",
            bg: "bg-blue-100",
            isCurrency: true,
        },

        {
            title: "Total Returned",
            value:
                liquidationSummary.totalReturned,
            icon: RotateCcw,
            color: "text-amber-600",
            bg: "bg-amber-100",
            isCurrency: true,
        },

        {
            title: "Total Reimbursement",
            value:
                liquidationSummary.totalReimbursement,
            icon: ReceiptText,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            isCurrency: true,
        },

        {
            title: "Pending Liquidations",
            value:
                liquidationSummary.pendingLiquidations,
            icon: Clock3,
            color: "text-red-600",
            bg: "bg-red-100",
            isCurrency: false,
        },

    ];

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
                    Liquidation Summary
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Overview of liquidation expenses,
                    reimbursements, returned amounts,
                    and pending submissions.
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

                {cards.map((item) => {

                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="
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

                                {/* LEFT */}
                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        {item.title}
                                    </p>

                                    <h3
                                        className="
                                            mt-4
                                            text-3xl
                                            font-bold
                                            tracking-tight
                                            text-slate-900
                                        "
                                    >

                                        {loading

                                            ? "--"

                                            : item.isCurrency

                                                ? formatCurrency(
                                                    item.value
                                                )

                                                : item.value || 0}

                                    </h3>

                                </div>

                                {/* ICON */}
                                <div
                                    className={`
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        ${item.bg}
                                    `}
                                >

                                    <Icon
                                        className={`
                                            h-7
                                            w-7
                                            ${item.color}
                                        `}
                                    />

                                </div>

                            </div>

                            {/* FOOTER */}
                            <div
                                className="
                                    mt-6
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <TrendingUp
                                        className={`
                                            h-4
                                            w-4
                                            ${item.color}
                                        `}
                                    />

                                    <span
                                        className={`
                                            text-sm
                                            font-medium
                                            ${item.color}
                                        `}
                                    >
                                        Financial Analytics
                                    </span>

                                </div>

                                <span
                                    className="
                                        text-xs
                                        uppercase
                                        tracking-[0.2em]
                                        text-slate-400
                                    "
                                >
                                    Overview
                                </span>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}