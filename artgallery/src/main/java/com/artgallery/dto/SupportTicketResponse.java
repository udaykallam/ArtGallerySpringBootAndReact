package com.artgallery.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class SupportTicketResponse {

    private Long id;

    private String subject;

    private String category;

    private Long orderId;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<SupportMessageResponse> messages;
}