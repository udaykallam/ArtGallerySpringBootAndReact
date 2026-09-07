package com.artgallery.service.impl;

import com.artgallery.dto.FaqResponse;
import com.artgallery.entity.Faq;
import com.artgallery.repository.FaqRepository;
import com.artgallery.service.FaqService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FaqServiceImpl
        implements FaqService {


    private final FaqRepository faqRepository;


    // =====================================================
    // ASK FAQ ASSISTANT
    // =====================================================

    @Override
    public FaqResponse ask(
            String question
    ) {

        if (
                question == null ||
                        question.trim().isEmpty()
        ) {

            return notFound();
        }


        String normalizedQuestion =
                normalize(question);


        List<Faq> faqs =
                faqRepository.findByActiveTrue();


        Faq bestMatch = null;

        int bestScore = 0;


        for (Faq faq : faqs) {

            int score =
                    calculateScore(
                            normalizedQuestion,
                            faq
                    );


            if (score > bestScore) {

                bestScore = score;

                bestMatch = faq;
            }
        }


        // =================================================
        // MINIMUM CONFIDENCE
        // =================================================

        if (
                bestMatch == null ||
                        bestScore < 2
        ) {

            return notFound();
        }


        return convertToResponse(
                bestMatch
        );
    }


    // =====================================================
    // POPULAR FAQS
    // =====================================================

    @Override
    public List<FaqResponse> getPopularFaqs() {

        return faqRepository
                .findByActiveTrue()
                .stream()
                .limit(6)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // CATEGORY FAQS
    // =====================================================

    @Override
    public List<FaqResponse> getFaqsByCategory(
            String category
    ) {

        if (
                category == null ||
                        category.trim().isEmpty()
        ) {

            return List.of();
        }


        return faqRepository
                .findByCategoryAndActiveTrue(
                        category.trim().toUpperCase()
                )
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // MATCHING
    // =====================================================

    private int calculateScore(
            String question,
            Faq faq
    ) {

        int score = 0;


        String faqQuestion =
                normalize(
                        faq.getQuestion()
                );


        // -------------------------------------------------
        // Exact question
        // -------------------------------------------------

        if (
                question.equals(
                        faqQuestion
                )
        ) {

            return 100;
        }


        // -------------------------------------------------
        // Complete question contains FAQ
        // -------------------------------------------------

        if (
                question.contains(
                        faqQuestion
                )
        ) {

            score += 10;
        }


        // -------------------------------------------------
        // FAQ contains customer's question
        // -------------------------------------------------

        if (
                faqQuestion.contains(
                        question
                )
        ) {

            score += 8;
        }


        // -------------------------------------------------
        // Word matching
        // -------------------------------------------------

        Set<String> questionWords =
                meaningfulWords(
                        question
                );

        Set<String> faqWords =
                meaningfulWords(
                        faqQuestion
                );


        for (String word : questionWords) {

            if (
                    faqWords.contains(word)
            ) {

                score += 2;
            }
        }


        // -------------------------------------------------
        // Keyword matching
        // -------------------------------------------------

        if (
                faq.getKeywords() != null &&
                        !faq.getKeywords()
                                .trim()
                                .isEmpty()
        ) {

            Set<String> keywords =
                    meaningfulWords(
                            normalize(
                                    faq.getKeywords()
                            )
                    );


            for (String word : questionWords) {

                if (
                        keywords.contains(word)
                ) {

                    score += 3;
                }
            }
        }


        return score;
    }


    // =====================================================
    // NORMALIZE
    // =====================================================

    private String normalize(
            String value
    ) {

        return value
                .toLowerCase()
                .replaceAll(
                        "[^a-z0-9\\s]",
                        " "
                )
                .replaceAll(
                        "\\s+",
                        " "
                )
                .trim();
    }


    // =====================================================
    // MEANINGFUL WORDS
    // =====================================================

    private Set<String> meaningfulWords(
            String value
    ) {

        Set<String> ignoredWords =
                Set.of(
                        "the",
                        "a",
                        "an",
                        "is",
                        "are",
                        "am",
                        "i",
                        "me",
                        "my",
                        "to",
                        "of",
                        "for",
                        "and",
                        "or",
                        "can",
                        "could",
                        "would",
                        "how",
                        "what",
                        "where",
                        "when",
                        "do",
                        "does",
                        "did",
                        "please",
                        "you",
                        "your"
                );


        return Arrays.stream(
                        value.split("\\s+")
                )
                .filter(
                        word ->
                                word.length() > 2
                )
                .filter(
                        word ->
                                !ignoredWords.contains(
                                        word
                                )
                )
                .collect(
                        Collectors.toSet()
                );
    }


    // =====================================================
    // CONVERT
    // =====================================================

    private FaqResponse convertToResponse(
            Faq faq
    ) {

        FaqResponse response =
                new FaqResponse();


        response.setFound(true);

        response.setQuestion(
                faq.getQuestion()
        );

        response.setAnswer(
                faq.getAnswer()
        );

        response.setCategory(
                faq.getCategory()
        );


        return response;
    }


    // =====================================================
    // NOT FOUND
    // =====================================================

    private FaqResponse notFound() {

        FaqResponse response =
                new FaqResponse();

        response.setFound(false);

        response.setQuestion(null);

        response.setAnswer(
                "I'm sorry, I couldn't find a reliable " +
                        "answer to that question. " +
                        "You can create a support request and " +
                        "our team will be happy to help."
        );

        response.setCategory(null);

        return response;
    }
}