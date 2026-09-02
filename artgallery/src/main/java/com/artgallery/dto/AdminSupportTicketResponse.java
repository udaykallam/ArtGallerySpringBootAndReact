package com.artgallery.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class AdminSupportTicketResponse {

    private Long id;

    private String subject;

    private String category;

    private Long orderId;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =====================================================
    // CUSTOMER
    // =====================================================

    private Long customerId;

    private String customerName;

    private String customerEmail;

    // =====================================================
    // MESSAGES
    // =====================================================

    private List<AdminSupportMessageResponse> messages;
}