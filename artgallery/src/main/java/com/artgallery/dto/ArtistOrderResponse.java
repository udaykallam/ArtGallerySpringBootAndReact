package com.artgallery.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ArtistOrderResponse {

    private Long orderId;

    private String customerName;

    private String artworkTitle;

    private Integer quantity;

    private Double price;

    private String status;

    private LocalDateTime orderedAt;
}