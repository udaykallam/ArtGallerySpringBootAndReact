package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "artwork_images")
@Getter @Setter
public class ArtworkImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    private Integer displayOrder;

    @ManyToOne
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;
}