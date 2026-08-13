package com.artgallery.controller;

import com.artgallery.dto.ArtistArtworkResponse;
import com.artgallery.dto.ArtistDashboardResponse;
import com.artgallery.dto.ArtistOrderResponse;
import com.artgallery.entity.Artwork;
import com.artgallery.service.impl.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.artgallery.dto.UpdateArtworkRequest;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/artist")
@PreAuthorize("hasRole('ARTIST')")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @GetMapping("/dashboard")
    public ArtistDashboardResponse dashboard(
            Principal principal
    ) {

        return artistService.getDashboard(
                principal.getName()
        );
    }

    @GetMapping("/artworks")
    public List<ArtistArtworkResponse> getMyArtworks(
            Principal principal
    ) {

        return artistService.getMyArtworks(
                principal.getName()
        );
    }

    @PutMapping("/artworks/{id}")
    public String updateArtwork(
            @PathVariable Long id,
            @RequestBody UpdateArtworkRequest request,
            Principal principal
    ) {

        return artistService.updateArtwork(
                id,
                request,
                principal.getName()
        );
    }

    @DeleteMapping("/artworks/{id}")
    public String deleteArtwork(
            @PathVariable Long id,
            Principal principal
    ) {

        return artistService.deleteArtwork(
                id,
                principal.getName()
        );
    }

    @GetMapping("/artworks/{id}")
    public Artwork getArtwork(
            @PathVariable Long id,
            Principal principal
    ) {

        return artistService.getArtwork(
                id,
                principal.getName()
        );
    }

    @GetMapping("/orders")
    public List<ArtistOrderResponse> orders(
            Principal principal
    ) {

        return artistService.getOrders(
                principal.getName()
        );
    }
}