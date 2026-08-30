package com.artgallery.service.impl;

import com.artgallery.entity.AccountReactivationOtp;
import com.artgallery.entity.User;
import com.artgallery.repository.AccountReactivationOtpRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.EmailService;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AccountReactivationService {

    private final AccountReactivationOtpRepository reactivationOtpRepo;

    private final UserRepository userRepo;

    private final EmailService emailService;

    private final PasswordEncoder passwordEncoder;


    // =========================================================
    // SEND REACTIVATION OTP
    // =========================================================

    @Transactional
    public String sendReactivationOtp(
            String email,
            String password
    ) {

        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        // =====================================================
        // VERIFY PASSWORD
        // =====================================================

        if (
                !passwordEncoder.matches(
                        password,
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid credentials."
            );
        }


        // =====================================================
        // CHECK ACCOUNT STATUS
        // =====================================================

        if (user.isEnabled()) {

            throw new RuntimeException(
                    "Your account is already active."
            );
        }


        // =====================================================
        // DELETE OLD OTP
        // =====================================================

        reactivationOtpRepo.deleteByUser(user);

        reactivationOtpRepo.flush();


        // =====================================================
        // GENERATE NEW OTP
        // =====================================================

        String otp =
                String.format(
                        "%06d",
                        new Random()
                                .nextInt(1_000_000)
                );


        // =====================================================
        // CREATE OTP
        // =====================================================

        AccountReactivationOtp token =
                new AccountReactivationOtp();

        token.setUser(user);

        token.setOtp(otp);

        token.setExpiryTime(
                LocalDateTime.now()
                        .plusMinutes(5)
        );

        token.setUsed(false);


        // =====================================================
        // SAVE OTP
        // =====================================================

        reactivationOtpRepo.saveAndFlush(
                token
        );


        // =====================================================
        // SEND EMAIL
        // =====================================================

        emailService.sendAccountReactivationOtp(
                user.getEmail(),
                user.getName(),
                otp
        );


        return "Reactivation OTP sent successfully.";
    }


    // =========================================================
    // VERIFY OTP AND REACTIVATE ACCOUNT
    // =========================================================

    @Transactional
    public String reactivateAccount(
            String email,
            String otp
    ) {

        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        // =====================================================
        // CHECK ACCOUNT STATUS
        // =====================================================

        if (user.isEnabled()) {

            throw new RuntimeException(
                    "Your account is already active."
            );
        }


        // =====================================================
        // FIND OTP
        // =====================================================

        AccountReactivationOtp token =
                reactivationOtpRepo
                        .findByUser(user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No reactivation OTP found. " +
                                                "Please request a new OTP."
                                )
                        );


        // =====================================================
        // CHECK OTP USAGE
        // =====================================================

        if (token.isUsed()) {

            throw new RuntimeException(
                    "This OTP has already been used."
            );
        }


        // =====================================================
        // CHECK EXPIRY
        // =====================================================

        if (
                token.getExpiryTime()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            reactivationOtpRepo.delete(token);

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }


        // =====================================================
        // CHECK OTP
        // =====================================================

        if (
                !token.getOtp()
                        .equals(otp)
        ) {

            throw new RuntimeException(
                    "Invalid OTP."
            );
        }


        // =====================================================
        // REACTIVATE ACCOUNT
        // =====================================================

        user.setEnabled(true);

        userRepo.saveAndFlush(user);


        // =====================================================
        // DELETE USED OTP
        // =====================================================

        reactivationOtpRepo.delete(token);

        reactivationOtpRepo.flush();


        return "Account reactivated successfully.";
    }
}