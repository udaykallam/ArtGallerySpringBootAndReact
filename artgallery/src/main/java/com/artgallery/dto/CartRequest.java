package com.artgallery.dto;

import lombok.Data;

@Data
public class CartRequest {
    private Long artworkId;
    private Integer quantity;
}