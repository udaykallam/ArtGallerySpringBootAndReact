package com.artgallery.service;

import com.artgallery.dto.FaqResponse;

import java.util.List;

public interface FaqService {

    FaqResponse ask(
            String question
    );

    List<FaqResponse> getPopularFaqs();

    List<FaqResponse> getFaqsByCategory(
            String category
    );
}