import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
    getSupportTicket,
    addSupportMessage
} from "../../services/supportService";


function SupportTicketPage() {

    const navigate = useNavigate();

    const { ticketId } = useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [ticket, setTicket] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [sending, setSending] =
        useState(false);

    const [message, setMessage] =
        useState("");


    // =====================================================
    // LOAD TICKET
    // =====================================================

    useEffect(() => {

        loadTicket();

    }, [ticketId]);


    const loadTicket = async () => {

        try {

            setLoading(true);

            const data =
                await getSupportTicket(
                    ticketId
                );

            setTicket(data);

        } catch (error) {

            console.error(
                "Failed to load support ticket:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load this support request."
            );

            navigate("/contact");

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const handleSendMessage = async (e) => {

        e.preventDefault();


        if (!message.trim()) {

            toast.error(
                "Please enter a message."
            );

            return;
        }


        if (
            ticket?.status === "CLOSED"
        ) {

            toast.error(
                "This support request is closed."
            );

            return;
        }


        try {

            setSending(true);


            // =================================================
            // IMPORTANT
            //
            // addSupportMessage expects:
            //
            // addSupportMessage(ticketId, "message")
            //
            // NOT:
            //
            // addSupportMessage(ticketId, { message })
            // =================================================

            await addSupportMessage(
                ticketId,
                message.trim()
            );


            setMessage("");


            toast.success(
                "Message sent."
            );


            // Reload conversation
            await loadTicket();


        } catch (error) {

            console.error(
                "Failed to send support message:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to send your message."
            );

        } finally {

            setSending(false);

        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date)
            .toLocaleString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                }
            );
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "OPEN":
                return "support-status-open";

            case "IN_PROGRESS":
                return "support-status-progress";

            case "RESOLVED":
                return "support-status-resolved";

            case "CLOSED":
                return "support-status-closed";

            default:
                return "";

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="loading-screen">

                <div className="load-mark">
                    ✦
                </div>

                <div className="load-text">
                    Loading support request...
                </div>

            </div>
        );
    }


    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!ticket) {

        return (

            <div className="loading-screen">

                <div className="load-mark">
                    ✦
                </div>

                <div className="load-text">
                    Support request not found.
                </div>

            </div>
        );

    }


    // =====================================================
    // CURRENT USER
    // =====================================================

    const currentUserId =
        Number(
            localStorage.getItem("userId")
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="container">

            <div className="support-ticket-page">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    className="support-ticket-back"
                    onClick={() =>
                        navigate("/contact")
                    }
                >
                    ← Back to Support
                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="support-ticket-page-header">

                    <div>

                        <div className="support-eyebrow">
                            Aurelian Concierge
                        </div>

                        <h1>
                            {ticket.subject}
                        </h1>

                        <div className="support-ticket-page-meta">

                            <span>
                                Request #{ticket.id}
                            </span>

                            <span>
                                •
                            </span>

                            <span>
                                {ticket.category}
                            </span>

                            {ticket.orderId && (

                                <>
                                    <span>
                                        •
                                    </span>

                                    <span>
                                        Order #{ticket.orderId}
                                    </span>
                                </>

                            )}

                        </div>

                    </div>


                    <div
                        className={
                            `support-ticket-status ${
                                getStatusClass(
                                    ticket.status
                                )
                            }`
                        }
                    >
                        {ticket.status}
                    </div>

                </div>


                {/* =================================================
                    DIVIDER
                ================================================= */}

                <div className="auth-divider" />


                {/* =================================================
                    CONVERSATION
                ================================================= */}

                <section className="support-conversation">


                    {/* =================================================
                        CONVERSATION HEADER
                    ================================================= */}

                    <div className="support-conversation-header">

                        <div>

                            <div className="support-card-eyebrow">
                                Support Conversation
                            </div>

                            <h2>
                                Messages
                            </h2>

                        </div>


                        <div className="support-conversation-date">

                            Created{" "}
                            {formatDate(
                                ticket.createdAt
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        MESSAGE LIST
                    ================================================= */}

                    <div className="support-message-list">

                        {Array.isArray(ticket.messages) &&
                        ticket.messages.length > 0 ? (

                            ticket.messages.map(
                                (item) => {

                                    const senderId =
                                        Number(
                                            item.sender?.id ??
                                            item.senderId
                                        );


                                    const isMine =
                                        senderId ===
                                        currentUserId;


                                    const senderName =
                                        item.sender?.name ||
                                        item.senderName ||
                                        "Support Team";


                                    return (

                                        <div
                                            key={
                                                item.id
                                            }
                                            className={
                                                isMine
                                                    ? "support-message support-message-mine"
                                                    : "support-message support-message-support"
                                            }
                                        >


                                            {/* =========================
                                                MESSAGE HEADER
                                            ========================= */}

                                            <div className="support-message-header">

                                                <div className="support-message-sender">


                                                    {/* AVATAR */}

                                                    <div className="support-message-avatar">

                                                        {senderName
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>


                                                    {/* NAME + DATE */}

                                                    <div>

                                                        <div className="support-message-name">

                                                            {isMine
                                                                ? "You"
                                                                : senderName}

                                                        </div>


                                                        <div className="support-message-date">

                                                            {formatDate(
                                                                item.createdAt
                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* =========================
                                                MESSAGE
                                            ========================= */}

                                            <div className="support-message-body">

                                                {item.message}

                                            </div>

                                        </div>

                                    );

                                }
                            )

                        ) : (

                            <div className="support-no-messages">

                                <div className="support-empty-mark">
                                    ✦
                                </div>

                                <p>
                                    No messages yet.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        REPLY
                    ================================================= */}

                    {ticket.status !== "CLOSED" ? (

                        <form
                            className="support-reply-form"
                            onSubmit={
                                handleSendMessage
                            }
                        >

                            <div className="support-card-eyebrow">
                                Continue Conversation
                            </div>


                            <textarea
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                placeholder="Write your message..."
                                rows={5}
                                maxLength={5000}
                                disabled={sending}
                            />


                            <div className="support-reply-footer">

                                <span>
                                    {message.length}/5000
                                </span>


                                <button
                                    type="submit"
                                    className="support-submit"
                                    disabled={
                                        sending ||
                                        !message.trim()
                                    }
                                >

                                    {sending
                                        ? "Sending..."
                                        : "Send Message"}

                                </button>

                            </div>

                        </form>

                    ) : (

                        <div className="support-closed-notice">

                            <div className="support-empty-mark">
                                ✓
                            </div>


                            <div>

                                <strong>
                                    This support request is closed.
                                </strong>

                                <p>
                                    You can create a new support
                                    request if you need further
                                    assistance.
                                </p>

                            </div>

                        </div>

                    )}

                </section>

            </div>


            {/* =====================================================
                PAGE CSS
            ===================================================== */}

            <style>{`

                .support-ticket-page {
                    min-height: calc(100vh - 80px);
                    max-width: 950px;
                    margin: 0 auto;
                    padding: 55px 25px 100px;
                }


                /* =================================================
                   BACK
                ================================================= */

                .support-ticket-back {
                    border: 0;
                    padding: 0;
                    background: transparent;
                    color: #8d948f;
                    font-family: inherit;
                    font-size: 13px;
                    cursor: pointer;
                    margin-bottom: 35px;
                    transition: color 0.2s ease;
                }


                .support-ticket-back:hover {
                    color: #c09a5d;
                }


                /* =================================================
                   HEADER
                ================================================= */

                .support-ticket-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 25px;
                }


                .support-ticket-page-header h1 {
                    margin: 0 0 15px;

                    font-family:
                        "Cormorant Garamond",
                        serif;

                    font-size:
                        clamp(
                            36px,
                            5vw,
                            55px
                        );

                    font-weight: 400;

                    line-height: 1.1;

                    color: #f0f0eb;
                }


                .support-ticket-page-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;

                    color: #707771;

                    font-size: 12px;
                }


                .support-ticket-page-header
                .support-ticket-status {
                    flex-shrink: 0;
                    margin-top: 5px;
                }


                /* =================================================
                   CONVERSATION
                ================================================= */

                .support-conversation {
                    background: #111512;
                    border: 1px solid #252b27;
                }


                .support-conversation-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;

                    gap: 20px;

                    padding: 30px;

                    border-bottom:
                        1px solid #252b27;
                }


                .support-conversation-header h2 {
                    margin: 0;

                    font-family:
                        "Cormorant Garamond",
                        serif;

                    font-size: 30px;

                    font-weight: 400;
                }


                .support-conversation-date {
                    color: #626963;
                    font-size: 11px;
                }


                /* =================================================
                   MESSAGE LIST
                ================================================= */

                .support-message-list {
                    padding: 30px;

                    display: flex;
                    flex-direction: column;

                    gap: 18px;
                }


                /* =================================================
                   MESSAGE
                ================================================= */

                .support-message {
                    max-width: 78%;

                    padding: 20px;

                    border:
                        1px solid #292f2b;
                }


                .support-message-mine {
                    align-self: flex-end;

                    background: #17201b;

                    border-color:
                        #3b473f;
                }


                .support-message-support {
                    align-self: flex-start;

                    background: #0d100e;
                }


                /* =================================================
                   MESSAGE HEADER
                ================================================= */

                .support-message-header {
                    margin-bottom: 15px;
                }


                .support-message-sender {
                    display: flex;
                    align-items: center;

                    gap: 11px;
                }


                .support-message-avatar {
                    width: 34px;
                    height: 34px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border:
                        1px solid #4a504b;

                    border-radius: 50%;

                    color: #c09a5d;

                    font-size: 13px;
                }


                .support-message-name {
                    color: #d9dcd7;

                    font-size: 13px;

                    font-weight: 500;
                }


                .support-message-date {
                    margin-top: 3px;

                    color: #626963;

                    font-size: 10px;
                }


                /* =================================================
                   MESSAGE BODY
                ================================================= */

                .support-message-body {
                    color: #b6bbb6;

                    font-size: 14px;

                    line-height: 1.75;

                    white-space: pre-wrap;

                    word-break: break-word;
                }


                /* =================================================
                   NO MESSAGES
                ================================================= */

                .support-no-messages {
                    padding: 45px;

                    text-align: center;

                    color: #707771;
                }


                .support-no-messages p {
                    margin: 0;

                    font-size: 13px;
                }


                /* =================================================
                   REPLY FORM
                ================================================= */

                .support-reply-form {
                    padding: 30px;

                    border-top:
                        1px solid #252b27;
                }


                .support-reply-form textarea {
                    width: 100%;

                    box-sizing: border-box;

                    margin-top: 15px;

                    padding: 15px;

                    min-height: 140px;

                    resize: vertical;

                    border:
                        1px solid #303631;

                    border-radius: 0;

                    outline: none;

                    background: #0d100e;

                    color: #e9ebe7;

                    font-family: inherit;

                    font-size: 14px;

                    line-height: 1.6;

                    transition:
                        border-color 0.2s ease,
                        background 0.2s ease;
                }


                .support-reply-form textarea:focus {
                    border-color: #92713d;

                    background: #101410;
                }


                .support-reply-form textarea:disabled {
                    opacity: 0.6;
                }


                /* =================================================
                   REPLY FOOTER
                ================================================= */

                .support-reply-footer {
                    display: flex;

                    justify-content:
                        space-between;

                    align-items: center;

                    gap: 20px;

                    margin-top: 12px;
                }


                .support-reply-footer span {
                    color: #626963;

                    font-size: 11px;
                }


                .support-reply-footer
                .support-submit {
                    width: auto;

                    min-width: 150px;
                }


                /* =================================================
                   CLOSED
                ================================================= */

                .support-closed-notice {
                    display: flex;

                    align-items: center;

                    gap: 20px;

                    padding:
                        25px 30px;

                    border-top:
                        1px solid #252b27;

                    background: #0d100e;
                }


                .support-closed-notice
                .support-empty-mark {
                    margin: 0;

                    flex-shrink: 0;
                }


                .support-closed-notice strong {
                    color: #c9cdc8;

                    font-size: 13px;
                }


                .support-closed-notice p {
                    margin:
                        5px 0 0;

                    color: #707771;

                    font-size: 12px;

                    line-height: 1.6;
                }


                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 650px) {

                    .support-ticket-page {
                        padding:
                            40px 16px 70px;
                    }


                    .support-ticket-page-header {
                        flex-direction: column;
                    }


                    .support-ticket-page-header
                    .support-ticket-status {
                        margin-top: 0;
                    }


                    .support-conversation-header {
                        flex-direction: column;

                        align-items:
                            flex-start;

                        padding: 23px;
                    }


                    .support-message-list {
                        padding: 20px;
                    }


                    .support-message {
                        max-width: 92%;
                    }


                    .support-reply-form {
                        padding: 23px;
                    }


                    .support-reply-footer {
                        align-items: stretch;

                        flex-direction: column;
                    }


                    .support-reply-footer
                    .support-submit {
                        width: 100%;
                    }

                }

            `}</style>

        </div>
    );
}


export default SupportTicketPage;