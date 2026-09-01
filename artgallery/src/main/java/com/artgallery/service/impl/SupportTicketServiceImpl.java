package com.artgallery.service.impl;

import com.artgallery.dto.SupportMessageRequest;
import com.artgallery.dto.SupportMessageResponse;
import com.artgallery.dto.SupportTicketRequest;
import com.artgallery.dto.SupportTicketResponse;
import com.artgallery.entity.SupportMessage;
import com.artgallery.entity.SupportTicket;
import com.artgallery.entity.User;
import com.artgallery.repository.SupportMessageRepository;
import com.artgallery.repository.SupportTicketRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.SupportTicketService;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportTicketServiceImpl
        implements SupportTicketService {


    private final UserRepository userRepository;

    private final SupportTicketRepository ticketRepository;

    private final SupportMessageRepository messageRepository;


    // =====================================================
    // CREATE TICKET
    // =====================================================

    @Override
    @Transactional
    public SupportTicketResponse createTicket(
            String email,
            SupportTicketRequest request
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        // =================================================
        // VALIDATE SUBJECT
        // =================================================

        if (
                request.getSubject() == null ||
                        request.getSubject().trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Subject is required."
            );
        }


        // =================================================
        // VALIDATE CATEGORY
        // =================================================

        if (
                request.getCategory() == null ||
                        request.getCategory().trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Support category is required."
            );
        }


        // =================================================
        // VALIDATE MESSAGE
        // =================================================

        if (
                request.getMessage() == null ||
                        request.getMessage().trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Message is required."
            );
        }


        // =================================================
        // CREATE TICKET
        // =================================================

        SupportTicket ticket =
                new SupportTicket();

        ticket.setUser(user);

        ticket.setSubject(
                request.getSubject().trim()
        );

        ticket.setCategory(
                request.getCategory().trim()
        );

        ticket.setOrderId(
                request.getOrderId()
        );

        ticket.setStatus("OPEN");


        ticket =
                ticketRepository.save(ticket);


        // =================================================
        // CREATE INITIAL MESSAGE
        // =================================================

        SupportMessage message =
                new SupportMessage();

        message.setTicket(ticket);

        message.setSender(user);

        message.setMessage(
                request.getMessage().trim()
        );


        message =
                messageRepository.save(message);


        // =================================================
        // RETURN DTO
        // =================================================

        return convertToResponse(
                ticket,
                List.of(message)
        );
    }


    // =====================================================
    // GET MY TICKETS
    // =====================================================

    @Override
    @Transactional
    public List<SupportTicketResponse> getMyTickets(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        List<SupportTicket> tickets =
                ticketRepository
                        .findByUserOrderByCreatedAtDesc(user);


        return tickets
                .stream()
                .map(ticket ->
                        convertToResponse(
                                ticket,
                                messageRepository
                                        .findByTicketOrderByCreatedAtAsc(
                                                ticket
                                        )
                        )
                )
                .collect(Collectors.toList());
    }


    // =====================================================
    // GET SINGLE TICKET
    // =====================================================

    @Override
    @Transactional
    public SupportTicketResponse getMyTicket(
            String email,
            Long ticketId
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        SupportTicket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Support ticket not found."
                                )
                        );


        // =================================================
        // SECURITY CHECK
        // =================================================

        if (
                !ticket.getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            throw new RuntimeException(
                    "You are not authorized to view this ticket."
            );
        }


        List<SupportMessage> messages =
                messageRepository
                        .findByTicketOrderByCreatedAtAsc(
                                ticket
                        );


        return convertToResponse(
                ticket,
                messages
        );
    }


    // =====================================================
    // ADD MESSAGE
    // =====================================================

    @Override
    @Transactional
    public void addMessage(
            String email,
            Long ticketId,
            SupportMessageRequest request
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        // =================================================
        // VALIDATE MESSAGE
        // =================================================

        if (
                request.getMessage() == null ||
                        request.getMessage().trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Message cannot be empty."
            );
        }


        // =================================================
        // FIND TICKET
        // =================================================

        SupportTicket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Support ticket not found."
                                )
                        );


        // =================================================
        // SECURITY CHECK
        // =================================================

        if (
                !ticket.getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            throw new RuntimeException(
                    "You are not authorized to reply to this ticket."
            );
        }


        // =================================================
        // CLOSED TICKET
        // =================================================

        if (
                "CLOSED".equalsIgnoreCase(
                        ticket.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "This support ticket is closed."
            );
        }


        // =================================================
        // CREATE MESSAGE
        // =================================================

        SupportMessage message =
                new SupportMessage();

        message.setTicket(ticket);

        message.setSender(user);

        message.setMessage(
                request.getMessage().trim()
        );


        messageRepository.save(message);


        // =================================================
        // REOPEN TICKET
        // =================================================

        ticket.setStatus("OPEN");

        ticketRepository.save(ticket);
    }


    // =====================================================
    // CONVERT TICKET → DTO
    // =====================================================

    private SupportTicketResponse convertToResponse(
            SupportTicket ticket,
            List<SupportMessage> messages
    ) {

        SupportTicketResponse response =
                new SupportTicketResponse();


        response.setId(
                ticket.getId()
        );

        response.setSubject(
                ticket.getSubject()
        );

        response.setCategory(
                ticket.getCategory()
        );

        response.setOrderId(
                ticket.getOrderId()
        );

        response.setStatus(
                ticket.getStatus()
        );

        response.setCreatedAt(
                ticket.getCreatedAt()
        );

        response.setUpdatedAt(
                ticket.getUpdatedAt()
        );


        // =================================================
        // CONVERT MESSAGES
        // =================================================

        List<SupportMessageResponse> messageResponses =
                messages
                        .stream()
                        .map(this::convertMessage)
                        .collect(Collectors.toList());


        response.setMessages(
                messageResponses
        );


        return response;
    }


    // =====================================================
    // CONVERT MESSAGE → DTO
    // =====================================================

    private SupportMessageResponse convertMessage(
            SupportMessage message
    ) {

        SupportMessageResponse response =
                new SupportMessageResponse();


        response.setId(
                message.getId()
        );

        response.setMessage(
                message.getMessage()
        );

        response.setCreatedAt(
                message.getCreatedAt()
        );


        if (message.getSender() != null) {

            response.setSenderId(
                    message.getSender().getId()
            );

            response.setSenderName(
                    message.getSender().getName()
            );

            response.setSenderEmail(
                    message.getSender().getEmail()
            );


            response.setFromCustomer(
                    "ROLE_CUSTOMER".equals(
                            message.getSender()
                                    .getRole()
                                    .getName()
                                    .name()
                    )
            );
        }


        return response;
    }
}