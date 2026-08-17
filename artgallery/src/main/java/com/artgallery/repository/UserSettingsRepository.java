package com.artgallery.repository;

import com.artgallery.entity.User;
import com.artgallery.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSettingsRepository
        extends JpaRepository<UserSettings, Long> {

    Optional<UserSettings> findByUser(User user);

    Optional<UserSettings> findByUserId(Long userId);
}