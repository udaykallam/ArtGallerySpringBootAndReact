package com.artgallery.controller;

import com.artgallery.service.impl.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CUSTOMER','ARTIST','ADMIN')")
public class AccountController {

    private final AccountService accountService;


    @PutMapping("/deactivate")
    public ResponseEntity<String> deactivateAccount(
            Principal principal
    ) {

        accountService.deactivateAccount(
                principal.getName()
        );

        return ResponseEntity.ok(
                "Your account has been deactivated."
        );
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAccount(
            Principal principal
    ) {

        accountService.deleteAccount(
                principal.getName()
        );

        return ResponseEntity.ok(
                "Your account has been permanently deleted."
        );
    }
}