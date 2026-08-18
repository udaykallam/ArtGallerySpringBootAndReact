package com.artgallery.controller;

import com.artgallery.dto.NotificationResponse;
import com.artgallery.service.impl.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;


    // ==========================================
    // GET ALL NOTIFICATIONS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            Principal principal
    ) {
        System.out.println(
                "NOTIFICATION PRINCIPAL = "
                        + (principal == null
                        ? "NULL"
                        : principal.getName())
        );

        return ResponseEntity.ok(
                notificationService.getNotifications(
                        principal.getName()
                )
        );
    }


    // ==========================================
    // GET UNREAD NOTIFICATIONS
    // ==========================================

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            Principal principal
    ) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(
                        principal.getName()
                )
        );
    }


    // ==========================================
    // GET UNREAD COUNT
    // ==========================================

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(
            Principal principal
    ) {
        System.out.println(
                "UNREAD COUNT PRINCIPAL = "
                        + (principal == null
                        ? "NULL"
                        : principal.getName())
        );

        return ResponseEntity.ok(
                notificationService.getUnreadCount(
                        principal.getName()
                )
        );
    }


    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            Principal principal
    ) {

        notificationService.markAsRead(
                id,
                principal.getName()
        );

        return ResponseEntity.ok().build();
    }


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            Principal principal
    ) {

        notificationService.markAllAsRead(
                principal.getName()
        );

        return ResponseEntity.ok().build();
    }


}