package com.artgallery.repository;

import com.artgallery.entity.Order;
import com.artgallery.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);
    long count();

    @Query("""
       SELECT COALESCE(SUM(o.totalAmount),0)
       FROM Order o
       """)
    Double getTotalRevenue();

    @Modifying
    @Transactional
    void deleteAllByUserId(Long userId);
}