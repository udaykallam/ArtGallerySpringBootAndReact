package com.artgallery.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportTicketRequest {

    private String subject;

    private String category;

    private Long orderId;

    private String message;
}