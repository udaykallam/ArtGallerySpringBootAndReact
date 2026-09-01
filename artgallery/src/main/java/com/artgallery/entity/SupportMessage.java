package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_messages")
@Getter
@Setter
public class SupportMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // TICKET
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "ticket_id",
            nullable = false
    )
    private SupportTicket ticket;


    // =====================================================
    // SENDER
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "sender_id",
            nullable = false
    )
    private User sender;


    // =====================================================
    // MESSAGE
    // =====================================================

    @Column(
            nullable = false,
            length = 5000
    )
    private String message;


    // =====================================================
    // TIMESTAMP
    // =====================================================

    @Column(nullable = false)
    private LocalDateTime createdAt;


    // =====================================================
    // PRE-PERSIST
    // =====================================================

    @PrePersist
    protected void onCreate() {

        createdAt =
                LocalDateTime.now();
    }
}