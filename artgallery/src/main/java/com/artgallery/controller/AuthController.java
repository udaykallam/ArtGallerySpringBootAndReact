package com.artgallery.controller;

import com.artgallery.dto.*;
import com.artgallery.service.impl.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody SendOtpRequest request
    ) {

        try {

            return ResponseEntity.ok(
                    authService.sendOtp(
                            request.getEmail()
                    )
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());

        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request
    ) {

        return ResponseEntity.ok(
                authService.verifyOtp(
                        request.getEmail(),
                        request.getOtp()
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        return ResponseEntity.ok(
                authService.resetPassword(
                        request.getEmail(),
                        request.getNewPassword()
                )
        );
    }
}