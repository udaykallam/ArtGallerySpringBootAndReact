package com.artgallery.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry config
    ) {

        // Messages sent to /topic or /queue
        // are handled by the message broker.

        config.enableSimpleBroker(
                "/topic",
                "/queue"
        );

        // Messages sent from the client to the server
        // will use /app.

        config.setApplicationDestinationPrefixes(
                "/app"
        );

        // Prefix used for user-specific destinations.

        config.setUserDestinationPrefix(
                "/user"
        );
    }


    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry
    ) {

        registry.addEndpoint(
                        "/ws"
                )
                .setAllowedOrigins(
                        "http://localhost:5173"
                );
    }
}