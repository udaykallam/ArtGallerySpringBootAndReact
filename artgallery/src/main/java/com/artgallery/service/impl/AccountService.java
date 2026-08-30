package com.artgallery.service.impl;

import com.artgallery.entity.User;
import com.artgallery.repository.NotificationRepository;
import com.artgallery.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepo;

    @Autowired
    private NotificationRepository notificationRepo;


    // =====================================================
    // DEACTIVATE ACCOUNT
    // =====================================================

    @Transactional
    public void deactivateAccount(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        if (!user.isEnabled()) {
            throw new RuntimeException(
                    "Your account is already deactivated."
            );
        }

        user.setEnabled(false);

        userRepo.save(user);
    }


    // =====================================================
    // DELETE ACCOUNT
    // =====================================================

    @Transactional
    public String deleteAccount(String email) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );

        // Delete notifications first
        notificationRepo.deleteByUser(user);

        // Then delete the user
        userRepo.delete(user);

        return "Account deleted successfully.";
    }
}