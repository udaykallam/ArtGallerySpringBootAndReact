package com.artgallery.service.impl;

import com.artgallery.dto.AnnouncementRequest;
import com.artgallery.dto.AnnouncementResponse;
import com.artgallery.entity.Announcement;
import com.artgallery.entity.User;
import com.artgallery.entity.UserSettings;
import com.artgallery.enums.AnnouncementRecipient;
import com.artgallery.enums.AnnouncementType;
import com.artgallery.enums.NotificationType;
import com.artgallery.repository.AnnouncementRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.repository.UserSettingsRepository;
import com.artgallery.service.EmailService;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepo;

    private final UserRepository userRepo;

    private final UserSettingsRepository settingsRepo;

    private final NotificationService notificationService;

    private final EmailService emailService;


    // =====================================================
    // SEND ANNOUNCEMENT
    // =====================================================

    @Transactional
    public AnnouncementResponse sendAnnouncement(
            AnnouncementRequest request,
            String adminEmail
    ) {

        // =================================================
        // FIND ADMIN
        // =================================================

        User admin =
                userRepo.findByEmail(adminEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admin not found."
                                )
                        );


        // =================================================
        // VALIDATE TYPE
        // =================================================

        if (request.getType() == null ||
                request.getType().isBlank()) {

            throw new RuntimeException(
                    "Announcement type is required."
            );
        }

        AnnouncementType type;

        try {

            type =
                    AnnouncementType.valueOf(
                            request.getType()
                                    .toUpperCase()
                    );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid announcement type."
            );
        }


        // =================================================
        // VALIDATE RECIPIENT
        // =================================================

        if (request.getRecipientType() == null ||
                request.getRecipientType().isBlank()) {

            throw new RuntimeException(
                    "Recipient type is required."
            );
        }

        AnnouncementRecipient recipientType;

        try {

            recipientType =
                    AnnouncementRecipient.valueOf(
                            request.getRecipientType()
                                    .toUpperCase()
                    );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid recipient type."
            );
        }


        // =================================================
        // VALIDATE TITLE
        // =================================================

        if (request.getTitle() == null ||
                request.getTitle().isBlank()) {

            throw new RuntimeException(
                    "Announcement title is required."
            );
        }


        // =================================================
        // VALIDATE MESSAGE
        // =================================================

        if (request.getMessage() == null ||
                request.getMessage().isBlank()) {

            throw new RuntimeException(
                    "Announcement message is required."
            );
        }


        // =================================================
        // CREATE ANNOUNCEMENT
        // =================================================

        Announcement announcement =
                new Announcement();

        announcement.setTitle(
                request.getTitle().trim()
        );

        announcement.setMessage(
                request.getMessage().trim()
        );

        announcement.setType(
                type.name()
        );

        announcement.setRecipientType(
                recipientType.name()
        );

        announcement.setCreatedAt(
                LocalDateTime.now()
        );

        announcement.setCreatedBy(
                admin
        );


        Announcement saved =
                announcementRepo.save(
                        announcement
                );


        // =================================================
        // FIND RECIPIENTS
        // =================================================

        List<User> users =
                userRepo.findAll()
                        .stream()
                        .filter(User::isEnabled)
                        .filter(user ->
                                isRecipient(
                                        user,
                                        recipientType
                                )
                        )
                        .toList();


        // =================================================
        // SEND TO USERS
        // =================================================

        for (User user : users) {

            sendToUser(
                    user,
                    type,
                    request
            );
        }


        return toResponse(saved);
    }


    // =====================================================
    // CHECK RECIPIENT
    // =====================================================

    private boolean isRecipient(
            User user,
            AnnouncementRecipient recipientType
    ) {

        if (user.getRole() == null) {
            return false;
        }

        String role =
                user.getRole()
                        .getName()
                        .name();


        return switch (recipientType) {

            case ALL ->
                    role.equals("ROLE_CUSTOMER")
                            ||
                            role.equals("ROLE_ARTIST");

            case CUSTOMERS ->
                    role.equals("ROLE_CUSTOMER");

            case ARTISTS ->
                    role.equals("ROLE_ARTIST");
        };
    }


    // =====================================================
    // SEND TO ONE USER
    // =====================================================

    private void sendToUser(
            User user,
            AnnouncementType type,
            AnnouncementRequest request
    ) {

        UserSettings settings =
                settingsRepo.findByUser(user)
                        .orElse(null);


        // =================================================
        // WEB NOTIFICATION
        // =================================================

        if (request.isCreateWebNotification()) {

            notificationService.createNotification(

                    user.getId(),

                    request.getTitle(),

                    request.getMessage(),

                    NotificationType.ANNOUNCEMENT
            );
        }


        // =================================================
        // EMAIL
        // =================================================

        boolean sendEmail =
                shouldSendEmail(
                        settings,
                        type
                );


        if (sendEmail) {

            emailService.sendAnnouncementEmail(

                    user.getEmail(),

                    user.getName(),

                    request.getTitle(),

                    request.getMessage()
            );
        }
    }


    // =====================================================
    // EMAIL PREFERENCE
    // =====================================================

    private boolean shouldSendEmail(
            UserSettings settings,
            AnnouncementType type
    ) {

        /*
         * Maintenance and important announcements
         * are always sent by email.
         */

        if (
                type == AnnouncementType.MAINTENANCE
                        ||
                        type == AnnouncementType.IMPORTANT
        ) {

            return true;
        }


        if (settings == null) {
            return false;
        }


        if (
                type == AnnouncementType.PROMOTIONAL
        ) {

            return settings.isPromotionalEmails();
        }


        return settings.isEmailNotifications();
    }


    // =====================================================
    // GET ANNOUNCEMENT HISTORY
    // =====================================================

    public List<AnnouncementResponse>
    getAnnouncements() {

        return announcementRepo
                .findAll()
                .stream()
                .sorted(
                        (a, b) ->
                                b.getCreatedAt()
                                        .compareTo(
                                                a.getCreatedAt()
                                        )
                )
                .map(
                        this::toResponse
                )
                .toList();
    }


    // =====================================================
    // DTO CONVERSION
    // =====================================================

    private AnnouncementResponse toResponse(
            Announcement announcement
    ) {

        return new AnnouncementResponse(

                announcement.getId(),

                announcement.getTitle(),

                announcement.getMessage(),

                announcement.getType(),

                announcement.getRecipientType(),

                announcement.getCreatedAt(),

                announcement.getCreatedBy() != null
                        ? announcement
                        .getCreatedBy()
                        .getName()
                        : null
        );
    }
}