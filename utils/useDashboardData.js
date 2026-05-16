"use client";

import { useEffect, useState } from "react";

import { getDashboardStats } from "@/services/dashboardService";

export default function useDashboardData() {

    /*
    |--------------------------------------------------------------------------
    | STATES
    |--------------------------------------------------------------------------
    */
    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | FETCH DASHBOARD DATA
    |--------------------------------------------------------------------------
    */
    const fetchDashboardData = async () => {

        try {

            setLoading(true);

            const response = await getDashboardStats();

            setStats(response);

        } catch (err) {

            console.error("Dashboard fetch error:", err);

            setError(err);

        } finally {

            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | INITIAL FETCH
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        fetchDashboardData();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */
    return {
        stats,
        loading,
        error,
        refetch: fetchDashboardData,
    };
}