package com.artgallery.repository;

import com.artgallery.entity.SupportTicket;
import com.artgallery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository
        extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByUserOrderByCreatedAtDesc(
            User user
    );

    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}