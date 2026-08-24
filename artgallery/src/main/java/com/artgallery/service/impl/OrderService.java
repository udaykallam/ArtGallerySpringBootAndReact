package com.artgallery.service.impl;
import com.artgallery.dto.CheckoutResponse;
import com.artgallery.dto.OrderResponse;
import com.artgallery.dto.UpdateOrderStatusRequest;
import com.artgallery.entity.*;
import com.artgallery.enums.NotificationType;
import com.artgallery.enums.OrderStatus;
import com.artgallery.repository.*;
import com.artgallery.entity.UserSettings;
import com.artgallery.repository.UserSettingsRepository;
import com.artgallery.service.EmailService;
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

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserSettingsRepository settingsRepo;

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
        // ==========================================
// CUSTOMER NOTIFICATION
// ==========================================

        User orderUser = order.getUser();

        UserSettings settings = orderUser.getSettings();


// Web notification
        if (
                settings == null
                        ||
                        settings.isOrderNotifications()
        ) {

            notificationService.createNotification(

                    orderUser.getId(),

                    "Order Placed",

                    "Your order #" +
                            order.getId() +
                            " has been placed successfully.",

                    NotificationType.ORDER
            );
        }


// ==========================================
// CUSTOMER EMAIL
// ==========================================

        if (
                user.getSettings() != null
                        &&
                        user.getSettings().isEmailNotifications()
                        &&
                        user.getSettings().isOrderNotifications()
        ) {

            emailService.sendOrderConfirmation(
                    user.getEmail(),
                    user.getName(),
                    savedOrder.getId(),
                    savedOrder.getTotalAmount()
            );
        }
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
    public String updateOrderStatus(
            Long orderId,
            UpdateOrderStatusRequest request
    ) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found")
                );

        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        // Don't create a notification if nothing changed
        if (oldStatus == newStatus) {
            return "Order is already " + newStatus;
        }

        // ==========================================
        // UPDATE ORDER STATUS
        // ==========================================

        order.setStatus(newStatus);

        Order savedOrder = orderRepo.save(order);

        // ==========================================
        // GET CUSTOMER
        // ==========================================

        User customer = savedOrder.getUser();

        if (customer == null) {
            throw new RuntimeException(
                    "Order does not have an associated customer."
            );
        }

        // ==========================================
        // NOTIFICATION CONTENT
        // ==========================================

        String title;
        String message;

        switch (newStatus) {

            case PACKED:

                title = "Order #" + orderId + " Packed";

                message =
                        "Your order #" + orderId +
                                " has been packed and is ready for shipment.";

                break;

            case SHIPPED:

                title = "Order #" + orderId + " Shipped";

                message =
                        "Your order #" + orderId +
                                " has been shipped and is on its way.";

                break;

            case DELIVERED:

                title = "Order #" + orderId + " Delivered";

                message =
                        "Your order #" + orderId +
                                " has been delivered successfully.";

                break;

            case CANCELLED:

                title = "Order #" + orderId + " Cancelled";

                message =
                        "Your order #" + orderId +
                                " has been cancelled.";

                break;

            case PLACED:

                title = "Order #" + orderId + " Placed";

                message =
                        "Your order #" + orderId +
                                " has been placed successfully.";

                break;

            default:

                title = "Order #" + orderId + " Updated";

                message =
                        "The status of your order #" +
                                orderId +
                                " has been changed to " +
                                newStatus + ".";

                break;
        }

        // ==========================================
        // CREATE WEB NOTIFICATION
        // ==========================================

        notificationService.createNotification(
                customer.getId(),
                title,
                message,
                NotificationType.ORDER
        );

        // ==========================================
        // SEND EMAIL
        // ==========================================

        UserSettings settings =
                settingsRepo.findByUser(customer)
                        .orElse(null);

        if (
                settings != null
                        &&
                        settings.isEmailNotifications()
                        &&
                        settings.isOrderNotifications()
        ) {

            emailService.sendOrderStatusUpdate(
                    customer.getEmail(),
                    customer.getName(),
                    orderId,
                    newStatus.name(),
                    savedOrder.getTotalAmount()
            );
        }

        return "Order status updated to " + newStatus;
    }
}