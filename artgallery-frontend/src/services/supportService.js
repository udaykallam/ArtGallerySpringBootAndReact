import axiosClient from "../api/axiosClient";


// =====================================================
// CREATE SUPPORT TICKET
// =====================================================

export const createSupportTicket = async (
    ticketData
) => {

    const response =
        await axiosClient.post(
            "/support/tickets",
            ticketData
        );

    return response.data;
};


// =====================================================
// GET MY SUPPORT TICKETS
// =====================================================

export const getMySupportTickets = async () => {

    const response =
        await axiosClient.get(
            "/support/tickets"
        );

    return response.data;
};


// =====================================================
// GET SINGLE SUPPORT TICKET
// =====================================================

export const getSupportTicket = async (
    ticketId
) => {

    const response =
        await axiosClient.get(
            `/support/tickets/${ticketId}`
        );

    return response.data;
};


// =====================================================
// ADD MESSAGE
// =====================================================

export const addSupportMessage = async (
    ticketId,
    message
) => {

    const response =
        await axiosClient.post(
            `/support/tickets/${ticketId}/messages`,
            {
                message
            }
        );

    return response.data;
};