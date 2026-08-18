import axiosClient from "../api/axiosClient";


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

export const getNotifications = async () => {

    const response = await axiosClient.get(
        "/notifications"
    );

    return response.data;
};


// ==========================================
// GET UNREAD NOTIFICATIONS
// ==========================================

export const getUnreadNotifications = async () => {

    const response = await axiosClient.get(
        "/notifications/unread"
    );

    return response.data;
};


// ==========================================
// GET UNREAD COUNT
// ==========================================

export const getUnreadCount = async () => {

    const response = await axiosClient.get(
        "/notifications/unread/count"
    );

    return response.data;
};


// ==========================================
// MARK ONE AS READ
// ==========================================

export const markNotificationAsRead = async (
    notificationId
) => {

    const response = await axiosClient.put(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};


// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead = async () => {

    const response = await axiosClient.put(
        "/notifications/read-all"
    );

    return response.data;
};