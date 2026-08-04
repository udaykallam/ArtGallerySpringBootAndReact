package com.artgallery.dto;

import com.artgallery.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderResponse {

    private Long orderId;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
}