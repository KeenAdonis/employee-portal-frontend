import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| GET DASHBOARD STATS
|--------------------------------------------------------------------------
*/
export const getDashboardStats = async () => {

    const response = await api.get("/adminhr/dashboard");

    return response.data;
};