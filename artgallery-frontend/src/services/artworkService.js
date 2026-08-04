import axiosClient from "../api/axiosClient";

export const getArtworks = async (
    page = 0,
    size = 8
) => {

    const response = await axiosClient.get(
        `/artworks?page=${page}&size=${size}`
    );

    return response.data;
};