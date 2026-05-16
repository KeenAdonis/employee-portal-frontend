"use client";

import {
    ReceiptText,
    WalletCards,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| STATS CONFIG
|--------------------------------------------------------------------------
*/
const statsConfig = [

    {
        key: "pendingRequisitions",
        label: "Pending Requisitions",
        icon: ReceiptText,
        color: "text-blue-600",
        bg: "bg-blue-100",
        trend: "+12%",
    },

    {
        key: "forLiquidation",
        label: "For Liquidation",
        icon: WalletCards,
        color: "text-amber-600",
        bg: "bg-amber-100",
        trend: "+5%",
    },

    {
        key: "overdueLiquidations",
        label: "Overdue Liquidations",
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-100",
        trend: "-3%",
    },

    {
        key: "approvedThisMonth",
        label: "Approved This Month",
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        trend: "+18%",
    },

];

export default function AccountingStatsGrid({

    stats,

    loading,

}) {

    return (
        <div
            className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >

            {statsConfig.map((item) => {

                const Icon = item.icon;

                return (
                    <div
                        key={item.key}
                        className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm
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
                                        text-4xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                    "
                                >

                                    {loading
                                        ? "--"
                                        : stats[item.key] || 0}

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
                                    {item.trend}
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
                                Monthly
                            </span>

                        </div>

                    </div>
                );
            })}

        </div>
    );
}