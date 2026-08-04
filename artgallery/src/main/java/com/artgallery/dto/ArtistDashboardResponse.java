package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDashboardResponse {

    private Long totalArtworks;

    private Long totalOrders;

    private Long totalSales;

    private Double totalRevenue;

    private String topSellingArtwork;

    private Long monthlyOrders;

    private Double monthlyRevenue;
}