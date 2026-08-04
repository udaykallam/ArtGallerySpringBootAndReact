package com.artgallery.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private final String SECRET =
            "mysecretkeymysecretkeymysecretkey";

    private Key getSignKey() {

        return Keys.hmacShaKeyFor(
                SECRET.getBytes()
        );
    }

    public String generateToken(String username) {

        return generateToken(
                new HashMap<>(),
                username
        );

    }

    public String generateToken(
            Map<String, Object> claims,
            String username
    ) {

        return Jwts.builder()

                .setClaims(claims)

                .setSubject(username)

                .setIssuedAt(
                        new Date()
                )

                .setExpiration(
                        new Date(
                                System.currentTimeMillis() + 86400000
                        )
                )

                .signWith(
                        getSignKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();

    }

    public String extractUsername(
            String token
    ) {

        return extractAllClaims(token)
                .getSubject();
    }

    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parserBuilder()
                .setSigningKey(
                        getSignKey()
                )
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Date extractExpiration(
            String token
    ) {

        return extractAllClaims(token)
                .getExpiration();
    }

    private boolean isTokenExpired(
            String token
    ) {

        return extractExpiration(token)
                .before(new Date());
    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        final String username =
                extractUsername(token);

        return username.equals(
                userDetails.getUsername()
        )
                &&
                !isTokenExpired(token);
    }
}