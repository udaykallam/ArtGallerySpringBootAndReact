package com.artgallery.controller;

import com.artgallery.dto.AnnouncementRequest;
import com.artgallery.dto.AnnouncementResponse;
import com.artgallery.service.impl.AnnouncementService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/announcements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<List<AnnouncementResponse>>
    getAnnouncements() {

        return ResponseEntity.ok(
                announcementService.getAnnouncements()
        );
    }

    @PostMapping
    public ResponseEntity<AnnouncementResponse>
    sendAnnouncement(
            @RequestBody AnnouncementRequest request,
            Principal principal
    ) {

        return ResponseEntity.ok(
                announcementService.sendAnnouncement(
                        request,
                        principal.getName()
                )
        );
    }
}