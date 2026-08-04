package com.artgallery.repository;

import com.artgallery.entity.Cart;
import com.artgallery.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUser(User user);

    Optional<Cart> findByUserIdAndArtworkId(Long userId, Long artworkId);

    Optional<Cart> findByUserAndArtworkId(
            User user,
            Long artworkId
    );

    @Transactional
    @Modifying
    void deleteByUserIdAndArtworkId(Long userId, Long artworkId);
}