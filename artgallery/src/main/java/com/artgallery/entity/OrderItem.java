package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter @Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Parent order
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // Purchased artwork
    @ManyToOne
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;

    private Integer quantity;

    private Double priceAtPurchase;
}