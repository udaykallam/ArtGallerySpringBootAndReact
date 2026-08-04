package com.artgallery.dto;

import com.artgallery.enums.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {

    private OrderStatus status;
}