import { useEffect, useRef, useState } from "react";

import {
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationService";

import useNotifications
    from "../hooks/useNotifications";


function NotificationBell() {

    const {
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount
    } = useNotifications();


    const [open, setOpen] =
        useState(false);

    const notificationRef =
        useRef(null);


    // ==========================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ==========================================

    useEffect(() => {

        const handleOutsideClick = (
            event
        ) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {

                setOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    const handleNotificationClick =
        async (notification) => {

            if (
                notification.read
            ) {

                return;
            }

            try {

                await markNotificationAsRead(
                    notification.id
                );

                setNotifications(
                    previous =>
                        previous.map(
                            item =>
                                item.id ===
                                notification.id

                                    ? {
                                        ...item,
                                        read: true
                                    }

                                    : item
                        )
                );

                setUnreadCount(
                    previous =>
                        Math.max(
                            previous - 1,
                            0
                        )
                );

            } catch (error) {

                console.error(
                    "Failed to mark notification as read:",
                    error
                );

            }

        };


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    const handleMarkAllRead =
        async () => {

            if (
                unreadCount === 0
            ) {

                return;
            }

            try {

                await markAllNotificationsAsRead();

                setNotifications(
                    previous =>
                        previous.map(
                            notification => ({
                                ...notification,
                                read: true
                            })
                        )
                );

                setUnreadCount(0);

            } catch (error) {

                console.error(
                    "Failed to mark all notifications as read:",
                    error
                );

            }

        };


    // ==========================================
    // TIME FORMAT
    // ==========================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleString(
            [],
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );
    };


    return (

        <div
            className="notification-wrapper"
            ref={notificationRef}
        >

            {/* ================================= */}
            {/* BELL */}
            {/* ================================= */}

            <button
                className="notification-bell"
                onClick={() =>
                    setOpen(
                        previous =>
                            !previous
                    )
                }
                aria-label="Notifications"
            >

                <span className="notification-icon">
                    🔔
                </span>


                {unreadCount > 0 && (

                    <span className="notification-badge">

                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}

                    </span>

                )}

            </button>


            {/* ================================= */}
            {/* DROPDOWN */}
            {/* ================================= */}

            {open && (

                <div
                    className="notification-dropdown"
                >

                    <div
                        className="notification-header"
                    >

                        <div>

                            <h3>
                                Notifications
                            </h3>

                            <span>
                                {unreadCount} unread
                            </span>

                        </div>


                        {unreadCount > 0 && (

                            <button
                                className="notification-read-all"
                                onClick={
                                    handleMarkAllRead
                                }
                            >
                                Mark all read
                            </button>

                        )}

                    </div>


                    <div
                        className="notification-list"
                    >

                        {notifications.length === 0 ? (

                            <div
                                className="notification-empty"
                            >

                                <div>
                                    🔔
                                </div>

                                <p>
                                    You're all caught up.
                                </p>

                            </div>

                        ) : (

                            notifications.map(
                                notification => (

                                    <button
                                        key={
                                            notification.id
                                        }
                                        className={
                                            `notification-item ${
                                                notification.read
                                                    ? ""
                                                    : "unread"
                                            }`
                                        }
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                    >

                                        <div
                                            className="notification-item-icon"
                                        >

                                            {notification.type ===
                                                "ORDER"
                                                ? "📦"
                                                : notification.type ===
                                                    "REVIEW"
                                                    ? "⭐"
                                                    : notification.type ===
                                                        "ARTWORK"
                                                        ? "🎨"
                                                        : "🔔"}

                                        </div>


                                        <div
                                            className="notification-item-content"
                                        >

                                            <div
                                                className="notification-item-title"
                                            >

                                                {
                                                    notification.title
                                                }

                                            </div>


                                            <div
                                                className="notification-item-message"
                                            >

                                                {
                                                    notification.message
                                                }

                                            </div>


                                            <div
                                                className="notification-item-date"
                                            >

                                                {
                                                    formatDate(
                                                        notification.createdAt
                                                    )
                                                }

                                            </div>

                                        </div>


                                        {!notification.read && (

                                            <span
                                                className="notification-unread-dot"
                                            />

                                        )}

                                    </button>

                                )
                            )

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}


export default NotificationBell;