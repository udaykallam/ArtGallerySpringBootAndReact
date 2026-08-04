package com.artgallery.repository;

import com.artgallery.entity.Artwork;
import com.artgallery.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    Page<Artwork> findByIsDeletedFalse(Pageable pageable);

    long countByIsDeletedFalse();

    Page<Artwork> findByCategoryIdAndPriceBetweenAndIsDeletedFalse(
            Long categoryId,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    );

    Long countByArtistIdAndIsDeletedFalse(Long artistId);

    List<Artwork> findByArtistIdAndIsDeletedFalse(Long artistId);

    Optional<Artwork> findByIdAndArtistId(
            Long artworkId,
            Long artistId
    );

    List<Artwork> findByArtist(
            User artist
    );

    List<Artwork> findByIsDeletedFalse();
}