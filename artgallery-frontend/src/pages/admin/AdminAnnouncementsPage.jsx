import { useEffect, useState } from "react";
import {
    getAnnouncements,
    sendAnnouncement
} from "../../services/announcementService";

function AdminAnnouncementsPage() {

    const [announcements, setAnnouncements] =
        useState([]);

    const [formData, setFormData] =
        useState({
            title: "",
            message: "",
            type: "GENERAL",
            recipientType: "ALL",
            createWebNotification: true
        });

    const [loading, setLoading] =
        useState(true);

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // LOAD ANNOUNCEMENT HISTORY
    // ==========================================

    useEffect(() => {

        loadAnnouncements();

    }, []);


    const loadAnnouncements = async () => {

        try {

            const data =
                await getAnnouncements();

            setAnnouncements(data);

        } catch (error) {

            console.error(
                "Failed to load announcements:",
                error
            );

            setError(
                "Failed to load announcement history."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // HANDLE FORM CHANGE
    // ==========================================

    const handleChange = (e) => {

        const { name, value, type, checked } =
            e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });

        setError("");
        setSuccess("");

    };


    // ==========================================
    // SEND ANNOUNCEMENT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Basic validation

        if (!formData.title.trim()) {

            setError(
                "Please enter an announcement title."
            );

            return;
        }


        if (!formData.message.trim()) {

            setError(
                "Please enter a message."
            );

            return;
        }


        setSending(true);


        try {

            await sendAnnouncement({
                ...formData,
                title: formData.title.trim(),
                message: formData.message.trim()
            });


            setSuccess(
                "Announcement sent successfully."
            );


            // Reset form

            setFormData({
                title: "",
                message: "",
                type: "GENERAL",
                recipientType: "ALL",
                createWebNotification: true
            });


            // Refresh history

            await loadAnnouncements();

        } catch (error) {

            console.error(
                "Failed to send announcement:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to send announcement."
            );

        } finally {

            setSending(false);

        }
    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="loading-screen">

                <div className="load-mark">
                    ✦
                </div>

                <div className="load-text">
                    Loading announcements...
                </div>

            </div>

        );

    }


    return (

        <div className="container">

            <div className="admin-page">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="list-header">

                    <div className="list-eyebrow">
                        Administration
                    </div>

                    <h1 className="list-title">
                        Announcements
                    </h1>

                    <p className="list-count">
                        {announcements.length}{" "}
                        {announcements.length === 1
                            ? "announcement"
                            : "announcements"
                        }
                    </p>

                </div>


                {/* =====================================
                    SEND ANNOUNCEMENT
                ===================================== */}

                <div className="admin-form-card">

                    <div className="form-section-header">

                        <div>

                            <div className="list-eyebrow">
                                Communication
                            </div>

                            <h2>
                                Send Announcement
                            </h2>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="admin-form"
                    >


                        {/* ================================
                            TITLE
                        ================================= */}

                        <div className="field-wrap">

                            <label htmlFor="title">
                                Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                name="title"
                                placeholder="Scheduled Maintenance"
                                value={formData.title}
                                onChange={handleChange}
                                maxLength={150}
                                required
                            />

                        </div>


                        {/* ================================
                            MESSAGE
                        ================================= */}

                        <div className="field-wrap">

                            <label htmlFor="message">
                                Message
                            </label>

                            <textarea
                                id="message"
                                name="message"
                                placeholder="Write your announcement here..."
                                value={formData.message}
                                onChange={handleChange}
                                rows="7"
                                maxLength={5000}
                                required
                            />

                        </div>


                        {/* ================================
                            TYPE + RECIPIENT
                        ================================= */}

                        <div className="admin-form-row">


                            {/* TYPE */}

                            <div className="field-wrap">

                                <label htmlFor="type">
                                    Announcement Type
                                </label>

                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="upload-select"
                                >

                                    <option value="MAINTENANCE">
                                        Maintenance
                                    </option>

                                    <option value="IMPORTANT">
                                        Important Notice
                                    </option>

                                    <option value="GENERAL">
                                        General Announcement
                                    </option>

                                    <option value="PROMOTIONAL">
                                        Promotional
                                    </option>

                                </select>

                            </div>


                            {/* RECIPIENT */}

                            <div className="field-wrap">

                                <label htmlFor="recipientType">
                                    Send To
                                </label>

                                <select
                                    id="recipientType"
                                    name="recipientType"
                                    value={formData.recipientType}
                                    onChange={handleChange}
                                    className="upload-select"
                                >

                                    <option value="ALL">
                                        All Users
                                    </option>

                                    <option value="CUSTOMERS">
                                        Customers
                                    </option>

                                    <option value="ARTISTS">
                                        Artists
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* ================================
                            WEB NOTIFICATION
                        ================================= */}

                        <div className="announcement-option">

                            <label>

                                <input
                                    type="checkbox"
                                    name="createWebNotification"
                                    checked={
                                        formData.createWebNotification
                                    }
                                    onChange={handleChange}
                                />

                                <span>
                                    Also create a web notification
                                </span>

                            </label>

                        </div>


                        {/* ================================
                            ERROR
                        ================================= */}

                        {error && (

                            <div className="auth-error">
                                {error}
                            </div>

                        )}


                        {/* ================================
                            SUCCESS
                        ================================= */}

                        {success && (

                            <div className="form-success">
                                {success}
                            </div>

                        )}


                        {/* ================================
                            SUBMIT
                        ================================= */}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={sending}
                        >

                            {sending
                                ? "Sending Announcement..."
                                : "Send Announcement"
                            }

                        </button>

                    </form>

                </div>


                {/* =====================================
                    ANNOUNCEMENT HISTORY
                ===================================== */}

                <div className="admin-table-card">

                    <div className="announcement-history-header">

                        <div>

                            <div className="list-eyebrow">
                                History
                            </div>

                            <h2>
                                Previous Announcements
                            </h2>

                        </div>

                    </div>


                    {announcements.length === 0 ? (

                        <div className="admin-table-empty">

                            <div className="empty-mark">
                                ◻
                            </div>

                            <p
                                className="empty-heading"
                                style={{
                                    fontSize: "18px"
                                }}
                            >
                                No announcements yet
                            </p>

                            <p
                                className="empty-sub"
                                style={{
                                    marginBottom: 0
                                }}
                            >
                                Your sent announcements
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="announcement-list">

                            {announcements.map(
                                (announcement) => (

                                    <div
                                        key={announcement.id}
                                        className="announcement-row"
                                    >


                                        {/* ==================
                                            MAIN CONTENT
                                        ================== */}

                                        <div className="announcement-info">

                                            <div className="announcement-title-row">

                                                <h3>
                                                    {announcement.title}
                                                </h3>

                                                <span
                                                    className={`announcement-type announcement-type--${announcement.type.toLowerCase()}`}
                                                >
                                                    {
                                                        announcement.type
                                                    }
                                                </span>

                                            </div>


                                            <p className="announcement-message">
                                                {
                                                    announcement.message
                                                }
                                            </p>


                                            <div className="announcement-meta">

                                                <span>
                                                    To:{" "}
                                                    {
                                                        announcement.recipientType
                                                    }
                                                </span>

                                                <span>
                                                    •
                                                </span>

                                                <span>
                                                    {
                                                        formatDate(
                                                            announcement.createdAt
                                                        )
                                                    }
                                                </span>

                                                {announcement.createdBy && (

                                                    <>
                                                        <span>
                                                            •
                                                        </span>

                                                        <span>
                                                            By{" "}
                                                            {
                                                                announcement.createdBy
                                                            }
                                                        </span>
                                                    </>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}

export default AdminAnnouncementsPage;