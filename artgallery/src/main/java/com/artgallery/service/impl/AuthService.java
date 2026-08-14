package com.artgallery.service.impl;

import com.artgallery.dto.AuthResponse;
import com.artgallery.dto.LoginRequest;
import com.artgallery.dto.RegisterRequest;
import com.artgallery.entity.PasswordResetOtp;
import com.artgallery.entity.Role;
import com.artgallery.entity.User;
import com.artgallery.enums.RoleName;
import com.artgallery.repository.PasswordResetOtpRepository;
import com.artgallery.repository.RoleRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;


    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordResetOtpRepository otpRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public AuthResponse register(RegisterRequest request) {

        Role role = roleRepo.findByName(RoleName.ROLE_CUSTOMER)
                .orElseThrow();

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(role);

        userRepo.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token,user.getRole().getName().name(),user.getId(),user.getName());
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow();

        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "Your account has been suspended. Please contact support."
            );
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token,user.getRole().getName().name(),user.getId(),user.getName());
    }

    @Transactional
    public String sendOtp(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("No account found with this email."));

        if (user == null) {
            throw new RuntimeException("No account found with this email.");
        }

        otpRepo.deleteByEmail(email);

        String otp = String.format("%06d",
                new java.util.Random().nextInt(999999));

        PasswordResetOtp token = new PasswordResetOtp();

        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        token.setVerified(false);

        otpRepo.save(token);

        emailService.sendOtp(email, otp);

        return "OTP sent successfully.";
    }

    public String verifyOtp(
            String email,
            String otp
    ) {

        PasswordResetOtp token =
                otpRepo.findByEmailAndOtp(email, otp)
                        .orElseThrow(() ->
                                new RuntimeException("Invalid OTP"));

        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {

            otpRepo.delete(token);

            throw new RuntimeException("OTP has expired.");
        }

        token.setVerified(true);

        otpRepo.save(token);

        return "OTP verified successfully.";
    }

    @Transactional
    public String resetPassword(
            String email,
            String newPassword
    ) {

        PasswordResetOtp token =
                otpRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("OTP not found"));

        if (!token.isVerified()) {
            throw new RuntimeException("Please verify OTP first.");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("No account found with this email."));

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepo.save(user);

        otpRepo.delete(token);

        return "Password reset successful.";
    }

    @Transactional
    public String changePassword(
            String email,
            String currentPassword,
            String newPassword,
            String confirmPassword
    ) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "Your account has been suspended."
            );
        }

        // Check current password
        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Current password is incorrect."
            );
        }

        // Check new password confirmation
        if (!newPassword.equals(confirmPassword)) {

            throw new RuntimeException(
                    "New passwords do not match."
            );
        }

        // Don't allow the same password
        if (passwordEncoder.matches(
                newPassword,
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "New password must be different from your current password."
            );
        }

        // Basic password validation
        if (newPassword.length() < 8) {

            throw new RuntimeException(
                    "New password must contain at least 8 characters."
            );
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepo.save(user);

        return "Password changed successfully.";
    }
}