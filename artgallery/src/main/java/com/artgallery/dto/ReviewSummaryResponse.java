package com.artgallery.dto;

import lombok.Data;

@Data
public class ReviewSummaryResponse {

    private Double averageRating;

    private Long reviewCount;

    private Long fiveStar;

    private Long fourStar;

    private Long threeStar;

    private Long twoStar;

    private Long oneStar;

}