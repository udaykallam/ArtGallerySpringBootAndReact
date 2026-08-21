package com.artgallery.security;

import com.artgallery.service.impl.CustomUserDetailsService;
import com.artgallery.service.impl.JwtService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor
        implements ChannelInterceptor {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;


    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }


        // ==========================================
        // AUTHENTICATE STOMP CONNECT
        // ==========================================

        if (
                StompCommand.CONNECT.equals(
                        accessor.getCommand()
                )
        ) {

            String authorization =
                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );


            if (
                    authorization != null
                            &&
                            authorization.startsWith(
                                    "Bearer "
                            )
            ) {

                String token =
                        authorization.substring(7);

                try {

                    String email =
                            jwtService.extractUsername(
                                    token
                            );

                    UserDetails userDetails =
                            userDetailsService
                                    .loadUserByUsername(
                                            email
                                    );

                    if (
                            jwtService.isTokenValid(
                                    token,
                                    userDetails
                            )
                    ) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        accessor.setUser(
                                authentication
                        );

                    }

                } catch (Exception e) {

                    System.out.println(
                            "WebSocket authentication failed: "
                                    + e.getMessage()
                    );

                }

            }

        }

        return message;
    }
}