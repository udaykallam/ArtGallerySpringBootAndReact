package com.artgallery.controller;

import com.artgallery.dto.SupportMessageRequest;
import com.artgallery.dto.SupportTicketRequest;
import com.artgallery.dto.SupportTicketResponse;
import com.artgallery.service.SupportTicketService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {


    private final SupportTicketService supportTicketService;


    // =====================================================
    // CREATE SUPPORT TICKET
    // =====================================================

    @PostMapping("/tickets")
    public ResponseEntity<?> createTicket(
            @RequestBody SupportTicketRequest request,
            Principal principal
    ) {

        try {

            SupportTicketResponse ticket =
                    supportTicketService.createTicket(
                            principal.getName(),
                            request
                    );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Support ticket created successfully.",

                            "ticketId",
                            ticket.getId()
                    )
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    ex.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // GET MY SUPPORT TICKETS
    // =====================================================

    @GetMapping("/tickets")
    public ResponseEntity<?> getMyTickets(
            Principal principal
    ) {

        try {

            List<SupportTicketResponse> tickets =
                    supportTicketService.getMyTickets(
                            principal.getName()
                    );


            return ResponseEntity.ok(
                    tickets
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    ex.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // GET SINGLE SUPPORT TICKET
    // =====================================================

    @GetMapping("/tickets/{ticketId}")
    public ResponseEntity<?> getMyTicket(
            @PathVariable Long ticketId,
            Principal principal
    ) {

        try {

            SupportTicketResponse ticket =
                    supportTicketService.getMyTicket(
                            principal.getName(),
                            ticketId
                    );


            return ResponseEntity.ok(
                    ticket
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    ex.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // ADD MESSAGE
    // =====================================================

    @PostMapping(
            "/tickets/{ticketId}/messages"
    )
    public ResponseEntity<?> addMessage(
            @PathVariable Long ticketId,
            @RequestBody SupportMessageRequest request,
            Principal principal
    ) {

        try {

            supportTicketService.addMessage(
                    principal.getName(),
                    ticketId,
                    request
            );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Message added successfully."
                    )
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    ex.getMessage()
                            )
                    );
        }
    }
}