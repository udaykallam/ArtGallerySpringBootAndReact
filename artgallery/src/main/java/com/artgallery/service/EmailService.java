package com.artgallery.service;

public interface EmailService {

    void sendOtp(
            String email,
            String otp
    );

    void sendOrderConfirmation(
            String email,
            String customerName,
            Long orderId,
            double totalAmount
    );

    void sendOrderStatusUpdate(
            String email,
            String customerName,
            Long orderId,
            String status,
            double totalAmount
    );

    void sendVerificationEmail(
            String email,
            String name,
            String verificationLink
    );

    void sendAnnouncementEmail(
            String email,
            String name,
            String title,
            String message
    );
}