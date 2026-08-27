package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AnnouncementResponse {

    private Long id;

    private String title;

    private String message;

    private String type;

    private String recipientType;

    private LocalDateTime createdAt;

    private String createdBy;

}