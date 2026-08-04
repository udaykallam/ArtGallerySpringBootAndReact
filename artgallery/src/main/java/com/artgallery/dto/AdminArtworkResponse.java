package com.artgallery.dto;

import lombok.Data;

@Data
public class AdminArtworkResponse {

    private Long id;

    private String title;

    private String artistName;

    private String categoryName;

    private Double price;

    private Double adminOverridePrice;

    private Integer stock;

    private Integer totalSales;

    private Boolean featured;

    private String imageUrl;
}