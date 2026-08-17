package com.artgallery.dto;

import lombok.Data;

@Data
public class UpdateNotificationSettingsRequest {

    private boolean orderNotifications;

    private boolean emailNotifications;

    private boolean promotionalEmails;
}