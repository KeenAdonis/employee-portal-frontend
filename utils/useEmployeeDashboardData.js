"use client";

import { useEffect, useState } from "react";

import {
    getEmployeeDashboard,
} from "@/services/employeeDashboardService";

export default function useEmployeeDashboardData() {

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */
    const [loading, setLoading] = useState(true);

    const [employee, setEmployee] =
        useState(null);

    const [leaveCredits, setLeaveCredits] =
        useState({});

    const [todayLeaves, setTodayLeaves] =
        useState([]);

    const [todayOvertimes, setTodayOvertimes] =
        useState([]);

    const [stats, setStats] = useState({
        pendingLeaves: 0,
        pendingOvertime: 0,
        pendingLiquidations: 0,
        pendingRequisitions: 0,
    });

    /*
    |--------------------------------------------------------------------------
    | FETCH DASHBOARD
    |--------------------------------------------------------------------------
    */
    const fetchDashboard = async () => {

        try {

            setLoading(true);
            
            const response =
                await getEmployeeDashboard();

            const data = response.data;

            console.log(data);

            /*
            |--------------------------------------------------------------------------
            | EMPLOYEE
            |--------------------------------------------------------------------------
            */
            setEmployee(data.employee);

            /*
            |--------------------------------------------------------------------------
            | LEAVE CREDITS
            |--------------------------------------------------------------------------
            */
            setLeaveCredits(
                data.leave_credits
            );

            setTodayLeaves(
                data.recent_leaves_today || []
            );

            setTodayOvertimes(
                data.recent_overtime_today || []
            );

            /*
            |--------------------------------------------------------------------------
            | STATS
            |--------------------------------------------------------------------------
            */
            setStats({

                pendingLeaves:
                    data.stats.pending_leaves,

                pendingOvertime:
                    data.stats.pending_overtime,

                pendingLiquidations:
                    data.stats.pending_liquidations,

                pendingRequisitions:
                    data.stats.pending_requisitions,
            });

        } catch (error) {

            console.error(
                "Failed to fetch employee dashboard:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        fetchDashboard();

    }, []);

    return {
        employee,
        leaveCredits,
        stats,
        loading,
        todayLeaves,
        todayOvertimes,
        refreshDashboard: fetchDashboard,
    };
}