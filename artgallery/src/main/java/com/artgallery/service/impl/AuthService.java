package com.artgallery.service.impl;

import com.artgallery.dto.AuthResponse;
import com.artgallery.dto.LoginRequest;
import com.artgallery.dto.RegisterRequest;
import com.artgallery.entity.EmailVerificationToken;
import com.artgallery.entity.PasswordResetOtp;
import com.artgallery.entity.Role;
import com.artgallery.entity.User;
import com.artgallery.enums.RoleName;
import com.artgallery.repository.EmailVerificationTokenRepository;
import com.artgallery.repository.PasswordResetOtpRepository;
import com.artgallery.repository.RoleRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.EmailService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordResetOtpRepository otpRepo;

    @Autowired
    private EmailVerificationTokenRepository verificationTokenRepo;

    @Autowired
    private EmailService emailService;


    // =========================================================
    // REGISTER
    // =========================================================

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        // Check whether email already exists
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "An account already exists with this email."
            );
        }


        // Get CUSTOMER role
        Role role =
                roleRepo.findByName(
                        RoleName.ROLE_CUSTOMER
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Customer role not found."
                        )
                );


        // Create user
        User user = new User();

        user.setName(
                request.getName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setPhone(
                request.getPhone()
        );

        // Account is active,
        // but email is not verified yet.
        user.setEnabled(true);

        user.setEmailVerified(false);

        user.setRole(role);


        userRepo.save(user);

        String verificationToken =
                UUID.randomUUID().toString();

        EmailVerificationToken token =
                new EmailVerificationToken();

        token.setToken(verificationToken);
        token.setUser(user);
        token.setExpiryTime(
                LocalDateTime.now().plusHours(24)
        );
        token.setVerified(false);

        verificationTokenRepo.save(token);

        String verificationLink =
                "http://localhost:5173/verify-email?token="
                        + verificationToken;

        emailService.sendVerificationEmail(
                user.getEmail(),
                user.getName(),
                verificationLink
        );


        // =====================================================
        // DO NOT LOGIN USER YET
        // =====================================================

        return new AuthResponse(
                null,
                user.getRole().getName().name(),
                user.getId(),
                user.getName()
        );
    }


    // =========================================================
    // VERIFY EMAIL
    // =========================================================

    @Transactional
    public String verifyEmail(String token) {

        EmailVerificationToken verificationToken =
                verificationTokenRepo
                        .findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid verification link."
                                )
                        );


        // Already verified
        if (verificationToken.isVerified()) {

            return "Email has already been verified.";
        }


        // Check expiry
        if (
                verificationToken
                        .getExpiryTime()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            verificationTokenRepo.delete(
                    verificationToken
            );

            throw new RuntimeException(
                    "Verification link has expired."
            );
        }


        // Get user
        User user =
                verificationToken.getUser();


        // Mark email verified
        user.setEmailVerified(true);

        userRepo.save(user);


        // Mark token verified
        verificationToken.setVerified(true);

        verificationTokenRepo.save(
                verificationToken
        );


        return "Email verified successfully.";
    }


    // =========================================================
    // RESEND VERIFICATION EMAIL
    // =========================================================

    @Transactional
    public String resendVerificationEmail(String email) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No account found with this email."
                                )
                        );

        // Email already verified
        if (user.isEmailVerified()) {

            throw new RuntimeException(
                    "Your email is already verified."
            );
        }


        // =====================================================
        // FIND EXISTING TOKEN
        // =====================================================

        EmailVerificationToken token =
                verificationTokenRepo
                        .findByUser(user)
                        .orElse(null);


        // =====================================================
        // CREATE TOKEN ONLY IF ONE DOES NOT EXIST
        // =====================================================

        if (token == null) {

            token =
                    new EmailVerificationToken();

            token.setUser(user);

        }


        // =====================================================
        // GENERATE NEW TOKEN
        // =====================================================

        String newVerificationToken =
                UUID.randomUUID().toString();

        token.setToken(
                newVerificationToken
        );

        token.setExpiryTime(
                LocalDateTime.now().plusHours(24)
        );

        token.setVerified(false);


        // =====================================================
        // SAVE
        // =====================================================

        verificationTokenRepo.save(
                token
        );


        // =====================================================
        // SEND EMAIL
        // =====================================================

        String verificationLink =
                "http://localhost:5173/verify-email?token="
                        + newVerificationToken;


        emailService.sendVerificationEmail(
                user.getEmail(),
                user.getName(),
                verificationLink
        );


        return "Verification email sent successfully.";
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public AuthResponse login(
            LoginRequest request
    ) {

        User user =
                userRepo.findByEmail(
                        request.getEmail()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );


        // Account suspended
        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "Your account has been suspended. " +
                            "Please contact support."
            );
        }


        // Email not verified
        if (!user.isEmailVerified()) {

            throw new RuntimeException(
                    "Please verify your email address " +
                            "before logging in."
            );
        }


        // Check password
        if (
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid credentials"
            );
        }


        // Generate JWT
        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        return new AuthResponse(
                token,
                user.getRole().getName().name(),
                user.getId(),
                user.getName()
        );
    }


    // =========================================================
    // FORGOT PASSWORD - SEND OTP
    // =========================================================

    @Transactional
    public String sendOtp(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No account found with this email."
                                )
                        );


        // Delete previous OTP
        otpRepo.deleteByEmail(
                email
        );


        // Generate 6-digit OTP
        String otp =
                String.format(
                        "%06d",
                        new java.util.Random()
                                .nextInt(1_000_000)
                );


        PasswordResetOtp token =
                new PasswordResetOtp();

        token.setEmail(
                email
        );

        token.setOtp(
                otp
        );

        token.setExpiryTime(
                LocalDateTime.now()
                        .plusMinutes(5)
        );

        token.setVerified(false);


        otpRepo.save(
                token
        );


        // Send password reset email
        emailService.sendOtp(
                email,
                otp
        );


        return "OTP sent successfully.";
    }


    // =========================================================
    // VERIFY PASSWORD RESET OTP
    // =========================================================

    public String verifyOtp(
            String email,
            String otp
    ) {

        PasswordResetOtp token =
                otpRepo.findByEmailAndOtp(
                        email,
                        otp
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Invalid OTP"
                        )
                );


        // Check expiry
        if (
                token.getExpiryTime()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            otpRepo.delete(
                    token
            );

            throw new RuntimeException(
                    "OTP has expired."
            );
        }


        token.setVerified(true);

        otpRepo.save(
                token
        );


        return "OTP verified successfully.";
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @Transactional
    public String resetPassword(
            String email,
            String newPassword
    ) {

        PasswordResetOtp token =
                otpRepo.findByEmail(
                        email
                ).orElseThrow(() ->
                        new RuntimeException(
                                "OTP not found"
                        )
                );


        // OTP must be verified first
        if (!token.isVerified()) {

            throw new RuntimeException(
                    "Please verify OTP first."
            );
        }


        User user =
                userRepo.findByEmail(
                        email
                ).orElseThrow(() ->
                        new RuntimeException(
                                "No account found with this email."
                        )
                );


        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );


        userRepo.save(user);


        // Delete used OTP
        otpRepo.delete(
                token
        );


        return "Password reset successful.";
    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @Transactional
    public String changePassword(
            String email,
            String currentPassword,
            String newPassword,
            String confirmPassword
    ) {

        User user =
                userRepo.findByEmail(
                        email
                ).orElseThrow(() ->
                        new RuntimeException(
                                "User not found."
                        )
                );


        // Check account status
        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "Your account has been suspended."
            );
        }


        // Check current password
        if (
                !passwordEncoder.matches(
                        currentPassword,
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Current password is incorrect."
            );
        }


        // Check confirmation
        if (
                !newPassword.equals(
                        confirmPassword
                )
        ) {

            throw new RuntimeException(
                    "New passwords do not match."
            );
        }


        // Don't allow same password
        if (
                passwordEncoder.matches(
                        newPassword,
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "New password must be different " +
                            "from your current password."
            );
        }


        // Basic password validation
        if (
                newPassword.length() < 8
        ) {

            throw new RuntimeException(
                    "New password must contain at least 8 characters."
            );
        }


        // Save new password
        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepo.save(user);


        return "Password changed successfully.";
    }
}