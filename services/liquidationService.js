import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| GET ACCOUNTING LIQUIDATION STATS
|--------------------------------------------------------------------------
*/
export const getAccountingLiquidationStats = async () => {

    const response = await api.get(
        "/accounting/liquidations/stats"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET RECENT LIQUIDATIONS
|--------------------------------------------------------------------------
*/
export const getRecentLiquidations = async () => {

    const response = await api.get(
        "/accounting/liquidations/recent"
    );

    return response.data;
};