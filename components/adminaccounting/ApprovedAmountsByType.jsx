"use client";

import {
    CreditCard,
    Wallet,
    Receipt,
    Landmark,
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

export default function ApprovedAmountsByType({

    approvedAmounts,

    loading,

}) {

    /*
    |--------------------------------------------------------------------------
    | CARD CONFIG
    |--------------------------------------------------------------------------
    */
    const cards = [

        {
            label: "Cash Advance",
            value:
                approvedAmounts.cashAdvance,
            icon: CreditCard,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },

        {
            label: "Petty Cash",
            value:
                approvedAmounts.pettyCash,
            icon: Wallet,
            color: "text-amber-600",
            bg: "bg-amber-100",
        },

        {
            label: "Reimbursement",
            value:
                approvedAmounts.reimbursement,
            icon: Receipt,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
        },

        {
            label: "Request for Payment",
            value:
                approvedAmounts.requestForPayment,
            icon: Landmark,
            color: "text-violet-600",
            bg: "bg-violet-100",
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
                    Approved Amounts By Type
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Total approved requisition amounts
                    categorized by request type.
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
                            key={item.label}
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
                                        {item.label}
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

                                            : formatCurrency(
                                                item.value
                                            )}

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
                                        Approved
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
                                    This Month
                                </span>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}