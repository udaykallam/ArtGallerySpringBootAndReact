package com.artgallery.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AdminSupportMessageResponse {

    private Long id;

    private String message;

    private LocalDateTime createdAt;

    // =====================================================
    // SENDER
    // =====================================================

    private Long senderId;

    private String senderName;

    private String senderEmail;

    private String senderRole;
}