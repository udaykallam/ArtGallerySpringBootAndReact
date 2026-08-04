package com.artgallery.controller;

import com.artgallery.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) {
        return imageService.uploadImage(file);
    }

    @GetMapping
    public String test() {
        return "Secured API Working!";
    }
}