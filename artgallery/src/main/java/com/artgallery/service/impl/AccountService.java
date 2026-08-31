package com.artgallery.service.impl;

import com.artgallery.entity.User;
import com.artgallery.repository.AccountReactivationOtpRepository;
import com.artgallery.repository.CartRepository;
import com.artgallery.repository.EmailVerificationTokenRepository;
import com.artgallery.repository.NotificationRepository;
import com.artgallery.repository.OrderRepository;
import com.artgallery.repository.ReviewRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.repository.UserSettingsRepository;
import com.artgallery.repository.WishlistRepository;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepo;

    private final NotificationRepository notificationRepo;

    private final ReviewRepository reviewRepo;

    private final OrderRepository orderRepo;

    private final CartRepository cartRepo;

    private final WishlistRepository wishlistRepo;

    private final UserSettingsRepository userSettingsRepo;

    private final AccountReactivationOtpRepository reactivationOtpRepo;

    private final EmailVerificationTokenRepository verificationTokenRepo;


    // =====================================================
    // DEACTIVATE ACCOUNT
    // =====================================================

    @Transactional
    public void deactivateAccount(String email) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
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

        // =================================================
        // FIND USER
        // =================================================

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        // =================================================
        // 1. DELETE EMAIL VERIFICATION TOKEN
        // =================================================

        verificationTokenRepo.deleteByUser(user);


        // =================================================
        // 2. DELETE ACCOUNT REACTIVATION OTP
        // =================================================

        reactivationOtpRepo.deleteByUser(user);


        // =================================================
        // 3. DELETE NOTIFICATIONS
        // =================================================

        notificationRepo.deleteByUser(user);


        // =================================================
        // 4. DELETE CART
        // =================================================

        cartRepo.deleteByUser(user);


        // =================================================
        // 5. DELETE WISHLIST
        // =================================================

        wishlistRepo.deleteByUser(user);


        // =================================================
        // 6. DELETE REVIEWS
        // =================================================

        reviewRepo.deleteByUser(user);


        // =================================================
        // 7. DELETE USER SETTINGS
        // =================================================

        userSettingsRepo.deleteByUser(user);


        // =================================================
        // 8. DELETE ORDERS
        // =================================================

        /*
         * Your Order entity has:
         *
         * @OneToMany(
         *     mappedBy = "order",
         *     cascade = CascadeType.ALL
         * )
         *
         * Therefore deleting an Order also deletes
         * its OrderItems.
         */

        orderRepo.deleteByUser(user);


        // =================================================
        // FLUSH CHILD RECORDS
        // =================================================

        verificationTokenRepo.flush();

        reactivationOtpRepo.flush();

        notificationRepo.flush();

        cartRepo.flush();

        wishlistRepo.flush();

        reviewRepo.flush();

        userSettingsRepo.flush();

        orderRepo.flush();


        // =================================================
        // 9. FINALLY DELETE USER
        // =================================================

        userRepo.delete(user);

        userRepo.flush();


        return "Account deleted successfully.";
    }
}