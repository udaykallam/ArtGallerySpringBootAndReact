package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private Long totalUsers;

    private Long totalArtists;

    private Long totalCustomers;

    private Long totalArtworks;

    private Long totalOrders;

    private Double totalRevenue;
}