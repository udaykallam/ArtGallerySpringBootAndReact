package com.artgallery.service.impl;

import com.artgallery.dto.CheckoutResponse;
import com.artgallery.dto.OrderResponse;
import com.artgallery.dto.UpdateOrderStatusRequest;
import com.artgallery.entity.*;
import com.artgallery.enums.NotificationType;
import com.artgallery.enums.OrderStatus;
import com.artgallery.repository.CartRepository;
import com.artgallery.repository.OrderItemRepository;
import com.artgallery.repository.OrderRepository;
import com.artgallery.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private OrderItemRepository orderItemRepo;

    // ===================== CHECKOUT =====================

    @Transactional
    public CheckoutResponse checkout(String email) {

        User user = userRepo.findByEmail(email).orElseThrow();

        List<Cart> cartItems = cartRepo.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);

        List<OrderItem> orderItems = new ArrayList<>();

        double total = 0.0;

        for (Cart cart : cartItems) {

            Artwork artwork = cart.getArtwork();

            // Stock validation
            if (artwork.getStock() < cart.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for artwork: " + artwork.getTitle()
                );
            }

            // Final price logic
            double finalPrice =
                    artwork.getAdminOverridePrice() != null
                            ? artwork.getAdminOverridePrice()
                            : artwork.getDiscountPrice() != null
                            ? artwork.getDiscountPrice()
                            : artwork.getPrice();

            // Create order item
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setArtwork(artwork);
            item.setQuantity(cart.getQuantity());
            item.setPriceAtPurchase(finalPrice);

            orderItems.add(item);

            // Total
            total += finalPrice * cart.getQuantity();

            // Deduct stock
            artwork.setStock(artwork.getStock() - cart.getQuantity());

            if (artwork.getStock() == 0) {
                artwork.setAvailabilityStatus(false);
            }

            artwork.setTotalSales(
                    artwork.getTotalSales() + cart.getQuantity()
            );
        }

        order.setTotalAmount(total);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepo.save(order);


        // Clear cart
        cartRepo.deleteAll(cartItems);

        orderItemRepo.saveAll(orderItems);
        notificationService.createNotification(
                order.getUser().getId(),
                "Order Placed",
                "Your order #" + order.getId() +
                        " has been placed successfully.",
                NotificationType.ORDER
        );

        return new CheckoutResponse(
                savedOrder.getId(),
                savedOrder.getTotalAmount(),
                savedOrder.getStatus()
        );
    }

    // ===================== ORDER HISTORY =====================

    public List<OrderResponse> getMyOrders(String email) {

        User user = userRepo.findByEmail(email).orElseThrow();

        return orderRepo.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(order -> {
                    OrderResponse dto = new OrderResponse();

                    dto.setOrderId(order.getId());
                    dto.setTotalAmount(order.getTotalAmount());
                    dto.setStatus(order.getStatus());
                    dto.setCreatedAt(order.getCreatedAt());

                    return dto;
                })
                .toList();
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    @Transactional
    public String updateOrderStatus(Long orderId,
                                    UpdateOrderStatusRequest request) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(request.getStatus());

        orderRepo.save(order);

        return "Order status updated to " + request.getStatus();
    }
}