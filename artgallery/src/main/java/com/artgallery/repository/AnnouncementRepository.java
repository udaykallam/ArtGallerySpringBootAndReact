package com.artgallery.repository;

import com.artgallery.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository
        extends JpaRepository<Announcement, Long> {
}