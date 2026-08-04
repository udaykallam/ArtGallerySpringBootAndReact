package com.artgallery.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", "dcbuqh4cj",
                "api_key", "796339825861187",
                "api_secret", "HQlAS_F11obZNbDbYJfK4nRUdzY"
        ));
    }
}