package com.artgallery.service.impl;

import com.artgallery.dto.NotificationResponse;
import com.artgallery.entity.Notification;
import com.artgallery.entity.User;
import com.artgallery.enums.NotificationType;
import com.artgallery.repository.NotificationRepository;
import com.artgallery.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;

    private final UserRepository userRepo;

    private final SimpMessagingTemplate messagingTemplate;


    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    @Transactional
    public NotificationResponse createNotification(
            Long userId,
            String title,
            String message,
            NotificationType type
    ) {

        User user =
                userRepo.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setTitle(title);

        notification.setMessage(message);

        notification.setType(
                type.name()
        );

        notification.setRead(false);

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        Notification saved =
                notificationRepo.save(
                        notification
                );

        NotificationResponse response =
                toResponse(saved);


        // ==========================================
        // REAL-TIME WEB NOTIFICATION
        // ==========================================

        messagingTemplate.convertAndSendToUser(

                user.getEmail(),

                "/queue/notifications",

                response

        );

        return response;
    }


    public List<NotificationResponse>
    getNotifications(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        return notificationRepo
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    public List<NotificationResponse>
    getUnreadNotifications(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        return notificationRepo
                .findByUserAndReadFalseOrderByCreatedAtDesc(
                        user
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    public long getUnreadCount(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        return notificationRepo
                .countByUserAndReadFalse(user);
    }

    @Transactional
    public void markAsRead(
            Long notificationId,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        Notification notification =
                notificationRepo.findById(
                        notificationId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Notification not found."
                        )
                );

        if (
                !notification
                        .getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            throw new RuntimeException(
                    "You cannot modify this notification."
            );
        }

        notification.setRead(true);

        notificationRepo.save(
                notification
        );
    }

    @Transactional
    public void markAllAsRead(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        List<Notification> notifications =
                notificationRepo
                        .findByUserAndReadFalseOrderByCreatedAtDesc(
                                user
                        );

        notifications.forEach(
                notification ->
                        notification.setRead(true)
        );

        notificationRepo.saveAll(
                notifications
        );
    }

    private NotificationResponse toResponse(
            Notification notification
    ) {

        return new NotificationResponse(

                notification.getId(),

                notification.getTitle(),

                notification.getMessage(),

                notification.getType(),

                notification.isRead(),

                notification.getCreatedAt()

        );
    }

    private User getUserByEmail(String email) {

        if (email == null || email.isBlank()) {

            throw new RuntimeException(
                    "Authenticated user email not found."
            );
        }

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );
    }
}