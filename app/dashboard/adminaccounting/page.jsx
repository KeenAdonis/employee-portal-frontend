"use client";

import AccountingDashboardHeader from "@/components/dashboard/adminaccounting/AccountingDashboardHeader";

import AccountingStatsGrid from "@/components/dashboard/adminaccounting/AccountingStatsGrid";

import AccountingQuickActions from "@/components/dashboard/adminaccounting/AccountingQuickActions";

import RecentRequisitionsCard from "@/components/dashboard/adminaccounting/RecentRequisitionsCard";

import RecentLiquidationsCard from "@/components/dashboard/adminaccounting/RecentLiquidationsCard";

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

import useAccountingDashboardData from "@/utils/useAccountingDashboardData";

export default function AdminAccountingDashboardPage() {

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD DATA
    |--------------------------------------------------------------------------
    */
    const {

        loading,

        stats,

        recentRequisitions,

        recentLiquidations,

    } = useAccountingDashboardData();

    /*
    |--------------------------------------------------------------------------
    | MOCK USER
    |--------------------------------------------------------------------------
    | Replace this with your authenticated user
    |--------------------------------------------------------------------------
    */
    const user = {
        name: "Accounting Admin",
    };

    /*
    |--------------------------------------------------------------------------
    | LOADING STATE
    |--------------------------------------------------------------------------
    */
    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <AccountingDashboardHeader
                user={user}
            />

            {/* STATS */}
            <AccountingStatsGrid
                stats={stats}
                loading={loading}
            />

            {/* QUICK ACTIONS */}
            <AccountingQuickActions />

            {/* RECENT CARDS */}
            <div
                className="
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-2
                "
            >

                <RecentRequisitionsCard
                    requisitions={recentRequisitions}
                    loading={loading}
                />

                <RecentLiquidationsCard
                    liquidations={recentLiquidations}
                    loading={loading}
                />

            </div>

        </div>
    );
}