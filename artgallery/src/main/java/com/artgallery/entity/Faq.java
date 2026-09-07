package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "faqs")
@Getter
@Setter
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // QUESTION
    // =====================================================

    @Column(
            nullable = false,
            length = 500
    )
    private String question;


    // =====================================================
    // ANSWER
    // =====================================================

    @Column(
            nullable = false,
            length = 5000
    )
    private String answer;


    // =====================================================
    // CATEGORY
    // =====================================================

    @Column(
            nullable = false,
            length = 50
    )
    private String category;


    // =====================================================
    // KEYWORDS
    // =====================================================

    @Column(
            length = 1000
    )
    private String keywords;


    // =====================================================
    // ACTIVE
    // =====================================================

    @Column(nullable = false)
    private boolean active = true;
}