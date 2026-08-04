package com.artgallery.service.impl;

import com.artgallery.dto.ArtworkResponse;
import com.artgallery.dto.CreateArtworkRequest;
import com.artgallery.entity.Artwork;
import com.artgallery.entity.ArtworkImage;
import com.artgallery.entity.Category;
import com.artgallery.entity.User;
import com.artgallery.repository.ArtworkImageRepository;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.CategoryRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.ImageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class ArtworkService {

    @Autowired
    private ArtworkRepository artworkRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ImageService imageService;

    @Autowired
    private ArtworkImageRepository imageRepo;

    public Artwork createArtwork(CreateArtworkRequest request,
                                 List<MultipartFile> images,
                                 String email) {

        User artist = userRepo.findByEmail(email).orElseThrow();
        Category category = categoryRepo.findById(request.getCategoryId()).orElseThrow();

        Artwork artwork = new Artwork();

        artwork.setTitle(request.getTitle());
        artwork.setDescription(request.getDescription());
        artwork.setMedium(request.getMedium());
        artwork.setDimensions(request.getDimensions());
        artwork.setPrice(request.getPrice());
        artwork.setDiscountPrice(request.getDiscountPrice());
        artwork.setFramed(request.getFramed());
        artwork.setStock(request.getStock());
        artwork.setAvailabilityStatus(true);
        artwork.setArtist(artist);
        artwork.setCategory(category);

        Artwork savedArtwork = artworkRepo.save(artwork);

        int order = 1;

        for (MultipartFile file : images) {

            String url = imageService.uploadImage(file);

            ArtworkImage img = new ArtworkImage();
            img.setArtwork(savedArtwork);
            img.setImageUrl(url);
            img.setDisplayOrder(order++);

            imageRepo.save(img);
        }

        return savedArtwork;
    }


    public Page<ArtworkResponse> getAllArtworks(
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(page, size, sort);

        Page<Artwork> artworks =
                artworkRepo.findByIsDeletedFalse(
                        pageable
                );

        return artworks.map(art -> {

            ArtworkResponse dto =
                    new ArtworkResponse();

            dto.setId(art.getId());
            dto.setTitle(art.getTitle());
            dto.setDescription(art.getDescription());
            dto.setPrice(art.getPrice());
            dto.setDiscountPrice(
                    art.getDiscountPrice()
            );
            dto.setFramed(
                    art.getFramed()
            );
            dto.setStock(
                    art.getStock()
            );
            dto.setAvailabilityStatus(
                    art.getAvailabilityStatus()
            );

            dto.setArtistName(
                    art.getArtist().getName()
            );

            dto.setCategoryName(
                    art.getCategory().getName()
            );

            // Cloudinary Image URL
            if (art.getImages() != null &&
                    !art.getImages().isEmpty()) {

                dto.setImageUrl(
                        art.getImages()
                                .get(0)
                                .getImageUrl()
                );
            }

            return dto;
        });
    }

    public Page<ArtworkResponse> filterArtworks(Long categoryId,
                                                Double minPrice,
                                                Double maxPrice,
                                                int page,
                                                int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Artwork> artworks = artworkRepo
                .findByCategoryIdAndPriceBetweenAndIsDeletedFalse(
                        categoryId,
                        minPrice,
                        maxPrice,
                        pageable
                );

        return artworks.map(this::mapToDTO);
    }

    private ArtworkResponse mapToDTO(Artwork art) {

        ArtworkResponse dto = new ArtworkResponse();

        dto.setId(art.getId());
        dto.setTitle(art.getTitle());
        dto.setDescription(art.getDescription());
        dto.setPrice(art.getPrice());
        dto.setDiscountPrice(art.getDiscountPrice());
        dto.setFramed(art.getFramed());
        dto.setStock(
                art.getStock()
        );

        dto.setAvailabilityStatus(
                art.getAvailabilityStatus()
        );

        // Safe image handling
        dto.setImageUrl(
                art.getImages() != null && !art.getImages().isEmpty()
                        ? art.getImages().get(0).getImageUrl()
                        : null
        );

        dto.setArtistName(art.getArtist().getName());
        dto.setCategoryName(art.getCategory().getName());

        return dto;
    }

    public ArtworkResponse getArtworkById(Long id) {

        Artwork art = artworkRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        return mapToDTO(art);
    }
}