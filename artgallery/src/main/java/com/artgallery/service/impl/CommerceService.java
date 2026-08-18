package com.artgallery.service.impl;

import com.artgallery.dto.ArtworkResponse;
import com.artgallery.dto.CartItemResponse;
import com.artgallery.dto.CartRequest;
import com.artgallery.entity.Artwork;
import com.artgallery.entity.Cart;
import com.artgallery.entity.User;
import com.artgallery.entity.Wishlist;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.CartRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.repository.WishlistRepository;

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


    // =====================================================
    // WISHLIST
    // =====================================================

    public String addToWishlist(
            Long artworkId,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (
                wishlistRepo.existsByUserIdAndArtworkId(
                        user.getId(),
                        artworkId
                )
        ) {

            return "Artwork already in wishlist";
        }

        Artwork artwork =
                artworkRepo.findById(artworkId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Artwork not found"
                                )
                        );

        Wishlist wishlist =
                new Wishlist();

        wishlist.setUser(user);

        wishlist.setArtwork(artwork);

        wishlistRepo.save(wishlist);

        return "Added to wishlist";
    }


    public List<Wishlist> getWishlist(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return wishlistRepo.findByUser(user);
    }


    @Transactional
    public String removeFromWishlist(
            Long artworkId,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        wishlistRepo.deleteByUserIdAndArtworkId(
                user.getId(),
                artworkId
        );

        return "Removed from wishlist";
    }


    // =====================================================
    // CART
    // =====================================================

    public String addToCart(
            CartRequest request,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        Artwork artwork =
                artworkRepo.findById(
                                request.getArtworkId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Artwork not found"
                                )
                        );


        // ---------------------------------------------
        // Validate quantity
        // ---------------------------------------------

        if (
                request.getQuantity() == null ||
                        request.getQuantity() < 1
        ) {

            throw new RuntimeException(
                    "Quantity must be at least 1."
            );

        }


        // ---------------------------------------------
        // Validate stock
        // ---------------------------------------------

        if (
                artwork.getStock() == null ||
                        artwork.getStock() <= 0
        ) {

            throw new RuntimeException(
                    "Artwork is out of stock."
            );

        }


        Cart cart =
                cartRepo
                        .findByUserIdAndArtworkId(
                                user.getId(),
                                request.getArtworkId()
                        )
                        .orElse(null);


        if (cart != null) {

            int newQuantity =
                    cart.getQuantity()
                            + request.getQuantity();


            if (
                    newQuantity >
                            artwork.getStock()
            ) {

                throw new RuntimeException(
                        "Only "
                                + artwork.getStock()
                                + " item(s) available."
                );

            }

            cart.setQuantity(
                    newQuantity
            );

        } else {

            if (
                    request.getQuantity()
                            > artwork.getStock()
            ) {

                throw new RuntimeException(
                        "Only "
                                + artwork.getStock()
                                + " item(s) available."
                );

            }

            cart =
                    new Cart();

            cart.setUser(user);

            cart.setArtwork(artwork);

            cart.setQuantity(
                    request.getQuantity()
            );
        }


        cartRepo.save(cart);

        return "Added to cart";
    }


    // =====================================================
    // GET CART
    // =====================================================

    public List<CartItemResponse> getCart(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        List<Cart> carts =
                cartRepo.findByUser(user);


        return carts
                .stream()
                .map(this::toCartItemResponse)
                .toList();
    }


    // =====================================================
    // CART DTO MAPPER
    // =====================================================

    private CartItemResponse toCartItemResponse(
            Cart cart
    ) {

        Artwork artwork =
                cart.getArtwork();


        ArtworkResponse artworkResponse =
                new ArtworkResponse();


        artworkResponse.setId(
                artwork.getId()
        );

        artworkResponse.setTitle(
                artwork.getTitle()
        );

        artworkResponse.setDescription(
                artwork.getDescription()
        );

        artworkResponse.setPrice(
                artwork.getPrice()
        );

        artworkResponse.setDiscountPrice(
                artwork.getDiscountPrice()
        );

        artworkResponse.setFramed(
                artwork.getFramed()
        );

        artworkResponse.setStock(
                artwork.getStock()
        );

        artworkResponse.setAvailabilityStatus(
                artwork.getAvailabilityStatus()
        );

        artworkResponse.setAverageRating(
                artwork.getAverageRating()
        );


        // ---------------------------------------------
        // Artist
        // ---------------------------------------------

        if (
                artwork.getArtist() != null
        ) {

            artworkResponse.setArtistName(
                    artwork.getArtist().getName()
            );

        }


        // ---------------------------------------------
        // Category
        // ---------------------------------------------

        if (
                artwork.getCategory() != null
        ) {

            artworkResponse.setCategoryName(
                    artwork.getCategory().getName()
            );

        }


        // ---------------------------------------------
        // Review count
        // ---------------------------------------------

        if (
                artwork.getReviews() != null
        ) {

            artworkResponse.setReviewCount(
                    artwork.getReviews().size()
            );

        } else {

            artworkResponse.setReviewCount(0);

        }


        // ---------------------------------------------
        // Image
        // ---------------------------------------------

        if (
                artwork.getImages() != null &&
                        !artwork.getImages().isEmpty()
        ) {

            /*
             * Change getImageUrl() if your
             * ArtworkImage entity uses another
             * field name.
             */

            artworkResponse.setImageUrl(
                    artwork
                            .getImages()
                            .get(0)
                            .getImageUrl()
            );

        }


        // ---------------------------------------------
        // Cart response
        // ---------------------------------------------

        CartItemResponse response =
                new CartItemResponse();

        response.setId(
                cart.getId()
        );

        response.setQuantity(
                cart.getQuantity()
        );

        response.setArtwork(
                artworkResponse
        );

        return response;
    }


    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    @Transactional
    public String removeFromCart(
            Long artworkId,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        cartRepo.deleteByUserIdAndArtworkId(
                user.getId(),
                artworkId
        );

        return "Removed from cart";
    }


    // =====================================================
    // UPDATE CART QUANTITY
    // =====================================================

    @Transactional
    public void updateCartQuantity(
            Long artworkId,
            Integer quantity,
            String email
    ) {

        if (
                quantity == null ||
                        quantity < 1
        ) {

            throw new RuntimeException(
                    "Quantity must be at least 1."
            );

        }


        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        Cart cart =
                cartRepo
                        .findByUserAndArtworkId(
                                user,
                                artworkId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );


        Artwork artwork =
                cart.getArtwork();


        if (
                artwork.getStock() == null ||
                        quantity > artwork.getStock()
        ) {

            throw new RuntimeException(
                    "Only "
                            + artwork.getStock()
                            + " item(s) available."
            );

        }


        cart.setQuantity(
                quantity
        );

        cartRepo.save(cart);
    }
}