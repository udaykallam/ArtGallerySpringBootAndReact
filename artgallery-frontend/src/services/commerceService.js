import axiosClient from "../api/axiosClient";

// ================= WISHLIST =================

export const getWishlist = async () => {

    const response =
        await axiosClient.get(
            "/commerce/wishlist"
        );

    return response.data;
};


export const addToWishlist = async (
    artworkId
) => {

    return await axiosClient.post(
        `/commerce/wishlist/${artworkId}`
    );
};


export const removeFromWishlist = async (
    artworkId
) => {

    return await axiosClient.delete(
        `/commerce/wishlist/${artworkId}`
    );
};


// ================= CART =================

export const getCart = async () => {

    const response =
        await axiosClient.get("/commerce/cart");

    return Array.isArray(response.data)
        ? response.data
        : [];

};

export const addToCart = async (
    artworkId,
    quantity = 1
) => {

    return await axiosClient.post(
        "/commerce/cart",
        {
            artworkId,
            quantity
        }
    );
};


export const removeFromCart = async (
    artworkId
) => {

    return await axiosClient.delete(
        `/commerce/cart/${artworkId}`
    );
};


export const updateCartQuantity = async (
    artworkId,
    quantity
) => {

    const response =
        await axiosClient.put(
            `/commerce/cart/${artworkId}`,
            {
                quantity
            }
        );

    return response.data;
};