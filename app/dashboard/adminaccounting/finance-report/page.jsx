"use client";

import { useState } from "react";

import ReportsHeader from "@/components/adminaccounting/ReportsHeader";
import LiquidationSummaryGrid from "@/components/adminaccounting/LiquidationSummaryGrid";
import ApprovedAmountsByType from "@/components/adminaccounting/ApprovedAmountsByType";
import MonthlyTrendChart from "@/components/adminaccounting/MonthlyTrendChart";
import FinancialSummaryTable from "@/components/adminaccounting/FinancialSummaryTable";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import useAccountingReportsData from "@/utils/useAccountingReportsData";

export default function Page() {

    const [selectedYear, setSelectedYear] =
        useState(
            new Date().getFullYear()
        );

    /*
    |--------------------------------------------------------------------------
    | REPORTS DATA
    |--------------------------------------------------------------------------
    */
    const {

        loading,
        approvedAmounts,
        liquidationSummary,
        monthlyTrend,
        financialSummary,

    } = useAccountingReportsData(
        selectedYear
    );



    /*
    |--------------------------------------------------------------------------
    | AUTH USER
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
            <ReportsHeader
                user={user}
            />

            {/* APPROVED AMOUNTS */}
            <ApprovedAmountsByType
                approvedAmounts={
                    approvedAmounts
                }
                loading={loading}
            />

            {/* LIQUIDATION SUMMARY */}
            <LiquidationSummaryGrid
                liquidationSummary={
                    liquidationSummary
                }
                loading={loading}
            />

            {/* MONTHLY TREND */}
            <MonthlyTrendChart
                monthlyTrend={
                    monthlyTrend
                }
                loading={loading}

                selectedYear={
                    selectedYear
                }

                setSelectedYear={
                    setSelectedYear
                }
            />

            {/* FINANCIAL SUMMARY TABLE */}
            <FinancialSummaryTable
                financialSummary={
                    financialSummary
                }
                loading={loading}
            />

        </div>
    );
}