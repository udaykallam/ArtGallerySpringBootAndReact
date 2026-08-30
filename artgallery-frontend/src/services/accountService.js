import axiosClient from "../api/axiosClient";

export const deactivateAccount = async () => {

    const response =
        await axiosClient.put(
            "/account/deactivate"
        );

    return response.data;
};

export const deleteAccount = async () => {

    const response =
        await axiosClient.delete(
            "/account"
        );

    return response.data;
};