package com.artgallery.dto;

import lombok.Data;

@Data
public class ArtworkReviewSummary {

    private Double averageRating;

    private Integer reviewCount;

    private Long fiveStar;

    private Long fourStar;

    private Long threeStar;

    private Long twoStar;

    private Long oneStar;

}