package com.artgallery.repository;

import com.artgallery.entity.Artwork;
import com.artgallery.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    Long countByArtworkArtistId(Long artistId);

    @Query("""
SELECT COALESCE(SUM(
    oi.quantity * oi.priceAtPurchase
),0)
FROM OrderItem oi
WHERE oi.artwork.artist.id = :artistId
""")
    Double getRevenueByArtist(Long artistId);

    List<OrderItem> findByArtwork(
            Artwork artwork
    );
}