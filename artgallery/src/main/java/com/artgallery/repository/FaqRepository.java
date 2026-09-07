package com.artgallery.repository;

import com.artgallery.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqRepository
        extends JpaRepository<Faq, Long> {

    List<Faq> findByActiveTrue();

    List<Faq> findByCategoryAndActiveTrue(
            String category
    );
}