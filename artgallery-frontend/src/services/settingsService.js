import axiosClient from "../api/axiosClient";

export const getSettings = async () => {

    const response = await axiosClient.get(
        "/settings"
    );

    return response.data;
};


export const updateNotificationSettings = async (
    settings
) => {

    const response = await axiosClient.put(
        "/settings/notifications",
        settings
    );

    return response.data;
};