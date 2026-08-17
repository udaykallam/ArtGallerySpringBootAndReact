package com.artgallery.service.impl;

import com.artgallery.dto.UpdateNotificationSettingsRequest;
import com.artgallery.dto.UserSettingsResponse;
import com.artgallery.entity.User;
import com.artgallery.entity.UserSettings;
import com.artgallery.repository.UserRepository;
import com.artgallery.repository.UserSettingsRepository;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserRepository userRepo;

    private final UserSettingsRepository settingsRepo;


    @Transactional
    public UserSettingsResponse getSettings(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        UserSettings settings =
                settingsRepo.findByUser(user)
                        .orElseGet(() ->
                                createDefaultSettings(user)
                        );

        return toResponse(settings);
    }


    @Transactional
    public UserSettingsResponse updateNotifications(
            String email,
            UpdateNotificationSettingsRequest request
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        UserSettings settings =
                settingsRepo.findByUser(user)
                        .orElseGet(() ->
                                createDefaultSettings(user)
                        );

        settings.setOrderNotifications(
                request.isOrderNotifications()
        );

        settings.setEmailNotifications(
                request.isEmailNotifications()
        );

        settings.setPromotionalEmails(
                request.isPromotionalEmails()
        );

        settingsRepo.save(settings);

        return toResponse(settings);
    }


    private UserSettings createDefaultSettings(
            User user
    ) {

        UserSettings settings =
                new UserSettings();

        settings.setUser(user);

        settings.setOrderNotifications(true);

        settings.setEmailNotifications(true);

        settings.setPromotionalEmails(false);

        return settingsRepo.save(settings);
    }


    private UserSettingsResponse toResponse(
            UserSettings settings
    ) {

        return new UserSettingsResponse(
                settings.isOrderNotifications(),
                settings.isEmailNotifications(),
                settings.isPromotionalEmails()
        );
    }
}