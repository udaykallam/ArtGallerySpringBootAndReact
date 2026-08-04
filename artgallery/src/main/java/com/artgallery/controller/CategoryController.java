package com.artgallery.controller;

import com.artgallery.entity.Category;
import com.artgallery.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepo;

    @GetMapping
    public List<Category> getAll() {
        return categoryRepo.findAll();
    }
}