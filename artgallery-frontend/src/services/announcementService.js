import axiosClient from "../api/axiosClient";


// ==========================================
// GET ANNOUNCEMENT HISTORY
// ==========================================

export const getAnnouncements = async () => {

    const response =
        await axiosClient.get(
            "/admin/announcements"
        );

    return response.data;
};


// ==========================================
// SEND ANNOUNCEMENT
// ==========================================

export const sendAnnouncement = async (
    data
) => {

    const response =
        await axiosClient.post(
            "/admin/announcements",
            data
        );

    return response.data;
};