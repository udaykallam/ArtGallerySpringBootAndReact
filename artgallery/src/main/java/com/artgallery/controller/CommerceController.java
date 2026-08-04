package com.artgallery.controller;

import com.artgallery.dto.CartRequest;
import com.artgallery.service.impl.CommerceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.artgallery.dto.UpdateCartQuantityRequest;

import java.security.Principal;

@RestController
@RequestMapping("/api/commerce")
@PreAuthorize("hasAnyRole('CUSTOMER','ARTIST','ADMIN')")
public class CommerceController {

    @Autowired
    private CommerceService commerceService;

    // ===================== WISHLIST =====================

    @PostMapping("/wishlist/{artworkId}")
    public String addToWishlist(@PathVariable Long artworkId,
                                Principal principal) {
        return commerceService.addToWishlist(artworkId, principal.getName());
    }

    @GetMapping("/wishlist")
    public Object getWishlist(Principal principal) {
        return commerceService.getWishlist(principal.getName());
    }

    @DeleteMapping("/wishlist/{artworkId}")
    public String removeWishlist(@PathVariable Long artworkId,
                                 Principal principal) {
        return commerceService.removeFromWishlist(artworkId, principal.getName());
    }

    // ===================== CART =====================

    @PostMapping("/cart")
    public String addToCart(@RequestBody CartRequest request,
                            Principal principal) {
        return commerceService.addToCart(request, principal.getName());
    }

    @GetMapping("/cart")
    public Object getCart(Principal principal) {
        return commerceService.getCart(principal.getName());
    }

    @DeleteMapping("/cart/{artworkId}")
    public String removeCart(@PathVariable Long artworkId,
                             Principal principal) {
        return commerceService.removeFromCart(artworkId, principal.getName());
    }

    @PutMapping("/cart/{artworkId}")
    public String updateCartQuantity(
            @PathVariable Long artworkId,
            @RequestBody UpdateCartQuantityRequest request,
            Principal principal) {

        commerceService.updateCartQuantity(
                artworkId,
                request.getQuantity(),
                principal.getName()
        );

        return "Cart updated successfully";
    }
}

