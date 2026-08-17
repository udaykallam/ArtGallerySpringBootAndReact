package com.artgallery.controller;

import com.artgallery.dto.UpdateNotificationSettingsRequest;
import com.artgallery.dto.UserSettingsResponse;
import com.artgallery.service.impl.UserSettingsService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserSettingsService settingsService;


    @GetMapping
    public ResponseEntity<UserSettingsResponse> getSettings(
            Principal principal
    ) {

        return ResponseEntity.ok(
                settingsService.getSettings(
                        principal.getName()
                )
        );
    }


    @PutMapping("/notifications")
    public ResponseEntity<UserSettingsResponse>
    updateNotifications(

            @RequestBody
            UpdateNotificationSettingsRequest request,

            Principal principal
    ) {

        return ResponseEntity.ok(
                settingsService.updateNotifications(
                        principal.getName(),
                        request
                )
        );
    }
}