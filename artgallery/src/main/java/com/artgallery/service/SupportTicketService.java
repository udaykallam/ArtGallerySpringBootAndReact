package com.artgallery.service;

import com.artgallery.dto.SupportMessageRequest;
import com.artgallery.dto.SupportTicketRequest;
import com.artgallery.dto.SupportTicketResponse;

import java.util.List;

public interface SupportTicketService {

    SupportTicketResponse createTicket(
            String email,
            SupportTicketRequest request
    );

    List<SupportTicketResponse> getMyTickets(
            String email
    );

    SupportTicketResponse getMyTicket(
            String email,
            Long ticketId
    );

    void addMessage(
            String email,
            Long ticketId,
            SupportMessageRequest request
    );
}