package com.artgallery.service.impl;

import com.artgallery.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOtp(
            String email,
            String otp
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "Aurelian Gallery Password Reset"
        );

        message.setText(
                "Your OTP is: "
                        + otp
                        + "\n\nIt expires in 5 minutes."
        );

        mailSender.send(message);
    }
}