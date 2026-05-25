import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| APPROVED AMOUNTS BY TYPE
|--------------------------------------------------------------------------
*/
export const getApprovedAmountsByType = async () => {

    const response = await api.get(
        "/accounting/reports/approved-amounts-by-type"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| LIQUIDATION SUMMARY
|--------------------------------------------------------------------------
*/
export const getLiquidationSummary = async () => {

    const response = await api.get(
        "/accounting/reports/liquidation-summary"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| MONTHLY FINANCIAL TREND
|--------------------------------------------------------------------------
*/
export const getMonthlyFinancialTrend = async (
    year
) => {

    const response = await api.get(
        `/accounting/reports/monthly-financial-trend?year=${year}`
    );

    return response.data.data;
};

/*
|--------------------------------------------------------------------------
| FINANCIAL SUMMARY TABLE
|--------------------------------------------------------------------------
*/
export const getFinancialSummaryTable = async () => {

    const response = await api.get(
        "/accounting/reports/financial-summary"
    );

    return response.data;
};