package com.artgallery.service.impl;

import com.artgallery.dto.CreateReviewRequest;
import com.artgallery.dto.ReviewResponse;
import com.artgallery.dto.ReviewSummaryProjection;
import com.artgallery.dto.ReviewSummaryResponse;
import com.artgallery.entity.Artwork;
import com.artgallery.entity.Review;
import com.artgallery.entity.User;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.ReviewRepository;
import com.artgallery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final ArtworkRepository artworkRepo;
    private final UserRepository userRepo;

    @Transactional
    public String addReview(
            Long artworkId,
            CreateReviewRequest request,
            String email
    ) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Artwork artwork = artworkRepo.findById(artworkId)
                .orElseThrow(() ->
                        new RuntimeException("Artwork not found"));

        if (reviewRepo.existsByArtworkAndUser(artwork, user)) {

            throw new RuntimeException(
                    "You have already reviewed this artwork."
            );

        }

        Review review = new Review();

        review.setArtwork(artwork);

        review.setUser(user);

        review.setRating(
                request.getRating()
        );

        review.setComment(
                request.getComment()
        );

        review.setCreatedAt(
                LocalDateTime.now()
        );

        review.setUpdatedAt(
                LocalDateTime.now()
        );

        reviewRepo.save(review);

        return "Review submitted successfully.";

    }

    @Transactional
    public String updateReview(
            Long reviewId,
            CreateReviewRequest request,
            String email
    ) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "You can only edit your own review."
            );

        }

        review.setRating(
                request.getRating()
        );

        review.setComment(
                request.getComment()
        );

        review.setUpdatedAt(
                LocalDateTime.now()
        );

        reviewRepo.save(review);

        return "Review updated successfully.";

    }

    @Transactional
    public String deleteReview(
            Long reviewId,
            String email
    ) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "You can only delete your own review."
            );

        }

        reviewRepo.delete(review);

        return "Review deleted successfully.";

    }

    public List<ReviewResponse> getArtworkReviews(
            Long artworkId
    ) {

        return reviewRepo
                .findByArtworkIdOrderByCreatedAtDesc(
                        artworkId
                )
                .stream()
                .map(review -> {

                    ReviewResponse dto =
                            new ReviewResponse();

                    dto.setReviewId(
                            review.getId()
                    );

                    dto.setArtworkId(
                            review.getArtwork().getId()
                    );

                    dto.setArtworkTitle(
                            review.getArtwork().getTitle()
                    );

                    dto.setUserId(
                            review.getUser().getId()
                    );

                    dto.setCustomerName(
                            review.getUser().getName()
                    );

                    dto.setRating(
                            review.getRating()
                    );

                    dto.setComment(
                            review.getComment()
                    );

                    dto.setCreatedAt(
                            review.getCreatedAt()
                    );

                    dto.setUpdatedAt(
                            review.getUpdatedAt()
                    );

                    return dto;

                })
                .toList();

    }

    public ReviewSummaryResponse getReviewSummary(
            Long artworkId
    ) {

        ReviewSummaryProjection summary =
                reviewRepo.getReviewSummary(artworkId);

        ReviewSummaryResponse dto =
                new ReviewSummaryResponse();

        dto.setAverageRating(
                summary.getAverageRating() == null
                        ? 0.0
                        : Math.round(summary.getAverageRating() * 10) / 10.0
        );

        dto.setReviewCount(
                summary.getReviewCount() == null
                        ? 0L
                        : summary.getReviewCount()
        );

        dto.setFiveStar(
                summary.getFiveStar() == null
                        ? 0L
                        : summary.getFiveStar()
        );

        dto.setFourStar(
                summary.getFourStar() == null
                        ? 0L
                        : summary.getFourStar()
        );

        dto.setThreeStar(
                summary.getThreeStar() == null
                        ? 0L
                        : summary.getThreeStar()
        );

        dto.setTwoStar(
                summary.getTwoStar() == null
                        ? 0L
                        : summary.getTwoStar()
        );

        dto.setOneStar(
                summary.getOneStar() == null
                        ? 0L
                        : summary.getOneStar()
        );

        return dto;
    }

}