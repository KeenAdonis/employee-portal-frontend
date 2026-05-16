"use client";

import DashboardHeader from "@/components/dashboard/adminhr/DashboardHeader";

import EmployeeStatsCard from "@/components/dashboard/adminhr/stats/EmployeeStatsCard";
import LeaveStatsCard from "@/components/dashboard/adminhr/stats/LeaveStatsCard";
import OvertimeStatsCard from "@/components/dashboard/adminhr/stats/OvertimeStatsCard";

import CompanyBreakdownSection from "@/components/dashboard/adminhr/company/CompanyBreakdownSection";
import RecentLeavesSection from "@/components/dashboard/adminhr/leaves/RecentLeavesSection";
import RecentOvertimeSection from "@/components/dashboard/adminhr/overtime/RecentOvertimeSection";
import UpcomingBirthdaysSection from "@/components/dashboard/adminhr/birthdays/UpcomingBirthdaysSection";
import UpcomingAnniversariesSection from "@/components/dashboard/adminhr/anniversaries/UpcomingAnniversariesSection";

import QuickActions from "@/components/dashboard/adminhr/QuickActions";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import RecentActivitySection from "@/components/dashboard/adminhr/activity/RecentActivitySection";

import useDashboardData from "@/utils/useDashboardData";

export default function AdminHrDashboardPage() {

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD DATA
  |--------------------------------------------------------------------------
  */
  const {
    stats,
    loading,
    error,
  } = useDashboardData();

  console.log(stats);

  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return <DashboardSkeleton />;
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR STATE
  |--------------------------------------------------------------------------
  */
  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================================================
            DASHBOARD HEADER
        ========================================================= */}
      <DashboardHeader />

      <QuickActions />

      {/* =========================================================
            STATS CARDS
        ========================================================= */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <EmployeeStatsCard
          totalEmployees={
            stats?.data?.total_employees || 0
          }
        />

        <LeaveStatsCard
          approvedLeaves={
            stats?.data?.approved_leaves || 0
          }
        />

        <OvertimeStatsCard
          approvedOvertime={
            stats?.data?.approved_overtime || 0
          }
        />

      </section>

      {/* =========================================================
            COMPANY BREAKDOWN
        ========================================================= */}
      <CompanyBreakdownSection
        companies={
          stats?.data?.employees_per_company || []
        }
        totalEmployees={
          stats?.data?.total_employees || 0
        }
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <RecentLeavesSection
          leaves={
            stats?.data?.recent_leaves || []
          }
        />

        <RecentOvertimeSection
          overtimes={
            stats?.data?.recent_overtime || []
          }
        />

      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <UpcomingBirthdaysSection
          birthdays={
            stats?.data?.upcoming_birthdays || []
          }
        />

        <UpcomingAnniversariesSection
          anniversaries={
            stats?.data?.upcoming_anniversaries || []
          }
        />

      </section>

      <RecentActivitySection
        activities={
          stats?.data?.recent_activities || []
        }
      />

    </div>
  );
}