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
    public void sendOtp(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);

        message.setSubject("Aurelian Gallery | Password Reset OTP");

        message.setText(
                "Dear User,\n\n" +
                        "We received a request to reset the password for your Aurelian Gallery account.\n\n" +
                        "Your One-Time Password (OTP) is:\n\n" +
                        "        " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes. For your security, please do not share this code with anyone.\n\n" +
                        "If you did not request a password reset, you can safely ignore this email. " +
                        "Your account will remain secure.\n\n" +
                        "Best regards,\n" +
                        "Aurelian Gallery\n" +
                        "Art. Elegance. Inspiration."
        );

        mailSender.send(message);
    }
}