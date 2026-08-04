package com.artgallery.controller;

import com.artgallery.dto.CheckoutResponse;
import com.artgallery.dto.OrderResponse;
import com.artgallery.dto.UpdateOrderStatusRequest;
import com.artgallery.entity.Order;
import com.artgallery.service.impl.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasAnyRole('CUSTOMER','ARTIST','ADMIN')")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ===================== CHECKOUT =====================

    @PostMapping("/checkout")
    public CheckoutResponse checkout(Principal principal) {
        return orderService.checkout(principal.getName());
    }

    // ===================== MY ORDERS =====================

    @GetMapping("/my-orders")
    public List<OrderResponse> myOrders(Principal principal) {
        return orderService.getMyOrders(principal.getName());
    }

    // ===================== ADMIN - ALL ORDERS =====================

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

// ===================== ADMIN - UPDATE STATUS =====================

    @PatchMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateStatus(@PathVariable Long orderId,
                               @RequestBody UpdateOrderStatusRequest request) {

        return orderService.updateOrderStatus(orderId, request);
    }
}