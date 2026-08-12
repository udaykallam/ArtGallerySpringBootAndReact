package com.artgallery.controller;

import com.artgallery.dto.ProfileResponse;
import com.artgallery.dto.UpdateProfileRequest;
import com.artgallery.service.impl.ProfileService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ProfileController {

    private final ProfileService profileService;


    // =========================
    // GET PROFILE
    // =========================

    @GetMapping
    public ProfileResponse getProfile(
            Principal principal
    ) {

        return profileService.getProfile(
                principal.getName()
        );
    }


    // =========================
    // UPDATE PROFILE
    // =========================

    @PutMapping
    public ProfileResponse updateProfile(
            @RequestBody UpdateProfileRequest request,
            Principal principal
    ) {

        return profileService.updateProfile(
                principal.getName(),
                request
        );
    }
}