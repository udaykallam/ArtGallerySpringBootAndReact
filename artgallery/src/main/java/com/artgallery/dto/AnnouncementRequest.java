package com.artgallery.dto;

import lombok.Data;

@Data
public class AnnouncementRequest {

    private String title;

    private String message;

    private String type;

    private String recipientType;

    private boolean createWebNotification = true;
}