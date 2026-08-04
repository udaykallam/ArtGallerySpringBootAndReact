package com.artgallery.security;

import com.artgallery.entity.User;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.impl.CustomUserDetailsService;
import com.artgallery.service.impl.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepo;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )
            throws ServletException, IOException {

        String authHeader =
                request.getHeader(
                        "Authorization"
                );

        if (
                authHeader == null
                        ||
                        !authHeader.startsWith(
                                "Bearer "
                        )
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authHeader.substring(7);

        String username;

        try {

            username =
                    jwtService.extractUsername(
                            token
                    );

        } catch (Exception e) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "Token expired"
            );

            return;
        }

        if (
                username != null
                        &&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                == null
        ) {

            User user =
                    userRepo.findByEmail(
                                    username
                            )
                            .orElse(null);

            if (
                    user == null
                            ||
                            !user.isEnabled()
            ) {

                response.setStatus(
                        HttpServletResponse.SC_FORBIDDEN
                );

                response.getWriter().write(
                        "Account suspended"
                );

                return;
            }

            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(
                                    username
                            );

            if (
                    !jwtService.isTokenValid(
                            token,
                            userDetails
                    )
            ) {

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.getWriter().write(
                        "Token expired"
                );

                return;
            }

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(
                                    request
                            )
            );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authToken
                    );
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}