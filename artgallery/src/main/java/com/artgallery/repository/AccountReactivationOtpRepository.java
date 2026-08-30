package com.artgallery.repository;

import com.artgallery.entity.AccountReactivationOtp;
import com.artgallery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AccountReactivationOtpRepository
        extends JpaRepository<AccountReactivationOtp, Long> {

    Optional<AccountReactivationOtp> findByUser(User user);

    @Modifying
    @Query(
            "DELETE FROM AccountReactivationOtp a " +
                    "WHERE a.user = :user"
    )
    void deleteByUser(User user);
}