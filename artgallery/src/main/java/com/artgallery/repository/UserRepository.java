package com.artgallery.repository;

import com.artgallery.entity.User;
import com.artgallery.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole_Name(
            RoleName roleName
    );
}
