"use client";

import {
    useEffect,
    useState,
} from "react";

import {

    getApprovedAmountsByType,

    getLiquidationSummary,

    getMonthlyFinancialTrend,

    getFinancialSummaryTable,

} from "@/services/accountingReportsService";

export default function useAccountingReportsData() {

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */
    const [loading, setLoading] = useState(true);

    const [approvedAmounts, setApprovedAmounts] = useState({

        cashAdvance: 0,

        pettyCash: 0,

        reimbursement: 0,

        requestForPayment: 0,

    });

    const [liquidationSummary, setLiquidationSummary] = useState({

        totalExpenses: 0,

        totalReturned: 0,

        totalReimbursement: 0,

        pendingLiquidations: 0,

    });

    const [monthlyTrend, setMonthlyTrend] = useState([]);

    const [financialSummary, setFinancialSummary] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | FETCH REPORTS DATA
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        const fetchReportsData = async () => {

            try {

                setLoading(true);

                const [

                    approvedAmountsRes,

                    liquidationSummaryRes,

                    monthlyTrendRes,

                    financialSummaryRes,

                ] = await Promise.all([

                    getApprovedAmountsByType(),

                    getLiquidationSummary(),

                    getMonthlyFinancialTrend(),

                    getFinancialSummaryTable(),

                ]);

                /*
                |--------------------------------------------------------------------------
                | APPROVED AMOUNTS
                |--------------------------------------------------------------------------
                */
                setApprovedAmounts({

                    cashAdvance:
                        approvedAmountsRes.cash_advance || 0,

                    pettyCash:
                        approvedAmountsRes.petty_cash || 0,

                    reimbursement:
                        approvedAmountsRes.reimbursement || 0,

                    requestForPayment:
                        approvedAmountsRes.request_for_payment || 0,

                });

                /*
                |--------------------------------------------------------------------------
                | LIQUIDATION SUMMARY
                |--------------------------------------------------------------------------
                */
                setLiquidationSummary({

                    totalExpenses:
                        liquidationSummaryRes.total_expenses || 0,

                    totalReturned:
                        liquidationSummaryRes.total_returned || 0,

                    totalReimbursement:
                        liquidationSummaryRes.total_reimbursement || 0,

                    pendingLiquidations:
                        liquidationSummaryRes.pending_liquidations || 0,

                });

                /*
                |--------------------------------------------------------------------------
                | MONTHLY TREND
                |--------------------------------------------------------------------------
                */
                setMonthlyTrend(
                    monthlyTrendRes || []
                );

                /*
                |--------------------------------------------------------------------------
                | FINANCIAL SUMMARY TABLE
                |--------------------------------------------------------------------------
                */
                setFinancialSummary(
                    financialSummaryRes || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch accounting reports:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchReportsData();

    }, []);

    return {

        loading,

        approvedAmounts,

        liquidationSummary,

        monthlyTrend,

        financialSummary,

    };
}