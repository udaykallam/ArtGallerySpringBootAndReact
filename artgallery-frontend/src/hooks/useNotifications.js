import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";

import {
    getNotifications,
    getUnreadCount
} from "../services/notificationService";

function useNotifications() {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const clientRef = useRef(null);

    // ==========================================
    // LOAD EXISTING NOTIFICATIONS
    // ==========================================

    const loadNotifications = async () => {

        try {

            const data = await getNotifications();

            setNotifications(
                Array.isArray(data)
                    ? data
                    : []
            );

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

            const count = await getUnreadCount();

            setUnreadCount(
                typeof count === "number"
                    ? count
                    : 0
            );

        } catch (error) {

            console.error(
                "Failed to load unread count:",
                error
            );

        }

    };


    // ==========================================
    // HANDLE REAL-TIME NOTIFICATION
    // ==========================================

    const handleIncomingNotification = (
        notification
    ) => {

        setNotifications(previous => {

            // Prevent duplicate notifications
            const alreadyExists =
                previous.some(
                    item =>
                        item.id === notification.id
                );

            if (alreadyExists) {
                return previous;
            }

            return [
                notification,
                ...previous
            ];

        });

        setUnreadCount(
            previous => previous + 1
        );


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


        const client = new Client({

            brokerURL:
                "ws://localhost:8080/ws",


            // ==================================
            // IMPORTANT
            // SEND JWT TO STOMP CONNECTION
            // ==================================

            connectHeaders: {

                Authorization:
                    `Bearer ${token}`

            },


            reconnectDelay: 5000,


            debug: () => {
                // Disable STOMP debug logs
            },


            // ==================================
            // CONNECTED
            // ==================================

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

                            console.log(
                                "Real-time notification:",
                                notification
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


            // ==================================
            // STOMP ERROR
            // ==================================

            onStompError: frame => {

                console.error(
                    "STOMP error:",
                    frame
                );

            },


            // ==================================
            // WEBSOCKET ERROR
            // ==================================

            onWebSocketError: error => {

                console.error(
                    "WebSocket error:",
                    error
                );

            },


            // ==================================
            // DISCONNECTED
            // ==================================

            onDisconnect: () => {

                console.log(
                    "WebSocket disconnected."
                );

            }

        });


        client.activate();

        clientRef.current = client;


        // ======================================
        // CLEANUP
        // ======================================

        return () => {

            if (clientRef.current) {

                clientRef.current.deactivate();

                clientRef.current = null;

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