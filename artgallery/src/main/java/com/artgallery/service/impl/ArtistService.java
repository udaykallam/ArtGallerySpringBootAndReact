package com.artgallery.service.impl;

import com.artgallery.dto.ArtistArtworkResponse;
import com.artgallery.dto.ArtistDashboardResponse;
import com.artgallery.dto.ArtistOrderResponse;
import com.artgallery.dto.UpdateArtworkRequest;
import com.artgallery.entity.Artwork;
import com.artgallery.entity.OrderItem;
import com.artgallery.entity.User;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.OrderItemRepository;
import com.artgallery.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArtistService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ArtworkRepository artworkRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    public ArtistDashboardResponse getDashboard(
            String email
    ) {

        User artist =
                userRepo.findByEmail(email)
                        .orElseThrow();

        Long artworkCount =
                artworkRepo.countByArtistIdAndIsDeletedFalse(
                        artist.getId()
                );

        Long orderCount =
                orderItemRepo.countByArtworkArtistId(
                        artist.getId()
                );

        Double revenue =
                orderItemRepo.getRevenueByArtist(
                        artist.getId()
                );

        if (revenue == null) {
            revenue = 0.0;
        }

        List<Artwork> artworks =
                artworkRepo.findByArtistIdAndIsDeletedFalse(
                        artist.getId()
                );

        Long totalSales =
                artworks.stream()
                        .mapToLong(
                                artwork ->
                                        artwork.getTotalSales() == null
                                                ? 0
                                                : artwork.getTotalSales()
                        )
                        .sum();

        String topArtwork = "N/A";
        int maxSales = 0;

        for (Artwork artwork : artworks) {

            int sales =
                    artwork.getTotalSales() == null
                            ? 0
                            : artwork.getTotalSales();

            if (sales > maxSales) {

                maxSales = sales;
                topArtwork = artwork.getTitle();
            }
        }

        LocalDateTime startOfMonth =
                LocalDate.now()
                        .withDayOfMonth(1)
                        .atStartOfDay();

        long monthlyOrders = 0;
        double monthlyRevenue = 0.0;

        for (Artwork artwork : artworks) {

            List<OrderItem> items =
                    orderItemRepo.findByArtwork(
                            artwork
                    );

            for (OrderItem item : items) {

                if (item.getOrder()
                        .getCreatedAt()
                        .isAfter(startOfMonth)) {

                    monthlyOrders++;

                    monthlyRevenue +=
                            item.getPriceAtPurchase()
                                    * item.getQuantity();
                }
            }
        }

        return new ArtistDashboardResponse(
                artworkCount,
                orderCount,
                totalSales,
                revenue,
                topArtwork,
                monthlyOrders,
                monthlyRevenue
        );
    }

    public List<ArtistArtworkResponse> getMyArtworks(
            String email
    ) {

        User artist = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Artist not found")
                );

        return artworkRepo
                .findByArtistIdAndIsDeletedFalse(
                        artist.getId()
                )
                .stream()
                .map(artwork -> {

                    ArtistArtworkResponse dto =
                            new ArtistArtworkResponse();

                    dto.setId(
                            artwork.getId()
                    );

                    dto.setTitle(
                            artwork.getTitle()
                    );

                    dto.setDescription(
                            artwork.getDescription()
                    );

                    dto.setPrice(
                            artwork.getPrice()
                    );

                    dto.setDiscountPrice(
                            artwork.getDiscountPrice()
                    );

                    dto.setAdminOverridePrice(
                            artwork.getAdminOverridePrice()
                    );

                    dto.setStock(
                            artwork.getStock()
                    );

                    dto.setFeatured(
                            artwork.getFeatured()
                    );

                    dto.setFramed(
                            artwork.getFramed()
                    );

                    dto.setMedium(
                            artwork.getMedium()
                    );

                    dto.setDimensions(
                            artwork.getDimensions()
                    );

                    dto.setAvailabilityStatus(
                            artwork.getAvailabilityStatus()
                    );

                    if (artwork.getCategory() != null) {

                        dto.setCategoryName(
                                artwork.getCategory().getName()
                        );
                    }

                    if (
                            artwork.getImages() != null &&
                                    !artwork.getImages().isEmpty()
                    ) {

                        dto.setImageUrl(
                                artwork.getImages()
                                        .get(0)
                                        .getImageUrl()
                        );
                    }

                    dto.setAverageRating(
                            artwork.getAverageRating()
                    );

                    dto.setReviewCount(
                            artwork.getReviews() == null
                                    ? 0L
                                    : (long) artwork
                                    .getReviews()
                                    .size()
                    );

                    return dto;

                })
                .toList();
    }

    @Transactional
    public String updateArtwork(
            Long artworkId,
            UpdateArtworkRequest request,
            String email
    ) {

        User artist =
                userRepo.findByEmail(email)
                        .orElseThrow();

        Artwork artwork =
                artworkRepo.findById(artworkId)
                        .orElseThrow();

        if (!artwork.getArtist()
                .getId()
                .equals(artist.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        artwork.setTitle(request.getTitle());
        artwork.setDescription(
                request.getDescription()
        );
        artwork.setMedium(
                request.getMedium()
        );
        artwork.setDimensions(
                request.getDimensions()
        );
        artwork.setPrice(
                request.getPrice()
        );
        artwork.setDiscountPrice(
                request.getDiscountPrice()
        );
        artwork.setFramed(
                request.getFramed()
        );
        artwork.setStock(
                request.getStock()
        );

        artworkRepo.save(artwork);

        return "Artwork updated successfully";
    }

    @Transactional
    public String deleteArtwork(
            Long artworkId,
            String email
    ) {

        User artist =
                userRepo.findByEmail(email)
                        .orElseThrow();

        Artwork artwork =
                artworkRepo.findById(artworkId)
                        .orElseThrow();

        if (!artwork.getArtist()
                .getId()
                .equals(artist.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        artwork.setIsDeleted(true);

        artworkRepo.save(artwork);

        return "Artwork deleted";
    }

    public Artwork getArtwork(
            Long artworkId,
            String email
    ) {

        User artist =
                userRepo.findByEmail(email)
                        .orElseThrow();

        return artworkRepo
                .findByIdAndArtistId(
                        artworkId,
                        artist.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Artwork not found"
                        ));
    }

    public List<ArtistOrderResponse> getOrders(
            String email
    ) {

        User artist =
                userRepo.findByEmail(email)
                        .orElseThrow();

        List<Artwork> artworks =
                artworkRepo.findByArtist(artist);

        List<ArtistOrderResponse> response =
                new ArrayList<>();

        for (Artwork artwork : artworks) {

            List<OrderItem> items =
                    orderItemRepo.findByArtwork(
                            artwork
                    );

            for (OrderItem item : items) {

                ArtistOrderResponse dto =
                        new ArtistOrderResponse();

                dto.setOrderId(
                        item.getOrder().getId()
                );

                dto.setCustomerName(
                        item.getOrder()
                                .getUser()
                                .getName()
                );

                dto.setArtworkTitle(
                        artwork.getTitle()
                );

                dto.setQuantity(
                        item.getQuantity()
                );

                dto.setPrice(
                        item.getPriceAtPurchase()
                );

                dto.setStatus(
                        item.getOrder()
                                .getStatus()
                                .name()
                );

                dto.setOrderedAt(
                        item.getOrder()
                                .getCreatedAt()
                );

                response.add(dto);
            }
        }

        return response;
    }
}