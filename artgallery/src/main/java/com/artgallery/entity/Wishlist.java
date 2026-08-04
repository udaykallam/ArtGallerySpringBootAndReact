package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "wishlist")
@Getter @Setter
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who saved
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Saved artwork
    @ManyToOne
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;
}