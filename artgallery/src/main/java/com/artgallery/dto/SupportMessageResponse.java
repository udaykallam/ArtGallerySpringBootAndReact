package com.artgallery.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SupportMessageResponse {

    private Long id;

    private String message;

    private Long senderId;

    private String senderName;

    private String senderEmail;

    private LocalDateTime createdAt;

    private boolean fromCustomer;
}