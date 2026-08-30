package com.artgallery.service.impl;

public class AccountDeactivatedException
        extends RuntimeException {

    public AccountDeactivatedException(
            String message
    ) {

        super(message);
    }
}