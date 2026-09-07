import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
    createSupportTicket,
    getMySupportTickets
} from "../../services/supportService";


function ContactPage() {

    const navigate = useNavigate();


    // =====================================================
    // SUPPORT TICKET STATE
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


    // =====================================================
    // AURELIAN ASSISTANT STATE
    // =====================================================

    const [assistantQuestion, setAssistantQuestion] =
        useState("");

    const [assistantAnswer, setAssistantAnswer] =
        useState(null);

    const [assistantLoading, setAssistantLoading] =
        useState(false);

    const [assistantHelpful, setAssistantHelpful] =
        useState(null);


    const token =
        localStorage.getItem("token");


    // =====================================================
    // FAQ DATABASE
    // FRONTEND ONLY
    // =====================================================

    const faqs = useMemo(() => [

        {
            category: "ORDER",
            question: "How can I track my order?",
            keywords: [
                "track",
                "tracking",
                "order status",
                "where is my order",
                "order location",
                "delivery status"
            ],
            answer:
                "You can track your order from the Orders section of your account. Open the order you want to track to view its current status and delivery information."
        },

        {
            category: "ORDER",
            question: "Can I cancel my order?",
            keywords: [
                "cancel",
                "cancellation",
                "cancel order",
                "stop order"
            ],
            answer:
                "You can request cancellation if your order has not already been processed or shipped. Open your order details to check whether cancellation is available. If you cannot cancel it there, please contact our support team."
        },

        {
            category: "ORDER",
            question: "How long does delivery take?",
            keywords: [
                "delivery",
                "shipping",
                "how long",
                "arrive",
                "when will",
                "delivery time",
                "shipping time"
            ],
            answer:
                "Delivery time depends on your location and the artwork. You can view the latest delivery status from the Orders section of your account."
        },

        {
            category: "ORDER",
            question: "Where can I see my orders?",
            keywords: [
                "my orders",
                "orders",
                "order history",
                "purchase history",
                "previous orders"
            ],
            answer:
                "You can view your orders from the Orders section of your Aurelian Gallery account. Each order contains its items, status and other available details."
        },

        {
            category: "PAYMENT",
            question: "What payment methods are accepted?",
            keywords: [
                "payment",
                "pay",
                "payment methods",
                "credit card",
                "debit card",
                "upi",
                "card"
            ],
            answer:
                "The payment methods available to you are displayed during checkout. Select your preferred available payment method before placing your order."
        },

        {
            category: "PAYMENT",
            question: "What happens if my payment fails?",
            keywords: [
                "payment failed",
                "payment failure",
                "failed payment",
                "transaction failed",
                "payment error",
                "payment problem"
            ],
            answer:
                "If a payment fails, your order will not be successfully placed. Please try the payment again or use another available payment method. If money was deducted from your account, please contact our support team."
        },

        {
            category: "PAYMENT",
            question: "I was charged but my order was not created.",
            keywords: [
                "charged",
                "money deducted",
                "amount deducted",
                "payment deducted",
                "order not created",
                "money taken",
                "charged but",
                "payment successful"
            ],
            answer:
                "If your account was charged but an order was not created, please avoid making repeated payments. Check your Orders section first. If the order is still missing, create a support request and include the payment details so our team can investigate."
        },

        {
            category: "ARTWORK",
            question: "Are the artworks original?",
            keywords: [
                "original",
                "authentic",
                "authenticity",
                "genuine",
                "real artwork",
                "original artwork"
            ],
            answer:
                "Artwork authenticity and details are provided on the individual artwork page. Please review the artwork information carefully before purchasing."
        },

        {
            category: "ARTWORK",
            question: "Can I return an artwork?",
            keywords: [
                "return",
                "refund",
                "return artwork",
                "send back",
                "exchange"
            ],
            answer:
                "Return eligibility depends on the order and the applicable return policy. Please check your order details or contact our support team for assistance with a return request."
        },

        {
            category: "ARTWORK",
            question: "Where can I find information about an artwork?",
            keywords: [
                "artwork information",
                "artwork details",
                "artist",
                "art details",
                "painting details",
                "collection"
            ],
            answer:
                "Open the artwork's details page to view the available information about the artwork, including its artist, description and other collection details."
        },

        {
            category: "ACCOUNT",
            question: "How do I change my password?",
            keywords: [
                "password",
                "change password",
                "new password",
                "reset password",
                "account password"
            ],
            answer:
                "You can change your password from the Change Password section of your account. You will need to provide your current password and your new password."
        },

        {
            category: "ACCOUNT",
            question: "How do I deactivate my account?",
            keywords: [
                "deactivate",
                "deactivation",
                "disable account",
                "close account",
                "account deactivation"
            ],
            answer:
                "You can deactivate your account from the Settings page. Account deactivation may require email OTP verification."
        },

        {
            category: "ACCOUNT",
            question: "How do I contact support?",
            keywords: [
                "support",
                "contact support",
                "customer service",
                "help",
                "contact"
            ],
            answer:
                "You're already in the right place. You can create a support request using the Support Desk below. Your support requests will also appear in the My Support Requests section."
        },

        {
            category: "TECHNICAL",
            question: "The website is not working properly.",
            keywords: [
                "website",
                "not working",
                "technical",
                "bug",
                "error",
                "broken",
                "problem",
                "page not loading"
            ],
            answer:
                "Please try refreshing the page and signing in again. If the problem continues, create a support request and describe what happened, including any error message you saw."
        }

    ], []);


    // =====================================================
    // QUICK QUESTIONS
    // =====================================================

    const quickQuestions = [

        "How can I track my order?",

        "Can I cancel my order?",

        "What payment methods are accepted?",

        "Can I return an artwork?",

        "How do I change my password?"

    ];


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
    // NORMALIZE FAQ TEXT
    // =====================================================

    const normalizeText = (text) => {

        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    };


    // =====================================================
    // ASK AURELIAN ASSISTANT
    // =====================================================

    const askAssistant = async (question = assistantQuestion) => {

        const cleanQuestion =
            question.trim();

        if (!cleanQuestion) {

            toast.error(
                "Please enter a question."
            );

            return;

        }


        setAssistantQuestion(
            cleanQuestion
        );

        setAssistantLoading(true);

        setAssistantAnswer(null);

        setAssistantHelpful(null);


        try {

            const normalizedQuestion =
                normalizeText(cleanQuestion);


            const questionWords =
                normalizedQuestion
                    .split(" ")
                    .filter(word => word.length > 2);


            let bestFaq = null;

            let bestScore = 0;


            // =================================================
            // MATCH FAQ
            // =================================================

            faqs.forEach((faq) => {

                const normalizedFaqQuestion =
                    normalizeText(
                        faq.question
                    );


                let score = 0;


                // Exact question
                if (
                    normalizedQuestion ===
                    normalizedFaqQuestion
                ) {

                    score += 100;

                }


                // Question contains FAQ
                if (
                    normalizedQuestion.includes(
                        normalizedFaqQuestion
                    )
                ) {

                    score += 40;

                }


                // FAQ contains user's question
                if (
                    normalizedFaqQuestion.includes(
                        normalizedQuestion
                    )
                ) {

                    score += 35;

                }


                // Matching FAQ words
                questionWords.forEach(word => {

                    if (
                        normalizedFaqQuestion.includes(
                            word
                        )
                    ) {

                        score += 5;

                    }

                });


                // Matching keywords
                faq.keywords.forEach(keyword => {

                    const normalizedKeyword =
                        normalizeText(keyword);


                    if (
                        normalizedQuestion.includes(
                            normalizedKeyword
                        )
                    ) {

                        score += 15;

                    }

                });


                if (score > bestScore) {

                    bestScore = score;

                    bestFaq = faq;

                }

            });


            // =================================================
            // SMALL DELAY
            // Gives assistant a natural feel
            // =================================================

            await new Promise(
                resolve =>
                    setTimeout(resolve, 350)
            );


            if (
                bestFaq &&
                bestScore >= 15
            ) {

                setAssistantAnswer({

                    found: true,

                    question:
                        bestFaq.question,

                    answer:
                        bestFaq.answer,

                    category:
                        bestFaq.category

                });

            } else {

                setAssistantAnswer({

                    found: false,

                    question:
                        cleanQuestion,

                    answer:
                        "I'm sorry, I couldn't find a reliable answer to that question in our FAQ. You can create a support request below and our team will be happy to help."

                });

            }

        } catch (error) {

            console.error(
                "Assistant error:",
                error
            );

            setAssistantAnswer({

                found: false,

                question:
                    cleanQuestion,

                answer:
                    "I'm unable to find an answer right now. Please create a support request and our team will assist you."

            });

        } finally {

            setAssistantLoading(false);

        }

    };


    // =====================================================
    // QUICK QUESTION
    // =====================================================

    const askQuickQuestion = (question) => {

        setAssistantQuestion(
            question
        );

        askAssistant(question);

    };


    // =====================================================
    // USE CATEGORY
    // =====================================================

    const useTopic = (topic) => {

        const questions = {

            ORDER:
                "How can I track my order?",

            PAYMENT:
                "What payment methods are accepted?",

            ARTWORK:
                "Are the artworks original?",

            ACCOUNT:
                "How do I change my password?",

            TECHNICAL:
                "The website is not working properly."

        };


        const question =
            questions[topic];


        if (question) {

            askQuickQuestion(
                question
            );

        }

    };


    // =====================================================
    // CREATE SUPPORT FROM ASSISTANT
    // =====================================================

    const createSupportFromAssistant = () => {

        const question =
            assistantAnswer?.question ||
            assistantQuestion;


        setSubject(
            question
        );


        setMessage(
            assistantQuestion
                ? `I need help with: ${assistantQuestion}`
                : ""
        );


        if (
            assistantAnswer?.category
        ) {

            const validCategories = [
                "ORDER",
                "PAYMENT",
                "ARTWORK",
                "ACCOUNT",
                "TECHNICAL"
            ];


            if (
                validCategories.includes(
                    assistantAnswer.category
                )
            ) {

                setCategory(
                    assistantAnswer.category
                );

            }

        }


        setTimeout(() => {

            document
                .getElementById(
                    "support-desk"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        }, 100);

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


            // Reset form

            setSubject("");

            setCategory("ORDER");

            setOrderId("");

            setMessage("");


            // Refresh tickets

            await loadTickets();


            // Scroll

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
                return "contact-status-open";

            case "IN_PROGRESS":
                return "contact-status-progress";

            case "RESOLVED":
                return "contact-status-resolved";

            case "CLOSED":
                return "contact-status-closed";

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

        <div className="contact-page">

            <div className="contact-container">


                {/* =================================================
                    HERO
                ================================================= */}

                <section className="contact-hero">

                    <div className="contact-eyebrow">
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

                <section className="contact-topics">

                    <div
                        className="contact-topic"
                        onClick={() =>
                            useTopic("ORDER")
                        }
                    >
                        <div className="contact-topic-icon">
                            📦
                        </div>

                        <div className="contact-topic-title">
                            Orders
                        </div>

                        <div className="contact-topic-text">
                            Delivery & tracking
                        </div>
                    </div>


                    <div
                        className="contact-topic"
                        onClick={() =>
                            useTopic("PAYMENT")
                        }
                    >
                        <div className="contact-topic-icon">
                            💳
                        </div>

                        <div className="contact-topic-title">
                            Payments
                        </div>

                        <div className="contact-topic-text">
                            Payment assistance
                        </div>
                    </div>


                    <div
                        className="contact-topic"
                        onClick={() =>
                            useTopic("ARTWORK")
                        }
                    >
                        <div className="contact-topic-icon">
                            🎨
                        </div>

                        <div className="contact-topic-title">
                            Artwork
                        </div>

                        <div className="contact-topic-text">
                            Collection questions
                        </div>
                    </div>


                    <div
                        className="contact-topic"
                        onClick={() =>
                            useTopic("ACCOUNT")
                        }
                    >
                        <div className="contact-topic-icon">
                            👤
                        </div>

                        <div className="contact-topic-title">
                            Account
                        </div>

                        <div className="contact-topic-text">
                            Profile & security
                        </div>
                    </div>


                    <div
                        className="contact-topic"
                        onClick={() =>
                            useTopic("TECHNICAL")
                        }
                    >
                        <div className="contact-topic-icon">
                            ⚙
                        </div>

                        <div className="contact-topic-title">
                            Technical
                        </div>

                        <div className="contact-topic-text">
                            Website assistance
                        </div>
                    </div>

                </section>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <section className="contact-grid">


                    {/* =================================================
                        CONTACT FORM
                    ================================================= */}

                    <div
                        className="contact-card"
                        id="support-desk"
                    >

                        <div className="contact-card-header">

                            <div className="contact-card-eyebrow">
                                Support Desk
                            </div>

                            <h2>
                                How can we help?
                            </h2>

                            <p className="contact-card-subtitle">
                                Tell us what you need assistance
                                with and our team will get back
                                to you.
                            </p>

                        </div>


                        {token ? (

                            <form
                                className="contact-form"
                                onSubmit={submitTicket}
                            >

                                <div className="contact-field">

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


                                <div className="contact-field-row">

                                    <div className="contact-field">

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


                                    <div className="contact-field">

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


                                <div className="contact-field">

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


                                <button
                                    type="submit"
                                    className="contact-submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Sending..."
                                        : "Send Support Request"
                                    }

                                </button>

                            </form>

                        ) : (

                            <div className="contact-login-notice">

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
                        SIDE INFORMATION + ASSISTANT
                    ================================================= */}

                    <aside className="contact-side">


                        <div className="contact-info-card">

                            <div className="contact-info-icon">
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


                        <div className="contact-info-card">

                            <div className="contact-info-icon">
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


                        {/* =================================================
                            AURELIAN ASSISTANT
                        ================================================= */}

                        <div className="contact-info-card contact-ai-card">

                            <div className="contact-info-icon">
                                ✦
                            </div>

                            <div className="contact-ai-label">
                                Aurelian Concierge
                            </div>

                            <h3>
                                How may I assist you?
                            </h3>

                            <p className="contact-ai-intro">
                                Ask a question about orders,
                                payments, artworks, your account,
                                or website assistance.
                            </p>


                            {/* ASK FORM */}

                            <form
                                className="contact-ai-form"
                                onSubmit={(e) => {

                                    e.preventDefault();

                                    askAssistant();

                                }}
                            >

                                <input
                                    className="contact-ai-input"
                                    type="text"
                                    value={assistantQuestion}
                                    onChange={(e) =>
                                        setAssistantQuestion(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ask something..."
                                    maxLength={250}
                                />

                                <button
                                    type="submit"
                                    className="contact-ai-ask"
                                    disabled={
                                        assistantLoading
                                    }
                                >

                                    {assistantLoading
                                        ? "..."
                                        : "Ask"
                                    }

                                </button>

                            </form>


                            {/* QUICK QUESTIONS */}

                            <div className="contact-ai-suggestions">

                                {quickQuestions.map(
                                    (question) => (

                                        <button
                                            key={question}
                                            type="button"
                                            className="contact-ai-suggestion"
                                            onClick={() =>
                                                askQuickQuestion(
                                                    question
                                                )
                                            }
                                        >

                                            {question}

                                        </button>

                                    )
                                )}

                            </div>


                            {/* THINKING */}

                            {assistantLoading && (

                                <div className="contact-ai-thinking">

                                    Searching the Aurelian
                                    knowledge desk...

                                </div>

                            )}


                            {/* ANSWER */}

                            {!assistantLoading &&
                                assistantAnswer && (

                                    <div className="contact-ai-answer">

                                        <div className="contact-ai-answer-label">

                                            {assistantAnswer.found
                                                ? "Aurelian Answer"
                                                : "Aurelian Concierge"
                                            }

                                        </div>


                                        <div className="contact-ai-answer-question">

                                            {assistantAnswer.question}

                                        </div>


                                        <div className="contact-ai-answer-text">

                                            {assistantAnswer.answer}

                                        </div>


                                        {assistantAnswer.category && (

                                            <div className="contact-ai-category">

                                                {assistantAnswer.category}

                                            </div>

                                        )}


                                        {/* HELPFUL */}

                                        <div className="contact-ai-helpful">

                                            <span>
                                                Was this helpful?
                                            </span>

                                            <button
                                                type="button"
                                                className={
                                                    assistantHelpful === true
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() => {

                                                    setAssistantHelpful(
                                                        true
                                                    );

                                                    toast.success(
                                                        "Thank you for your feedback."
                                                    );

                                                }}
                                            >
                                                Yes
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    assistantHelpful === false
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() => {

                                                    setAssistantHelpful(
                                                        false
                                                    );

                                                }}
                                            >
                                                No
                                            </button>

                                        </div>


                                        {/* SUPPORT ESCALATION */}

                                        {!assistantAnswer.found && (

                                            <button
                                                type="button"
                                                className="contact-ai-support-button"
                                                onClick={
                                                    createSupportFromAssistant
                                                }
                                            >

                                                Create Support Request

                                            </button>

                                        )}

                                    </div>

                                )}

                        </div>

                    </aside>

                </section>


                {/* =================================================
                    MY SUPPORT REQUESTS
                ================================================= */}

                {token && (

                    <section
                        className="contact-tickets-section"
                        id="my-support-tickets"
                    >

                        <div className="contact-tickets-header">

                            <div className="contact-card-eyebrow">
                                Your Requests
                            </div>

                            <h2>
                                My Support Requests
                            </h2>

                        </div>


                        {ticketsLoading ? (

                            <div className="contact-loading">
                                Loading your support requests...
                            </div>

                        ) : tickets.length === 0 ? (

                            <div className="contact-empty">

                                <div className="contact-empty-mark">
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

                            <div className="contact-ticket-list">

                                {tickets.map(
                                    ticket => (

                                        <div
                                            key={ticket.id}
                                            className="contact-ticket"
                                            onClick={() =>
                                                openTicket(
                                                    ticket.id
                                                )
                                            }
                                        >

                                            <div className="contact-ticket-number">

                                                #
                                                {ticket.id}

                                            </div>


                                            <div>

                                                <div className="contact-ticket-subject">

                                                    {ticket.subject}

                                                </div>


                                                <div className="contact-ticket-meta">

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
                                                    `contact-ticket-status ${
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
