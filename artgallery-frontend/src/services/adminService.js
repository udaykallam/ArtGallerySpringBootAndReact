import axiosClient from "../api/axiosClient";

export const getAdminDashboard = async () => {
    const response = await axiosClient.get("/admin/dashboard");
    return response.data;
};

export const getCategories = async () => {
    const response = await axiosClient.get("/admin/categories");
    return response.data;
};

export const createCategory = async (data) => {
    const response = await axiosClient.post(
        "/admin/categories",
        data
    );
    return response.data;
};

export const updateCategory = async (
    id,
    data
) => {
    const response = await axiosClient.put(
        `/admin/categories/${id}`,
        data
    );
    return response.data;
};

export const deleteCategory = async (
    id
) => {
    const response = await axiosClient.delete(
        `/admin/categories/${id}`
    );
    return response.data;
};

export const getUsers = async () => {

    const response =
        await axiosClient.get(
            "/admin/users"
        );

    return response.data;
};

export const blockUser = async (
    id
) => {

    const response =
        await axiosClient.put(
            `/admin/users/${id}/block`
        );

    return response.data;
};

export const activateUser = async (
    id
) => {

    const response =
        await axiosClient.put(
            `/admin/users/${id}/activate`
        );

    return response.data;
};

export const deleteUser = async (
    id
) => {

    const response =
        await axiosClient.delete(
            `/admin/users/${id}`
        );

    return response.data;
};

export const getAdminArtworks = async () => {

    const response =
        await axiosClient.get(
            "/admin/artworks"
        );

    return response.data;
};

export const featureArtwork = async (
    id
) => {

    const response =
        await axiosClient.put(
            `/admin/artworks/${id}/feature`
        );

    return response.data;
};

export const unfeatureArtwork = async (
    id
) => {

    const response =
        await axiosClient.put(
            `/admin/artworks/${id}/unfeature`
        );

    return response.data;
};

export const overridePrice = async (
    id,
    price
) => {

    const response =
        await axiosClient.put(
            `/admin/artworks/${id}/override-price`,
            {
                price
            }
        );

    return response.data;
};

export const removeArtwork = async (
    id
) => {

    const response =
        await axiosClient.delete(
            `/admin/artworks/${id}`
        );

    return response.data;
};

export const getAdminOrders = async () => {

    const response =
        await axiosClient.get(
            "/admin/orders"
        );

    return response.data;
};

export const updateOrderStatus = async (
    id,
    status
) => {

    const response =
        await axiosClient.put(
            `/admin/orders/${id}`,
            {
                status
            }
        );

    return response.data;
};