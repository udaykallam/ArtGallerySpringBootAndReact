package com.artgallery.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class ImageService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {

        try {

            Map<?, ?> result =
                    cloudinary.uploader()
                            .upload(
                                    file.getBytes(),
                                    Map.of()
                            );

            return result.get("secure_url")
                    .toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Image upload failed",
                    e
            );
        }
    }
}