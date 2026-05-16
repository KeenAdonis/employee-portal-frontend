"use client";

import {
    CalendarDays,
    Clock3,
    Receipt,
    Wallet,
} from "lucide-react";

import EmployeeStatCard from "./EmployeeStatCard";

export default function EmployeeStatsGrid({
    stats,
    loading,
}) {

    /*
    |--------------------------------------------------------------------------
    | LOADING STATE
    |--------------------------------------------------------------------------
    */
    if (loading) {

        return (
            <div
                className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-6
                    shadow-sm
                "
            >

                <div className="mb-6">

                    <div
                        className="
                            h-6
                            w-52
                            animate-pulse
                            rounded-lg
                            bg-slate-200
                        "
                    />

                    <div
                        className="
                            mt-3
                            h-4
                            w-72
                            animate-pulse
                            rounded-lg
                            bg-slate-200
                        "
                    />
                </div>

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    {[...Array(4)].map((_, index) => (

                        <div
                            key={index}
                            className="
                                h-[180px]
                                animate-pulse
                                rounded-3xl
                                bg-slate-200
                            "
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className="
                rounded-3xl
                border
                border-slate-200
                bg-slate-50
                p-6
                shadow-sm
            "
        >

            {/* =====================================================
                HEADER
            ===================================================== */}
            <div className="mb-6">

                <h2
                    className="
                        text-lg
                        font-semibold
                        text-slate-900
                    "
                >
                    Pending Requests
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Overview of active employee requests.
                </p>
            </div>

            {/* =====================================================
                STATS GRID
            ===================================================== */}
            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                <EmployeeStatCard
                    title="Pending Leaves"
                    value={stats.pendingLeaves}
                    description="Awaiting approval"
                    icon={CalendarDays}
                    iconClass="
                        bg-blue-500/15
                        text-blue-500
                    "
                />

                <EmployeeStatCard
                    title="Pending Overtime"
                    value={stats.pendingOvertime}
                    description="Filed overtime requests"
                    icon={Clock3}
                    iconClass="
                        bg-amber-500/15
                        text-amber-500
                    "
                />

                <EmployeeStatCard
                    title="Liquidations"
                    value={stats.pendingLiquidations}
                    description="For checking/review"
                    icon={Wallet}
                    iconClass="
                        bg-cyan-500/15
                        text-cyan-500
                    "
                />

                <EmployeeStatCard
                    title="Requisitions"
                    value={stats.pendingRequisitions}
                    description="Active requests"
                    icon={Receipt}
                    iconClass="
                        bg-purple-500/15
                        text-purple-500
                    "
                />
            </div>
        </div>
    );
}