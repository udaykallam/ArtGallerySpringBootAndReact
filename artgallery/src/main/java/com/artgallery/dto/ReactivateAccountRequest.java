package com.artgallery.dto;

import lombok.Data;

@Data
public class ReactivateAccountRequest {

    private String email;

    private String password;

    private String otp;
}