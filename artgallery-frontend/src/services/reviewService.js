import axiosClient from "../api/axiosClient";

export const getReviews = async (artworkId) => {

    const response = await axiosClient.get(
        `/reviews/${artworkId}`
    );

    return response.data;
};

export const getReviewSummary = async (artworkId) => {

    const response = await axiosClient.get(
        `/reviews/${artworkId}/summary`
    );

    return response.data;
};

export const addReview = async (
    artworkId,
    data
) => {

    const response = await axiosClient.post(
        `/reviews/${artworkId}`,
        data
    );

    return response.data;
};

export const updateReview = async (
    reviewId,
    data
) => {

    const response = await axiosClient.put(
        `/reviews/${reviewId}`,
        data
    );

    return response.data;
};

export const deleteReview = async (
    reviewId
) => {

    const response = await axiosClient.delete(
        `/reviews/${reviewId}`
    );

    return response.data;
};