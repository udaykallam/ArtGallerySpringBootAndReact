package com.artgallery.repository;

import com.artgallery.entity.Wishlist;
import com.artgallery.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUser(User user);

    boolean existsByUserIdAndArtworkId(Long userId, Long artworkId);

    @Transactional
    @Modifying
    void deleteByUserIdAndArtworkId(Long userId, Long artworkId);
}