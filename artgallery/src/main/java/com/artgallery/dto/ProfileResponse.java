package com.artgallery.dto;

import lombok.Data;

@Data
public class ProfileResponse {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String address;

    private String city;

    private String state;

    private String pincode;

    private String country;

    private String role;
}