package com.artgallery.controller;

import com.artgallery.dto.FaqResponse;
import com.artgallery.service.FaqService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FaqController {


    private final FaqService faqService;


    // =====================================================
    // ASK
    // =====================================================

    @GetMapping("/ask")
    public ResponseEntity<FaqResponse> ask(
            @RequestParam String q
    ) {

        return ResponseEntity.ok(
                faqService.ask(q)
        );
    }


    // =====================================================
    // POPULAR
    // =====================================================

    @GetMapping
    public ResponseEntity<List<FaqResponse>> getFaqs() {

        return ResponseEntity.ok(
                faqService.getPopularFaqs()
        );
    }


    // =====================================================
    // CATEGORY
    // =====================================================

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FaqResponse>> getByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                faqService.getFaqsByCategory(
                        category
                )
        );
    }
}