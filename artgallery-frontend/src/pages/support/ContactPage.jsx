import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
    createSupportTicket,
    getMySupportTickets
} from "../../services/supportService";


function ContactPage() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [subject, setSubject] =
        useState("");

    const [category, setCategory] =
        useState("ORDER");

    const [orderId, setOrderId] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [tickets, setTickets] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [ticketsLoading, setTicketsLoading] =
        useState(false);


    const token =
        localStorage.getItem("token");


    // =====================================================
    // LOAD MY TICKETS
    // =====================================================

    useEffect(() => {

        if (token) {

            loadTickets();

        }

    }, [token]);


    const loadTickets = async () => {

        setTicketsLoading(true);

        try {

            const data =
                await getMySupportTickets();

            setTickets(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load support tickets:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to load your support requests."
            );

        } finally {

            setTicketsLoading(false);

        }
    };


    // =====================================================
    // SUBMIT SUPPORT TICKET
    // =====================================================

    const submitTicket = async (e) => {

        e.preventDefault();


        if (!token) {

            toast.error(
                "Please login to contact support."
            );

            navigate("/login");

            return;
        }


        if (!subject.trim()) {

            toast.error(
                "Please enter a subject."
            );

            return;
        }


        if (!message.trim()) {

            toast.error(
                "Please describe your issue."
            );

            return;
        }


        setLoading(true);


        try {

            const response =
                await createSupportTicket({

                    subject:
                        subject.trim(),

                    category,

                    orderId:
                        orderId.trim()
                            ? Number(orderId)
                            : null,

                    message:
                        message.trim()
                });


            toast.success(
                "Support ticket created successfully."
            );


            // =================================================
            // RESET FORM
            // =================================================

            setSubject("");

            setCategory("ORDER");

            setOrderId("");

            setMessage("");


            // =================================================
            // REFRESH TICKETS
            // =================================================

            await loadTickets();


            // =================================================
            // SCROLL TO TICKETS
            // =================================================

            setTimeout(() => {

                document
                    .getElementById(
                        "my-support-tickets"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }, 100);


            console.log(
                "Created ticket:",
                response
            );

        } catch (error) {

            console.error(
                "Support ticket error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to create support ticket."
            );

        } finally {

            setLoading(false);

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
            .toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
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
    // OPEN TICKET
    // =====================================================

    const openTicket = (ticketId) => {

        navigate(
            `/contact/tickets/${ticketId}`
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="support-page">


            {/* =================================================
                INTERNAL CSS
            ================================================= */}

            <style>{`

                .support-page {
                    min-height: calc(100vh - 80px);
                    padding: 70px 30px 100px;
                    background:
                        radial-gradient(
                            circle at top,
                            rgba(255,255,255,0.025),
                            transparent 40%
                        );
                }


                .support-container {
                    width: 100%;
                    max-width: 1180px;
                    margin: 0 auto;
                }


                /* =================================================
                   HERO
                ================================================= */

                .support-hero {
                    text-align: center;
                    max-width: 760px;
                    margin: 0 auto 65px;
                }


                .support-eyebrow {
                    font-size: 12px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #b58a45;
                    margin-bottom: 15px;
                }


                .support-hero h1 {
                    margin: 0;
                    font-family:
                        "Cormorant Garamond",
                        serif;
                    font-size: clamp(
                        42px,
                        6vw,
                        68px
                    );
                    font-weight: 400;
                    letter-spacing: -1px;
                }


                .support-hero p {
                    margin: 20px auto 0;
                    max-width: 620px;
                    color: #9ca39e;
                    font-size: 16px;
                    line-height: 1.8;
                }


                /* =================================================
                   QUICK HELP
                ================================================= */

                .support-topics {
                    display: grid;
                    grid-template-columns:
                        repeat(5, 1fr);
                    gap: 12px;
                    margin-bottom: 60px;
                }


                .support-topic {
                    padding: 22px 15px;
                    background: #111512;
                    border: 1px solid #252b27;
                    text-align: center;
                    transition:
                        border-color 0.2s ease,
                        transform 0.2s ease,
                        background 0.2s ease;
                }


                .support-topic:hover {
                    border-color: #806331;
                    background: #151915;
                    transform: translateY(-3px);
                }


                .support-topic-icon {
                    font-size: 23px;
                    margin-bottom: 10px;
                }


                .support-topic-title {
                    font-family:
                        "Cormorant Garamond",
                        serif;
                    font-size: 18px;
                }


                .support-topic-text {
                    margin-top: 5px;
                    color: #707771;
                    font-size: 11px;
                    line-height: 1.4;
                }


                /* =================================================
                   MAIN GRID
                ================================================= */

                .support-grid {
                    display: grid;
                    grid-template-columns:
                        minmax(0, 1.35fr)
                        minmax(280px, 0.65fr);
                    gap: 25px;
                    align-items: start;
                }


                /* =================================================
                   FORM CARD
                ================================================= */

                .support-card {
                    background: #111512;
                    border: 1px solid #252b27;
                    padding: 38px;
                }


                .support-card-header {
                    margin-bottom: 30px;
                }


                .support-card-eyebrow {
                    color: #b58a45;
                    font-size: 11px;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    margin-bottom: 9px;
                }


                .support-card h2 {
                    margin: 0;
                    font-family:
                        "Cormorant Garamond",
                        serif;
                    font-size: 32px;
                    font-weight: 400;
                }


                .support-card-subtitle {
                    margin-top: 9px;
                    color: #777e78;
                    font-size: 14px;
                    line-height: 1.6;
                }


                /* =================================================
                   FORM
                ================================================= */

                .support-form {
                    display: flex;
                    flex-direction: column;
                    gap: 21px;
                }


                .support-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }


                .support-field label {
                    font-size: 11px;
                    letter-spacing: 1.7px;
                    text-transform: uppercase;
                    color: #8d948f;
                }


                .support-field input,
                .support-field select,
                .support-field textarea {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 13px 14px;
                    border: 1px solid #303631;
                    border-radius: 0;
                    outline: none;
                    background: #0d100e;
                    color: #e9ebe7;
                    font-family: inherit;
                    font-size: 14px;
                    transition:
                        border-color 0.2s ease,
                        background 0.2s ease;
                }


                .support-field input:focus,
                .support-field select:focus,
                .support-field textarea:focus {
                    border-color: #92713d;
                    background: #101410;
                }


                .support-field textarea {
                    min-height: 150px;
                    resize: vertical;
                    line-height: 1.6;
                }


                .support-field-row {
                    display: grid;
                    grid-template-columns:
                        1fr 1fr;
                    gap: 18px;
                }


                .support-submit {
                    width: 100%;
                    margin-top: 5px;
                    padding: 15px 20px;
                    border: 1px solid #a47a3c;
                    background: #27332d;
                    color: #f4f3ed;
                    font-family: inherit;
                    font-size: 12px;
                    letter-spacing: 1.8px;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition:
                        background 0.2s ease,
                        border-color 0.2s ease;
                }


                .support-submit:hover {
                    background: #334139;
                    border-color: #c09a5d;
                }


                .support-submit:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }


                /* =================================================
                   SIDE INFO
                ================================================= */

                .support-side {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }


                .support-info-card {
                    padding: 28px;
                    background: #111512;
                    border: 1px solid #252b27;
                }


                .support-info-icon {
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 18px;
                    border: 1px solid #393f3a;
                    background: #0d100e;
                    font-size: 19px;
                }


                .support-info-card h3 {
                    margin: 0 0 8px;
                    font-family:
                        "Cormorant Garamond",
                        serif;
                    font-size: 23px;
                    font-weight: 400;
                }


                .support-info-card p {
                    margin: 0;
                    color: #7c837e;
                    font-size: 13px;
                    line-height: 1.7;
                }


                .support-ai-card {
                    border-color: #66502e;
                    background:
                        linear-gradient(
                            135deg,
                            #141713,
                            #101310
                        );
                }


                .support-ai-card .support-info-icon {
                    border-color: #66502e;
                    color: #c19a5b;
                }


                .support-ai-label {
                    color: #b58a45;
                    font-size: 10px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 7px;
                }


                /* =================================================
                   MY TICKETS
                ================================================= */

                .support-tickets-section {
                    margin-top: 70px;
                }


                .support-tickets-header {
                    margin-bottom: 25px;
                }


                .support-tickets-header .support-card-eyebrow {
                    margin-bottom: 8px;
                }


                .support-tickets-header h2 {
                    margin: 0;
                    font-family:
                        "Cormorant Garamond",
                        serif;
                    font-size: 35px;
                    font-weight: 400;
                }


                .support-ticket-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }


                .support-ticket {
                    display: grid;
                    grid-template-columns:
                        80px
                        1fr
                        auto;
                    gap: 20px;
                    align-items: center;
                    padding: 20px 22px;
                    background: #111512;
                    border: 1px solid #252b27;
                    cursor: pointer;
                    transition:
                        border-color 0.2s ease,
                        background 0.2s ease;
                }


                .support-ticket:hover {
                    border-color: #67512f;
                    background: #151915;
                }


                .support-ticket-number {
                    color: #b58a45;
                    font-size: 11px;
                    letter-spacing: 1px;
                }


                .support-ticket-subject {
                    font-family:
                        "Cormorant Garamond",
                        serif;
                    font-size: 20px;
                    margin-bottom: 4px;
                }


                .support-ticket-meta {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    color: #6e756f;
                    font-size: 11px;
                }


                .support-ticket-status {
                    padding: 6px 10px;
                    border: 1px solid #343a35;
                    font-size: 10px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }


                .support-status-open {
                    color: #c09a5d;
                    border-color: #66502e;
                }


                .support-status-progress {
                    color: #aaa;
                }


                .support-status-resolved {
                    color: #91a996;
                    border-color: #405447;
                }


                .support-status-closed {
                    color: #707771;
                }


                .support-empty {
                    padding: 45px 25px;
                    text-align: center;
                    background: #111512;
                    border: 1px solid #252b27;
                }


                .support-empty-mark {
                    color: #8f6c36;
                    font-size: 25px;
                    margin-bottom: 10px;
                }


                .support-empty h3 {
                    margin: 0 0 7px;
                    font-family:
                        "Cormorant Garamond",
                        serif;
                    font-size: 24px;
                    font-weight: 400;
                }


                .support-empty p {
                    margin: 0;
                    color: #707771;
                    font-size: 13px;
                }


                /* =================================================
                   LOGIN NOTICE
                ================================================= */

                .support-login-notice {
                    margin-top: 25px;
                    padding: 18px 20px;
                    border: 1px solid #393f3a;
                    background: #111512;
                    color: #7e857f;
                    font-size: 13px;
                    line-height: 1.6;
                }


                .support-login-notice button {
                    margin-left: 5px;
                    padding: 0;
                    border: 0;
                    background: transparent;
                    color: #b58a45;
                    font-family: inherit;
                    cursor: pointer;
                }


                /* =================================================
                   LOADING
                ================================================= */

                .support-loading {
                    padding: 30px;
                    text-align: center;
                    color: #707771;
                    font-size: 13px;
                }


                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 900px) {

                    .support-topics {
                        grid-template-columns:
                            repeat(3, 1fr);
                    }


                    .support-grid {
                        grid-template-columns: 1fr;
                    }

                }


                @media (max-width: 600px) {

                    .support-page {
                        padding:
                            45px 16px 70px;
                    }


                    .support-topics {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }


                    .support-card {
                        padding: 25px 20px;
                    }


                    .support-field-row {
                        grid-template-columns: 1fr;
                    }


                    .support-ticket {
                        grid-template-columns: 1fr;
                        gap: 9px;
                    }


                    .support-ticket-status {
                        width: fit-content;
                    }

                }

            `}</style>


            <div className="support-container">


                {/* =================================================
                    HERO
                ================================================= */}

                <section className="support-hero">

                    <div className="support-eyebrow">
                        Aurelian Concierge
                    </div>

                    <h1>
                        Contact & Support
                    </h1>

                    <p>
                        Whether you need assistance with an
                        order, an artwork, your account, or
                        anything else, our support team is here
                        to help.
                    </p>

                </section>


                {/* =================================================
                    QUICK TOPICS
                ================================================= */}

                <section className="support-topics">

                    <div className="support-topic">

                        <div className="support-topic-icon">
                            📦
                        </div>

                        <div className="support-topic-title">
                            Orders
                        </div>

                        <div className="support-topic-text">
                            Delivery & tracking
                        </div>

                    </div>


                    <div className="support-topic">

                        <div className="support-topic-icon">
                            💳
                        </div>

                        <div className="support-topic-title">
                            Payments
                        </div>

                        <div className="support-topic-text">
                            Payment assistance
                        </div>

                    </div>


                    <div className="support-topic">

                        <div className="support-topic-icon">
                            🎨
                        </div>

                        <div className="support-topic-title">
                            Artwork
                        </div>

                        <div className="support-topic-text">
                            Collection questions
                        </div>

                    </div>


                    <div className="support-topic">

                        <div className="support-topic-icon">
                            👤
                        </div>

                        <div className="support-topic-title">
                            Account
                        </div>

                        <div className="support-topic-text">
                            Profile & security
                        </div>

                    </div>


                    <div className="support-topic">

                        <div className="support-topic-icon">
                            ⚙
                        </div>

                        <div className="support-topic-title">
                            Technical
                        </div>

                        <div className="support-topic-text">
                            Website assistance
                        </div>

                    </div>

                </section>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <section className="support-grid">


                    {/* =================================================
                        CONTACT FORM
                    ================================================= */}

                    <div className="support-card">

                        <div className="support-card-header">

                            <div className="support-card-eyebrow">
                                Support Desk
                            </div>

                            <h2>
                                How can we help?
                            </h2>

                            <p className="support-card-subtitle">
                                Tell us what you need assistance
                                with and our team will get back
                                to you.
                            </p>

                        </div>


                        {token ? (

                            <form
                                className="support-form"
                                onSubmit={submitTicket}
                            >


                                {/* SUBJECT */}

                                <div className="support-field">

                                    <label>
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) =>
                                            setSubject(
                                                e.target.value
                                            )
                                        }
                                        placeholder="What can we help you with?"
                                        maxLength={150}
                                    />

                                </div>


                                {/* CATEGORY + ORDER */}

                                <div className="support-field-row">

                                    <div className="support-field">

                                        <label>
                                            Category
                                        </label>

                                        <select
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="ORDER">
                                                Order & Delivery
                                            </option>

                                            <option value="PAYMENT">
                                                Payment
                                            </option>

                                            <option value="ARTWORK">
                                                Artwork
                                            </option>

                                            <option value="ACCOUNT">
                                                Account
                                            </option>

                                            <option value="TECHNICAL">
                                                Technical Issue
                                            </option>

                                            <option value="OTHER">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    <div className="support-field">

                                        <label>
                                            Order ID
                                            <span>
                                                {" "}(
                                                Optional
                                                )
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={orderId}
                                            onChange={(e) =>
                                                setOrderId(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. 1024"
                                        />

                                    </div>

                                </div>


                                {/* MESSAGE */}

                                <div className="support-field">

                                    <label>
                                        Message
                                    </label>

                                    <textarea
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Please describe your issue in detail..."
                                        maxLength={5000}
                                    />

                                </div>


                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    className="support-submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Sending..."
                                        : "Send Support Request"
                                    }

                                </button>

                            </form>

                        ) : (

                            <div className="support-login-notice">

                                Please login to create a
                                support request.

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                >
                                    Login to continue
                                </button>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        SIDE INFORMATION
                    ================================================= */}

                    <aside className="support-side">


                        <div className="support-info-card">

                            <div className="support-info-icon">
                                ✉
                            </div>

                            <h3>
                                Support Team
                            </h3>

                            <p>
                                Send us a support request and
                                our team will review it as soon
                                as possible.
                            </p>

                        </div>


                        <div className="support-info-card">

                            <div className="support-info-icon">
                                ◷
                            </div>

                            <h3>
                                Support Hours
                            </h3>

                            <p>
                                Our support team reviews
                                requests during regular
                                business hours.
                            </p>

                        </div>


                        <div className="support-info-card support-ai-card">

                            <div className="support-info-icon">
                                ✦
                            </div>

                            <div className="support-ai-label">
                                Coming Soon
                            </div>

                            <h3>
                                Aurelian AI
                            </h3>

                            <p>
                                Need a quick answer? Our AI
                                support assistant will soon be
                                available to help with orders,
                                artwork information, account
                                questions and more.
                            </p>

                        </div>

                    </aside>

                </section>


                {/* =================================================
                    MY SUPPORT REQUESTS
                ================================================= */}

                {token && (

                    <section
                        className="support-tickets-section"
                        id="my-support-tickets"
                    >

                        <div className="support-tickets-header">

                            <div className="support-card-eyebrow">
                                Your Requests
                            </div>

                            <h2>
                                My Support Requests
                            </h2>

                        </div>


                        {ticketsLoading ? (

                            <div className="support-loading">
                                Loading your support requests...
                            </div>

                        ) : tickets.length === 0 ? (

                            <div className="support-empty">

                                <div className="support-empty-mark">
                                    ✦
                                </div>

                                <h3>
                                    No support requests yet
                                </h3>

                                <p>
                                    When you contact our support
                                    team, your requests will appear
                                    here.
                                </p>

                            </div>

                        ) : (

                            <div className="support-ticket-list">

                                {tickets.map(
                                    ticket => (

                                        <div
                                            key={ticket.id}
                                            className="support-ticket"
                                            onClick={() =>
                                                openTicket(
                                                    ticket.id
                                                )
                                            }
                                        >

                                            <div className="support-ticket-number">

                                                #
                                                {ticket.id}

                                            </div>


                                            <div>

                                                <div className="support-ticket-subject">

                                                    {ticket.subject}

                                                </div>


                                                <div className="support-ticket-meta">

                                                    <span>
                                                        {ticket.category}
                                                    </span>

                                                    <span>
                                                        {formatDate(
                                                            ticket.createdAt
                                                        )}
                                                    </span>

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

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}

            </div>

        </div>
    );
}


export default ContactPage;