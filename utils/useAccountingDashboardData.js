"use client";

import { useEffect, useState } from "react";

import {
    getAccountingRequisitionStats,
    getRecentRequisitions,
} from "@/services/requisitionService";

import {
    getAccountingLiquidationStats,
    getRecentLiquidations,
} from "@/services/liquidationService";

export default function useAccountingDashboardData() {

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({

        pendingRequisitions: 0,

        forLiquidation: 0,

        overdueLiquidations: 0,

        approvedThisMonth: 0,

    });

    const [recentRequisitions, setRecentRequisitions] = useState([]);

    const [recentLiquidations, setRecentLiquidations] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | FETCH DASHBOARD DATA
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                setLoading(true);

                const [

                    requisitionStats,

                    liquidationStats,

                    requisitions,

                    liquidations,

                ] = await Promise.all([

                    getAccountingRequisitionStats(),

                    getAccountingLiquidationStats(),

                    getRecentRequisitions(),

                    getRecentLiquidations(),

                ]);

                /*
                |--------------------------------------------------------------------------
                | MERGE STATS
                |--------------------------------------------------------------------------
                */
                setStats({

                    pendingRequisitions:
                        requisitionStats.pending_requisitions || 0,

                    approvedThisMonth:
                        requisitionStats.approved_this_month || 0,

                    forLiquidation:
                        liquidationStats.for_liquidation || 0,

                    overdueLiquidations:
                        liquidationStats.overdue_liquidations || 0,

                });

                setRecentRequisitions(
                    requisitions || []
                );

                setRecentLiquidations(
                    liquidations || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch accounting dashboard:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchDashboardData();

    }, []);

    return {

        loading,

        stats,

        recentRequisitions,

        recentLiquidations,

    };
}