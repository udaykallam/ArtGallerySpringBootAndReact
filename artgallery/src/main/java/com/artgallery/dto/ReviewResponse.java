package com.artgallery.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {

    private Long reviewId;

    private Integer rating;

    private String comment;

    private Long userId;

    private String customerName;

    private Long artworkId;

    private String artworkTitle;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}