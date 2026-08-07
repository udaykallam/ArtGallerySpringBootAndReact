package com.artgallery.controller;

import com.artgallery.dto.CreateReviewRequest;
import com.artgallery.dto.ReviewResponse;
import com.artgallery.dto.ReviewSummaryResponse;
import com.artgallery.service.impl.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/{artworkId}")
    public List<ReviewResponse> getReviews(
            @PathVariable Long artworkId
    ) {

        return reviewService.getArtworkReviews(
                artworkId
        );

    }

    @GetMapping("/{artworkId}/summary")
    public ReviewSummaryResponse getSummary(
            @PathVariable Long artworkId
    ) {
        return reviewService.getReviewSummary(artworkId);
    }

    @PostMapping("/{artworkId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public String addReview(

            @PathVariable Long artworkId,

            @RequestBody CreateReviewRequest request,

            Principal principal

    ) {

        return reviewService.addReview(

                artworkId,

                request,

                principal.getName()

        );

    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public String updateReview(

            @PathVariable Long reviewId,

            @RequestBody CreateReviewRequest request,

            Principal principal

    ) {

        return reviewService.updateReview(

                reviewId,

                request,

                principal.getName()

        );

    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public String deleteReview(

            @PathVariable Long reviewId,

            Principal principal

    ) {

        return reviewService.deleteReview(

                reviewId,

                principal.getName()

        );

    }

}