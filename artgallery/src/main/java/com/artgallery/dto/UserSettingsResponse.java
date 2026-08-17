package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSettingsResponse {

    private boolean orderNotifications;

    private boolean emailNotifications;

    private boolean promotionalEmails;
}