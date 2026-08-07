package com.artgallery.repository;

import com.artgallery.dto.ReviewSummaryProjection;
import com.artgallery.entity.Review;
import com.artgallery.entity.Artwork;
import com.artgallery.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByArtworkIdOrderByCreatedAtDesc(
            Long artworkId
    );

    List<Review> findByArtworkArtistIdOrderByCreatedAtDesc(
            Long artistId
    );

    Optional<Review> findByArtworkIdAndUserId(
            Long artworkId,
            Long userId
    );

    boolean existsByArtworkAndUser(
            Artwork artwork,
            User user
    );

    @Query("""
SELECT

AVG(r.rating) as averageRating,

COUNT(r) as reviewCount,

SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) as fiveStar,

SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END) as fourStar,

SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END) as threeStar,

SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END) as twoStar,

SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) as oneStar

FROM Review r

WHERE r.artwork.id = :artworkId
""")
    ReviewSummaryProjection getReviewSummary(
            Long artworkId
    );

    @Modifying
    void deleteByArtworkId(
            Long artworkId
    );

}