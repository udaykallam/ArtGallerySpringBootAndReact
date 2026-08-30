package com.artgallery.controller;

import com.artgallery.dto.ReactivateAccountRequest;
import com.artgallery.service.impl.AccountReactivationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AccountReactivationController {


    private final AccountReactivationService
            reactivationService;


    // =========================================================
    // SEND REACTIVATION OTP
    // =========================================================

    @PostMapping("/send-reactivation-otp")
    public ResponseEntity<?> sendReactivationOtp(
            @RequestBody ReactivateAccountRequest request
    ) {

        try {

            String message =
                    reactivationService.sendReactivationOtp(
                            request.getEmail(),
                            request.getPassword()
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            message
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
    // VERIFY OTP AND REACTIVATE ACCOUNT
    // =========================================================

    @PostMapping("/reactivate-account")
    public ResponseEntity<?> reactivateAccount(
            @RequestBody ReactivateAccountRequest request
    ) {

        try {

            String message =
                    reactivationService.reactivateAccount(
                            request.getEmail(),
                            request.getOtp()
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            message
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
}