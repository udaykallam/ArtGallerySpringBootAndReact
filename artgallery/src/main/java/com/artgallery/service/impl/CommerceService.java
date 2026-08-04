package com.artgallery.service.impl;

import com.artgallery.dto.CartRequest;
import com.artgallery.entity.*;
import com.artgallery.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommerceService {

    @Autowired
    private WishlistRepository wishlistRepo;

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ArtworkRepository artworkRepo;

    // ===================== WISHLIST =====================

    public String addToWishlist(Long artworkId, String email) {

        User user = userRepo.findByEmail(email).orElseThrow();

        if (wishlistRepo.existsByUserIdAndArtworkId(user.getId(), artworkId)) {
            return "Artwork already in wishlist";
        }

        Artwork artwork = artworkRepo.findById(artworkId).orElseThrow();

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setArtwork(artwork);

        wishlistRepo.save(wishlist);

        return "Added to wishlist";
    }

    public List<Wishlist> getWishlist(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return wishlistRepo.findByUser(user);
    }

    @Transactional
    public String removeFromWishlist(Long artworkId, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();

        wishlistRepo.deleteByUserIdAndArtworkId(user.getId(), artworkId);

        return "Removed from wishlist";
    }

    // ===================== CART =====================

    public String addToCart(CartRequest request, String email) {

        User user = userRepo.findByEmail(email).orElseThrow();

        Cart cart = cartRepo.findByUserIdAndArtworkId(user.getId(), request.getArtworkId())
                .orElse(null);

        if (cart != null) {
            cart.setQuantity(cart.getQuantity() + request.getQuantity());
        } else {
            Artwork artwork = artworkRepo.findById(request.getArtworkId()).orElseThrow();

            cart = new Cart();
            cart.setUser(user);
            cart.setArtwork(artwork);
            cart.setQuantity(request.getQuantity());
        }

        cartRepo.save(cart);

        return "Added to cart";
    }

    public List<Cart> getCart(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return cartRepo.findByUser(user);
    }

    public String removeFromCart(Long artworkId, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();

        cartRepo.deleteByUserIdAndArtworkId(user.getId(), artworkId);

        return "Removed from cart";
    }

    @Transactional
    public void updateCartQuantity(
            Long artworkId,
            Integer quantity,
            String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart = cartRepo
                .findByUserAndArtworkId(user, artworkId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));

        cart.setQuantity(quantity);

        cartRepo.save(cart);
    }
}