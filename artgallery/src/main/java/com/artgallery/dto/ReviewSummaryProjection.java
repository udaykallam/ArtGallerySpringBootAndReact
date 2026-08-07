package com.artgallery.dto;

public interface ReviewSummaryProjection {

    Double getAverageRating();

    Long getReviewCount();

    Long getFiveStar();

    Long getFourStar();

    Long getThreeStar();

    Long getTwoStar();

    Long getOneStar();

}