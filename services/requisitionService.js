import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| GET ACCOUNTING REQUISITION STATS
|--------------------------------------------------------------------------
*/
export const getAccountingRequisitionStats = async () => {

    const response = await api.get(
        "/accounting/requisitions/stats"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET RECENT REQUISITIONS
|--------------------------------------------------------------------------
*/
export const getRecentRequisitions = async () => {

    const response = await api.get(
        "/accounting/requisitions/recent"
    );

    return response.data;
};