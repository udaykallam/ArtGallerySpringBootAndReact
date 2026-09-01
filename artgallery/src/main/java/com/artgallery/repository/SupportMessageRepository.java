package com.artgallery.repository;

import com.artgallery.entity.SupportMessage;
import com.artgallery.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportMessageRepository
        extends JpaRepository<SupportMessage, Long> {

    List<SupportMessage> findByTicketOrderByCreatedAtAsc(
            SupportTicket ticket
    );
}