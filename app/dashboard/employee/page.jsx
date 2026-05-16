"use client";

import EmployeeDashboardHeader from "@/components/dashboard/employee/EmployeeDashboardHeader";

import EmployeeBirthdayBanner from "@/components/dashboard/employee/EmployeeBirthdayBanner";

import EmployeeLeaveCredits from "@/components/dashboard/employee/credits/EmployeeLeaveCredits";

import EmployeeStatsGrid from "@/components/dashboard/employee/stats/EmployeeStatsGrid";

import EmployeeQuickActions from "@/components/dashboard/employee/EmployeeQuickActions";

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

import useEmployeeDashboardData from "@/utils/useEmployeeDashboardData";

export default function EmployeeDashboardPage() {

    const {
        stats,
        loading,
        employee,
        leaveCredits,
    } = useEmployeeDashboardData();

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
            <EmployeeDashboardHeader user={employee} />

            {/* BIRTHDAY */}
            <EmployeeBirthdayBanner
                employee={employee}
            />

            {/* QUICK ACTIONS */}
            <EmployeeQuickActions />

            {/* LEAVE CREDITS */}
            <EmployeeLeaveCredits
                leaveCredits={leaveCredits}
            />

            {/* STATS */}
            <EmployeeStatsGrid
                stats={stats}
                loading={loading}
            />

        </div>
    );
}