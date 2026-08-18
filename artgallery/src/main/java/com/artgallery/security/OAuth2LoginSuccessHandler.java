package com.artgallery.security;

import com.artgallery.entity.Role;
import com.artgallery.entity.User;
import com.artgallery.enums.RoleName;
import com.artgallery.repository.RoleRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.impl.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler
        implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private JwtService jwtService;


    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {


        // ==========================================
        // GET GOOGLE USER
        // ==========================================

        DefaultOAuth2User googleUser =
                (DefaultOAuth2User)
                        authentication.getPrincipal();


        String email =
                googleUser.getAttribute("email");

        String googleName =
                googleUser.getAttribute("name");


        if (email == null || email.isBlank()) {

            response.sendRedirect(
                    "http://localhost:5173/login?error=google_email_missing"
            );

            return;
        }


        // ==========================================
        // FIND EXISTING USER
        // ==========================================

        Optional<User> optionalUser =
                userRepo.findByEmail(email);

        User user;


        if (optionalUser.isPresent()) {

            user = optionalUser.get();


            // ======================================
            // UPDATE NAME IF NECESSARY
            // ======================================

            if (
                    googleName != null
                            &&
                            !googleName.isBlank()
                            &&
                            (
                                    user.getName() == null
                                            ||
                                            user.getName().isBlank()
                            )
            ) {

                user.setName(googleName);

                userRepo.save(user);
            }


        } else {


            // ==========================================
            // CREATE NEW GOOGLE USER
            // ==========================================

            Role customerRole =
                    roleRepo.findByName(
                                    RoleName.ROLE_CUSTOMER
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Customer role not found"
                                    )
                            );


            user = new User();

            user.setName(
                    googleName != null
                            ? googleName
                            : "Google User"
            );

            user.setEmail(email);

            // Google users don't use local password
            user.setPassword("GOOGLE_USER");

            user.setEnabled(true);

            user.setRole(customerRole);


            userRepo.save(user);
        }


        // ==========================================
        // GENERATE JWT
        // ==========================================

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        // ==========================================
        // REDIRECT TO REACT
        // ==========================================

        String redirectUrl =
                "http://localhost:5173/oauth-success"
                        + "?token="
                        + token
                        + "&role="
                        + user.getRole()
                        .getName()
                        .name()
                        + "&userId="
                        + user.getId()
                        + "&name="
                        + java.net.URLEncoder
                        .encode(
                                user.getName(),
                                java.nio.charset.StandardCharsets.UTF_8
                        );


        response.sendRedirect(
                redirectUrl
        );
    }
}