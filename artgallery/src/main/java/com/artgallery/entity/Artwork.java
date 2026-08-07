package com.artgallery.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "artworks")
@Getter @Setter
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String slug;

    @Column(length = 2000)
    private String description;

    private String medium;
    private String dimensions;

    private Double price;
    private Double discountPrice;
    private Double adminOverridePrice;

    private Boolean framed;

    private Integer stock;
    private Boolean availabilityStatus;

    private Boolean featured = false;
    private Boolean isDeleted = false;

    private Double averageRating = 0.0;
    private Integer totalSales = 0;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private User artist;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "artwork", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ArtworkImage> images;

    @OneToMany(mappedBy = "artwork")
    private List<Review> reviews;
}