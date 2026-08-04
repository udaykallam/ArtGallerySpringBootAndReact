package com.artgallery.dto;

import com.artgallery.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckoutResponse {

    private Long orderId;
    private Double totalAmount;
    private OrderStatus status;
}