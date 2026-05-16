import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| GET EMPLOYEE PROFILE
|--------------------------------------------------------------------------
*/
export const getEmployeeProfile = async () => {

    const response = await api.get(
        "/employee/profile"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPLOAD PROFILE AVATAR
|--------------------------------------------------------------------------
*/
export const uploadProfileAvatar = async (formData) => {

    const response = await api.post(
        "/employee/profile/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};