package com.artgallery.controller;

import com.artgallery.dto.*;
import com.artgallery.service.impl.AccountDeactivatedException;
import com.artgallery.service.impl.AuthService;
import com.artgallery.service.impl.AccountReactivationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AccountReactivationService
            accountReactivationService;


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request
    ) {

        return authService.register(request);
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        try {

            return ResponseEntity.ok(
                    authService.login(request)
            );

        } catch (
                AccountDeactivatedException ex
        ) {

            /*
             * IMPORTANT:
             *
             * Do NOT send the reactivation OTP here.
             *
             * React will first show:
             *
             * "Your account is deactivated.
             *  Would you like to reactivate?"
             *
             * The OTP will only be generated after
             * the user clicks YES.
             */

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "status",
                                    "REACTIVATION_REQUIRED",

                                    "message",
                                    ex.getMessage()
                            )
                    );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    ex.getMessage()
                            )
                    );
        }
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

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
                    .body(
                            ex.getMessage()
                    );
        }
    }


    // =========================================================
    // VERIFY PASSWORD RESET OTP
    // =========================================================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request
    ) {

        try {

            return ResponseEntity.ok(
                    authService.verifyOtp(
                            request.getEmail(),
                            request.getOtp()
                    )
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            ex.getMessage()
                    );
        }
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        try {

            return ResponseEntity.ok(
                    authService.resetPassword(
                            request.getEmail(),
                            request.getNewPassword()
                    )
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            ex.getMessage()
                    );
        }
    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal principal
    ) {

        try {

            return ResponseEntity.ok(
                    authService.changePassword(
                            principal.getName(),
                            request.getCurrentPassword(),
                            request.getNewPassword(),
                            request.getConfirmPassword()
                    )
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            ex.getMessage()
                    );
        }
    }


    // =========================================================
    // VERIFY EMAIL
    // =========================================================

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token
    ) {

        try {

            return ResponseEntity.ok(
                    authService.verifyEmail(token)
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            ex.getMessage()
                    );
        }
    }


    // =========================================================
    // RESEND VERIFICATION EMAIL
    // =========================================================

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(
            @RequestParam String email
    ) {

        try {

            return ResponseEntity.ok(
                    authService
                            .resendVerificationEmail(email)
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            ex.getMessage()
                    );
        }
    }
}