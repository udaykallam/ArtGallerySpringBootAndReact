package com.artgallery.service.impl;

import com.artgallery.dto.*;
import com.artgallery.entity.Artwork;
import com.artgallery.entity.Category;
import com.artgallery.entity.Order;
import com.artgallery.entity.User;
import com.artgallery.enums.OrderStatus;
import com.artgallery.enums.RoleName;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.CategoryRepository;
import com.artgallery.repository.OrderRepository;
import com.artgallery.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ArtworkRepository artworkRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    public AdminDashboardResponse getDashboard() {

        Long totalUsers =
                userRepo.count();

        Long totalArtists =
                userRepo.countByRole_Name(
                        RoleName.ROLE_ARTIST
                );

        Long totalCustomers =
                userRepo.countByRole_Name(
                        RoleName.ROLE_CUSTOMER
                );
        Long totalArtworks =
                artworkRepo.countByIsDeletedFalse();

        Long totalOrders =
                orderRepo.count();

        Double revenue =
                orderRepo.getTotalRevenue();

        return new AdminDashboardResponse(
                totalUsers,
                totalArtists,
                totalCustomers,
                totalArtworks,
                totalOrders,
                revenue
        );
    }

    public String createCategory(
            CategoryRequest request
    ) {

        if (
                categoryRepo.existsByName(
                        request.getName()
                )
        ) {

            throw new RuntimeException(
                    "Category already exists"
            );
        }

        Category category =
                new Category();

        category.setName(
                request.getName()
        );

        category.setSlug(
                request.getSlug()
        );

        categoryRepo.save(category);

        return "Category created";
    }

    public List<Category> getCategories() {

        return categoryRepo.findAll();
    }

    public String updateCategory(
            Long id,
            CategoryRequest request
    ) {

        Category category =
                categoryRepo.findById(id)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Category not found"
                                        )
                        );

        category.setName(
                request.getName()
        );

        category.setSlug(
                request.getSlug()
        );

        categoryRepo.save(category);

        return "Category updated";
    }

    public String deleteCategory(
            Long id
    ) {

        Category category =
                categoryRepo.findById(id)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Category not found"
                                        )
                        );

        categoryRepo.delete(category);

        return "Category deleted";
    }

    public List<UserResponse> getUsers() {

        return userRepo.findAll()
                .stream()
                .map(user -> {

                    UserResponse dto =
                            new UserResponse();

                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setPhone(user.getPhone());

                    dto.setRole(
                            user.getRole()
                                    .getName()
                                    .name()
                    );

                    dto.setEnabled(
                            user.isEnabled()
                    );

                    return dto;
                })
                .toList();
    }

    public String blockUser(
            Long userId
    ) {

        User user =
                userRepo.findById(userId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                        );

        user.setEnabled(false);

        userRepo.save(user);

        return "User blocked";
    }

    public String activateUser(
            Long userId
    ) {

        User user =
                userRepo.findById(userId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                        );

        user.setEnabled(true);

        userRepo.save(user);

        return "User activated";
    }

    public String deleteUser(
            Long userId
    ) {
        orderRepo.deleteAllByUserId(userId);
        userRepo.deleteById(userId);
        return "User deleted";
    }

    public List<AdminArtworkResponse> getArtworks() {

        return artworkRepo.findByIsDeletedFalse()
                .stream()
                .map(art -> {

                    AdminArtworkResponse dto =
                            new AdminArtworkResponse();

                    dto.setId(
                            art.getId()
                    );

                    dto.setTitle(
                            art.getTitle()
                    );

                    dto.setArtistName(
                            art.getArtist().getName()
                    );

                    dto.setCategoryName(
                            art.getCategory().getName()
                    );

                    dto.setPrice(
                            art.getPrice()
                    );

                    dto.setAdminOverridePrice(
                            art.getAdminOverridePrice()
                    );

                    dto.setStock(
                            art.getStock()
                    );

                    dto.setTotalSales(
                            art.getTotalSales()
                    );

                    dto.setFeatured(
                            art.getFeatured()
                    );

                    if (
                            art.getImages() != null &&
                                    !art.getImages().isEmpty()
                    ) {

                        dto.setImageUrl(
                                art.getImages()
                                        .get(0)
                                        .getImageUrl()
                        );
                    }

                    return dto;
                })
                .toList();
    }

    public String featureArtwork(
            Long artworkId
    ) {

        Artwork artwork =
                artworkRepo.findById(
                                artworkId
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Artwork not found"
                                        )
                        );

        artwork.setFeatured(true);

        artworkRepo.save(artwork);

        return "Artwork featured";
    }

    public String unfeatureArtwork(
            Long artworkId
    ) {

        Artwork artwork =
                artworkRepo.findById(
                                artworkId
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Artwork not found"
                                        )
                        );

        artwork.setFeatured(false);

        artworkRepo.save(artwork);

        return "Artwork unfeatured";
    }

    public String overridePrice(
            Long artworkId,
            Double price
    ) {

        Artwork artwork =
                artworkRepo.findById(
                                artworkId
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Artwork not found"
                                        )
                        );

        artwork.setAdminOverridePrice(
                price
        );

        artworkRepo.save(
                artwork
        );

        return "Price updated";
    }

    public String removeArtwork(
            Long artworkId
    ) {

        Artwork artwork =
                artworkRepo.findById(
                                artworkId
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Artwork not found"
                                        )
                        );

        artwork.setIsDeleted(
                true
        );

        artworkRepo.save(
                artwork
        );

        return "Artwork removed";
    }

    public List<AdminOrderResponse> getOrders() {

        return orderRepo.findAll()
                .stream()
                .map(order -> {

                    AdminOrderResponse dto =
                            new AdminOrderResponse();

                    dto.setOrderId(
                            order.getId()
                    );

                    dto.setCustomerName(
                            order.getUser()
                                    .getName()
                    );

                    dto.setTotalAmount(
                            order.getTotalAmount()
                    );

                    dto.setStatus(
                            order.getStatus()
                                    .name()
                    );

                    dto.setCreatedAt(
                            order.getCreatedAt()
                    );

                    return dto;
                })
                .toList();
    }

    @Transactional
    public String updateOrderStatus(
            Long orderId,
            String status
    ) {

        Order order =
                orderRepo.findById(orderId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Order not found"
                                        )
                        );

        order.setStatus(
                OrderStatus.valueOf(
                        status
                )
        );

        orderRepo.save(order);

        return "Order updated";
    }
}