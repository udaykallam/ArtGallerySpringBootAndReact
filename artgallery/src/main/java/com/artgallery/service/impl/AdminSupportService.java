package com.artgallery.service.impl;

import com.artgallery.dto.AdminSupportMessageResponse;
import com.artgallery.dto.AdminSupportTicketResponse;
import com.artgallery.dto.SupportMessageRequest;
import com.artgallery.entity.SupportMessage;
import com.artgallery.entity.SupportTicket;
import com.artgallery.entity.User;
import com.artgallery.repository.SupportMessageRepository;
import com.artgallery.repository.SupportTicketRepository;
import com.artgallery.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminSupportService {

    @Autowired
    private SupportTicketRepository supportTicketRepo;

    @Autowired
    private SupportMessageRepository supportMessageRepo;

    @Autowired
    private UserRepository userRepo;


    // =====================================================
    // GET ALL TICKETS
    // =====================================================

    public List<AdminSupportTicketResponse> getAllTickets() {

        return supportTicketRepo
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // GET SINGLE TICKET
    // =====================================================

    public AdminSupportTicketResponse getTicket(
            Long ticketId
    ) {

        SupportTicket ticket =
                supportTicketRepo.findById(ticketId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Support ticket not found"
                                        )
                        );

        return toResponse(ticket);
    }


    // =====================================================
    // ADMIN REPLY
    // =====================================================

    @Transactional
    public String replyToTicket(
            Long ticketId,
            String adminEmail,
            SupportMessageRequest request
    ) {

        SupportTicket ticket =
                supportTicketRepo.findById(ticketId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Support ticket not found"
                                        )
                        );


        if (
                request == null ||
                        request.getMessage() == null ||
                        request.getMessage().trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Message cannot be empty"
            );
        }


        User admin =
                userRepo.findByEmail(adminEmail)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Admin user not found"
                                        )
                        );


        SupportMessage message =
                new SupportMessage();

        message.setTicket(ticket);

        message.setSender(admin);

        message.setMessage(
                request.getMessage().trim()
        );

        supportMessageRepo.save(message);


        // -------------------------------------------------
        // Automatically move ticket back to IN_PROGRESS
        // -------------------------------------------------

        if (
                "CLOSED".equalsIgnoreCase(
                        ticket.getStatus()
                ) ||
                        "RESOLVED".equalsIgnoreCase(
                                ticket.getStatus()
                        )
        ) {

            ticket.setStatus("IN_PROGRESS");
        }


        ticket.setUpdatedAt(
                java.time.LocalDateTime.now()
        );

        supportTicketRepo.save(ticket);


        return "Reply sent successfully";
    }


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    @Transactional
    public String updateTicketStatus(
            Long ticketId,
            String status
    ) {

        SupportTicket ticket =
                supportTicketRepo.findById(ticketId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Support ticket not found"
                                        )
                        );


        if (
                status == null ||
                        status.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Status cannot be empty"
            );
        }


        String normalizedStatus =
                status.trim().toUpperCase();


        if (
                !normalizedStatus.equals("OPEN") &&
                        !normalizedStatus.equals("IN_PROGRESS") &&
                        !normalizedStatus.equals("RESOLVED") &&
                        !normalizedStatus.equals("CLOSED")
        ) {

            throw new RuntimeException(
                    "Invalid support ticket status"
            );
        }


        ticket.setStatus(
                normalizedStatus
        );

        ticket.setUpdatedAt(
                java.time.LocalDateTime.now()
        );

        supportTicketRepo.save(ticket);


        return "Support ticket status updated";
    }


    // =====================================================
    // ENTITY → DTO
    // =====================================================

    private AdminSupportTicketResponse toResponse(
            SupportTicket ticket
    ) {

        AdminSupportTicketResponse dto =
                new AdminSupportTicketResponse();


        dto.setId(
                ticket.getId()
        );

        dto.setSubject(
                ticket.getSubject()
        );

        dto.setCategory(
                ticket.getCategory()
        );

        dto.setOrderId(
                ticket.getOrderId()
        );

        dto.setStatus(
                ticket.getStatus()
        );

        dto.setCreatedAt(
                ticket.getCreatedAt()
        );

        dto.setUpdatedAt(
                ticket.getUpdatedAt()
        );


        // =================================================
        // CUSTOMER
        // =================================================

        if (ticket.getUser() != null) {

            dto.setCustomerId(
                    ticket.getUser().getId()
            );

            dto.setCustomerName(
                    ticket.getUser().getName()
            );

            dto.setCustomerEmail(
                    ticket.getUser().getEmail()
            );
        }


        // =================================================
        // MESSAGES
        // =================================================

        List<SupportMessage> messages =
                supportMessageRepo
                        .findByTicketOrderByCreatedAtAsc(
                                ticket
                        );


        dto.setMessages(
                messages
                        .stream()
                        .map(this::toMessageResponse)
                        .toList()
        );


        return dto;
    }


    // =====================================================
    // MESSAGE → DTO
    // =====================================================

    private AdminSupportMessageResponse toMessageResponse(
            SupportMessage message
    ) {

        AdminSupportMessageResponse dto =
                new AdminSupportMessageResponse();


        dto.setId(
                message.getId()
        );

        dto.setMessage(
                message.getMessage()
        );

        dto.setCreatedAt(
                message.getCreatedAt()
        );


        if (message.getSender() != null) {

            User sender =
                    message.getSender();

            dto.setSenderId(
                    sender.getId()
            );

            dto.setSenderName(
                    sender.getName()
            );

            dto.setSenderEmail(
                    sender.getEmail()
            );


            if (
                    sender.getRole() != null
            ) {

                dto.setSenderRole(
                        sender.getRole()
                                .getName()
                                .name()
                );
            }
        }


        return dto;
    }
}