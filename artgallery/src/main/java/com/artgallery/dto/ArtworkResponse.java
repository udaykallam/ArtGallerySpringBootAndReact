package com.artgallery.dto;

import lombok.Data;

@Data
public class ArtworkResponse {

    private Long id;
    private String title;
    private String description;
    private Double price;
    private Double discountPrice;
    private Boolean framed;
    private String imageUrl;
    private Integer stock;
    private String artistName;
    private String categoryName;
    private Boolean availabilityStatus;
}