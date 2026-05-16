import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| GET EMPLOYEE DASHBOARD
|--------------------------------------------------------------------------
*/
export const getEmployeeDashboard =
    async () => {

        const response = await api.get(
            "/employee/dashboard"
        );

        return response.data;
    };