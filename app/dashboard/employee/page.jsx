"use client";

import EmployeeDashboardHeader from "@/components/dashboard/employee/EmployeeDashboardHeader";

import EmployeeBirthdayBanner from "@/components/dashboard/employee/EmployeeBirthdayBanner";

import EmployeeLeaveCredits from "@/components/dashboard/employee/credits/EmployeeLeaveCredits";

import EmployeeStatsGrid from "@/components/dashboard/employee/stats/EmployeeStatsGrid";

import EmployeeQuickActions from "@/components/dashboard/employee/EmployeeQuickActions";

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

import useEmployeeDashboardData from "@/utils/useEmployeeDashboardData";

/* ADD THESE */
import RecentLeavesSection from "@/components/dashboard/adminhr/leaves/RecentLeavesSection";

import RecentOvertimeSection from "@/components/dashboard/adminhr/overtime/RecentOvertimeSection";

export default function EmployeeDashboardPage() {

    const {
        stats,
        loading,
        employee,
        leaveCredits,
        todayLeaves,
        todayOvertimes,
    } = useEmployeeDashboardData();

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

            {/* NEW SECTION */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                <RecentLeavesSection
                    leaves={todayLeaves}
                />

                <RecentOvertimeSection
                    overtimes={todayOvertimes}
                />

            </div>

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