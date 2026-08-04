package com.artgallery.dto;

import lombok.Data;

@Data
public class UpdateArtworkRequest {

    private String title;
    private String description;

    private String medium;
    private String dimensions;

    private Double price;
    private Double discountPrice;

    private Boolean framed;

    private Integer stock;
}