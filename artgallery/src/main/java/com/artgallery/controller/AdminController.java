package com.artgallery.controller;

import com.artgallery.dto.*;
import com.artgallery.entity.Category;
import com.artgallery.service.impl.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {

        return adminService.getDashboard();
    }

    @PostMapping("/categories")
    public String createCategory(
            @RequestBody CategoryRequest request
    ) {

        return adminService.createCategory(
                request
        );
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {

        return adminService.getCategories();
    }

    @PutMapping("/categories/{id}")
    public String updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request
    ) {

        return adminService.updateCategory(
                id,
                request
        );
    }

    @DeleteMapping("/categories/{id}")
    public String deleteCategory(
            @PathVariable Long id
    ) {

        return adminService.deleteCategory(
                id
        );
    }

    @GetMapping("/users")
    public List<UserResponse> getUsers() {

        return adminService.getUsers();
    }

    @PutMapping("/users/{id}/block")
    public String blockUser(
            @PathVariable Long id
    ) {

        return adminService.blockUser(
                id
        );
    }

    @PutMapping("/users/{id}/activate")
    public String activateUser(
            @PathVariable Long id
    ) {

        return adminService.activateUser(
                id
        );
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable Long id
    ) {

        return adminService.deleteUser(
                id
        );
    }

    @GetMapping("/artworks")
    public List<AdminArtworkResponse> getArtworks() {

        return adminService.getArtworks();
    }

    @PutMapping("/artworks/{id}/feature")
    public String featureArtwork(
            @PathVariable Long id
    ) {

        return adminService.featureArtwork(
                id
        );
    }

    @PutMapping("/artworks/{id}/unfeature")
    public String unfeatureArtwork(
            @PathVariable Long id
    ) {

        return adminService.unfeatureArtwork(
                id
        );
    }

    @PutMapping("/artworks/{id}/override-price")
    public String overridePrice(
            @PathVariable Long id,
            @RequestBody OverridePriceRequest request
    ) {

        return adminService.overridePrice(
                id,
                request.getPrice()
        );
    }

    @DeleteMapping("/artworks/{id}")
    public String removeArtwork(
            @PathVariable Long id
    ) {

        return adminService.removeArtwork(
                id
        );
    }

    @GetMapping("/orders")
    public List<AdminOrderResponse> getOrders() {

        return adminService.getOrders();
    }

    @PutMapping("/orders/{id}")
    public String updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request
    ) {

        return adminService.updateOrderStatus(
                id,
                String.valueOf(request.getStatus())
        );
    }
}