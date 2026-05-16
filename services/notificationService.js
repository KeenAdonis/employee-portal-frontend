import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| GET ALL NOTIFICATIONS
|--------------------------------------------------------------------------
*/
export const getNotifications = async () => {

    const response = await api.get("/notifications");

    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET UNREAD COUNT
|--------------------------------------------------------------------------
*/
export const getUnreadNotificationCount = async () => {

    const response = await api.get(
        "/notifications/unread-count"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| MARK SINGLE AS READ
|--------------------------------------------------------------------------
*/
export const markNotificationAsRead = async (id) => {

    const response = await api.patch(
        `/notifications/${id}/read`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| MARK ALL AS READ
|--------------------------------------------------------------------------
*/
export const markAllNotificationsAsRead = async () => {

    const response = await api.patch(
        "/notifications/read-all"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE NOTIFICATION
|--------------------------------------------------------------------------
*/
export const deleteNotification = async (id) => {

    const response = await api.delete(
        `/notifications/${id}`
    );

    return response.data;
};