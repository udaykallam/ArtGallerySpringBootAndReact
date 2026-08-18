package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationResponse {

    private Long id;

    private String title;

    private String message;

    private String type;

    private boolean read;

    private LocalDateTime createdAt;
}