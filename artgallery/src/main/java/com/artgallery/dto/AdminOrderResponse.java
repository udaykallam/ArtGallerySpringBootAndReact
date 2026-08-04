package com.artgallery.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminOrderResponse {

    private Long orderId;

    private String customerName;

    private Double totalAmount;

    private String status;

    private LocalDateTime createdAt;
}