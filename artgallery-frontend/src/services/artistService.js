import axiosClient from "../api/axiosClient";

export const getArtistDashboard = async () => {

    const response =
        await axiosClient.get(
            "/artist/dashboard"
        );

    return response.data;
};

export const getMyArtworks = async () => {

    const response =
        await axiosClient.get(
            "/artist/artworks"
        );

    return response.data;
};

export const uploadArtwork = async (
    artworkData,
    images
) => {

    const formData = new FormData();

    formData.append(
        "data",
        new Blob(
            [JSON.stringify(artworkData)],
            {
                type: "application/json"
            }
        )
    );

    images.forEach(image => {
        formData.append(
            "images",
            image
        );
    });

    const response =
        await axiosClient.post(
            "/artworks",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    return response.data;
};

export const getCategories = async () => {

    const response =
        await axiosClient.get(
            "/categories"
        );

    return response.data;
};

export const deleteArtwork = async (
    artworkId
) => {

    const response =
        await axiosClient.delete(
            `/artist/artworks/${artworkId}`
        );

    return response.data;
};

export const updateArtwork = async (
    artworkId,
    artworkData
) => {

    const response =
        await axiosClient.put(
            `/artist/artworks/${artworkId}`,
            artworkData
        );

    return response.data;
};

export const getArtworkById = async (
    artworkId
) => {

    const response =
        await axiosClient.get(
            `/artist/artworks/${artworkId}`
        );

    return response.data;
};

export const getArtistOrders = async () => {

    const response =
        await axiosClient.get(
            "/artist/orders"
        );

    return response.data;
};