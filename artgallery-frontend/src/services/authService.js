import axiosClient from "../api/axiosClient";

export const changePassword = async (data) => {

    const response = await axiosClient.post(
        "/auth/change-password",
        data
    );

    return response.data;
};