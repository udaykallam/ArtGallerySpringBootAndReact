package com.artgallery.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaqResponse {

    private boolean found;

    private String question;

    private String answer;

    private String category;
}