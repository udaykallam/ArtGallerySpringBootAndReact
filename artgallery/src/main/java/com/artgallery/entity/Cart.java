package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cart")
@Getter @Setter
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Owner
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Product
    @ManyToOne
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;

    private Integer quantity;
}