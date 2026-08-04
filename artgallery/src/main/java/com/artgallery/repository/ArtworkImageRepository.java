package com.artgallery.repository;

import com.artgallery.entity.ArtworkImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtworkImageRepository extends JpaRepository<ArtworkImage, Long> {}