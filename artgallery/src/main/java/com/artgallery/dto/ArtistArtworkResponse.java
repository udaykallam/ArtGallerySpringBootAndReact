package com.artgallery.dto;

import lombok.Data;

@Data
public class ArtistArtworkResponse {

    private Long id;

    private String title;

    private String description;

    private Double price;

    private Double discountPrice;

    private Double adminOverridePrice;

    private Integer stock;

    private Boolean featured;

    private Boolean framed;

    private String medium;

    private String dimensions;

    private Boolean availabilityStatus;

    private String categoryName;

    private String imageUrl;

    private Double averageRating;

    private Long reviewCount;
}