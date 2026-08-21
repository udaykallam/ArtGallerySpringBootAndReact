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
}