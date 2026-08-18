import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";

import {
    getNotifications,
    getUnreadCount
} from "../services/notificationService";


function useNotifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const clientRef = useRef(null);


    // ==========================================
    // LOAD EXISTING NOTIFICATIONS
    // ==========================================

    const loadNotifications = async () => {

        try {

            const data =
                await getNotifications();

            setNotifications(data);

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

        }
    };


    // ==========================================
    // LOAD UNREAD COUNT
    // ==========================================

    const loadUnreadCount = async () => {

        try {

            const count =
                await getUnreadCount();

            setUnreadCount(count);

        } catch (error) {

            console.error(
                "Failed to load unread count:",
                error
            );

        }
    };


    // ==========================================
    // ADD REAL-TIME NOTIFICATION
    // ==========================================

    const handleIncomingNotification = (
        notification
    ) => {

        setNotifications(
            previous => [
                notification,
                ...previous
            ]
        );

        setUnreadCount(
            previous => previous + 1
        );


        // ======================================
        // SHOW SONNER TOAST
        // ======================================

        toast(notification.title, {
            description:
                notification.message
        });
    };


    // ==========================================
    // CONNECT WEBSOCKET
    // ==========================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const role =
            localStorage.getItem("role");

        if (!token || !role) {

            return;
        }


        const client =
            new Client({

                brokerURL:
                    "ws://localhost:8080/ws",

                reconnectDelay:
                    5000,

                debug: () => {
                    // Keep empty in production
                },

                onConnect: () => {

                    console.log(
                        "WebSocket connected."
                    );


                    client.subscribe(
                        "/user/queue/notifications",

                        message => {

                            try {

                                const notification =
                                    JSON.parse(
                                        message.body
                                    );

                                handleIncomingNotification(
                                    notification
                                );

                            } catch (error) {

                                console.error(
                                    "Invalid notification:",
                                    error
                                );

                            }

                        }
                    );

                },

                onStompError: (
                    frame
                ) => {

                    console.error(
                        "STOMP error:",
                        frame
                    );

                },

                onWebSocketError: (
                    error
                ) => {

                    console.error(
                        "WebSocket error:",
                        error
                    );

                }

            });


        client.activate();

        clientRef.current =
            client;


        return () => {

            if (
                clientRef.current
            ) {

                clientRef.current.deactivate();

                clientRef.current =
                    null;
            }

        };

    }, []);


    // ==========================================
    // LOAD DATABASE NOTIFICATIONS
    // ==========================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            return;
        }

        loadNotifications();

        loadUnreadCount();

    }, []);


    return {

        notifications,

        setNotifications,

        unreadCount,

        setUnreadCount,

        loadNotifications,

        loadUnreadCount

    };
}


export default useNotifications;