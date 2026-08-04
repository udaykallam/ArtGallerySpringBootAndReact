package com.artgallery.controller;

import com.artgallery.dto.ArtworkResponse;
import com.artgallery.dto.CreateArtworkRequest;
import com.artgallery.service.impl.ArtworkService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    // ===================== CREATE =====================

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ARTIST','ADMIN')")
    public Object create(
            @RequestPart("data") CreateArtworkRequest request,
            @RequestPart("images") List<MultipartFile> images,
            Principal principal
    ) {
        return artworkService.createArtwork(request, images, principal.getName());
    }

    // ===================== GET ALL (PUBLIC) =====================

    @GetMapping
    public Page<ArtworkResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return artworkService.getAllArtworks(page, size, sortBy, direction);
    }

    // ===================== FILTER =====================

    @GetMapping("/filter")
    public Page<ArtworkResponse> filter(
            @RequestParam Long categoryId,
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return artworkService.filterArtworks(categoryId, minPrice, maxPrice, page, size);
    }

    @GetMapping("/{id}")
    public ArtworkResponse getArtworkById(@PathVariable Long id) {
        return artworkService.getArtworkById(id);
    }
}