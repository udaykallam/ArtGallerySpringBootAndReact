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

export const addReview = async (artworkId, review) => {

    const response = await axiosClient.post(
        `/reviews/${artworkId}`,
        review
    );

    return response.data;

};

export const updateReview = async (reviewId, review) => {

    const response = await axiosClient.put(
        `/reviews/${reviewId}`,
        review
    );

    return response.data;

};

export const deleteReview = async (reviewId) => {

    const response = await axiosClient.delete(
        `/reviews/${reviewId}`
    );

    return response.data;

};