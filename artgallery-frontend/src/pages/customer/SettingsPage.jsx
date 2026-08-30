import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
    getSettings,
    updateNotificationSettings
} from "../../services/settingsService";

import {
    deactivateAccount,
    deleteAccount
} from "../../services/accountService";

function SettingsPage() {

    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        orderNotifications: true,
        emailNotifications: true,
        promotionalEmails: false
    });

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [confirmAction, setConfirmAction] = useState(null);

    const [accountActionLoading, setAccountActionLoading] =
        useState(false);


    useEffect(() => {

        loadSettings();

    }, []);

    const handleDeactivateAccount = async () => {

        setAccountActionLoading(true);

        try {
            await deactivateAccount();
            toast.success("Your account has been deactivated.");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            console.error("Failed to deactivate account:", error);
            const responseData = error?.response?.data;
            const message = typeof responseData === "string" ? responseData : responseData?.message || "Unable to deactivate your account.";
            toast.error(message);
        } finally {
            setAccountActionLoading(false);
            setConfirmAction(null);
        }
    };

    const handleDeleteAccount = async () => {

        setAccountActionLoading(true);

        try {
            await deleteAccount();
            toast.success("Your account has been permanently deleted.");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            console.error("Failed to delete account:", error);
            const responseData = error?.response?.data;
            const message = typeof responseData === "string" ? responseData : responseData?.message || "Unable to delete your account.";
            toast.error(message);
        } finally {
            setAccountActionLoading(false);
            setConfirmAction(null);
        }
    };


    const loadSettings = async () => {

        try {

            const data = await getSettings();

            setSettings(data);

        } catch (error) {

            console.error(
                "Failed to load settings:",
                error
            );

            toast.error(
                "Unable to load your settings."
            );

        } finally {

            setLoading(false);

        }
    };


    const handleToggle = async (
        setting,
        value
    ) => {

        const previousSettings = {
            ...settings
        };

        const updatedSettings = {
            ...settings,
            [setting]: value
        };

        setSettings(updatedSettings);

        setSaving(true);

        try {

            const data =
                await updateNotificationSettings(
                    updatedSettings
                );

            setSettings(data);

            toast.success(
                "Notification preference updated."
            );

        } catch (error) {

            console.error(
                "Failed to update settings:",
                error
            );

            setSettings(
                previousSettings
            );

            const responseData =
                error?.response?.data;

            const message =
                typeof responseData === "string"
                    ? responseData
                    : responseData?.message ||
                    "Unable to update settings.";

            toast.error(message);

        } finally {

            setSaving(false);

        }
    };


    if (loading) {

        return (

            <div className="loading-screen">

                <div className="load-mark">
                    ✦
                </div>

                <div className="load-text">
                    Loading your settings...
                </div>

            </div>

        );

    }


    return (

        <div className="container">

            <div className="settings-page">

                {/* HEADER */}

                <div className="settings-header">

                    <div>

                        <div className="list-eyebrow">
                            Account
                        </div>

                        <h1 className="list-title">
                            Settings
                        </h1>

                        <p className="settings-subtitle">
                            Manage your account preferences and security.
                        </p>

                    </div>

                </div>


                {/* SECURITY */}

                <section className="settings-section">

                    <div className="settings-section-header">

                        <div className="settings-section-icon">
                            🔐
                        </div>

                        <div>

                            <h2>
                                Account Security
                            </h2>

                            <p>
                                Manage your password and account security.
                            </p>

                        </div>

                    </div>


                    <div className="settings-item">

                        <div>

                            <h3>
                                Password
                            </h3>

                            <p>
                                Change your password to keep your account secure.
                            </p>

                        </div>

                        <button
                            className="btn-view settings-action"
                            onClick={() =>
                                navigate(
                                    "/change-password"
                                )
                            }
                        >
                            Change Password
                        </button>

                    </div>

                </section>


                {/* NOTIFICATIONS */}

                <section className="settings-section">

                    <div className="settings-section-header">

                        <div className="settings-section-icon">
                            🔔
                        </div>

                        <div>

                            <h2>
                                Notifications
                            </h2>

                            <p>
                                Choose which notifications you would like to receive.
                            </p>

                        </div>

                    </div>


                    {/* ORDER NOTIFICATIONS */}

                    <div className="settings-item">

                        <div>

                            <h3>
                                Order Updates
                            </h3>

                            <p>
                                Receive updates about your orders.
                            </p>

                        </div>

                        <label className="settings-switch">

                            <input
                                type="checkbox"
                                checked={
                                    settings.orderNotifications
                                }
                                disabled={saving}
                                onChange={(e) =>
                                    handleToggle(
                                        "orderNotifications",
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="settings-slider" />

                        </label>

                    </div>


                    {/* EMAIL NOTIFICATIONS */}

                    <div className="settings-item">

                        <div>

                            <h3>
                                Email Notifications
                            </h3>

                            <p>
                                Receive important account notifications by email.
                            </p>

                        </div>

                        <label className="settings-switch">

                            <input
                                type="checkbox"
                                checked={
                                    settings.emailNotifications
                                }
                                disabled={saving}
                                onChange={(e) =>
                                    handleToggle(
                                        "emailNotifications",
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="settings-slider" />

                        </label>

                    </div>


                    {/* PROMOTIONAL EMAILS */}

                    <div className="settings-item">

                        <div>

                            <h3>
                                Promotional Emails
                            </h3>

                            <p>
                                Receive information about new artworks and special offers.
                            </p>

                        </div>

                        <label className="settings-switch">

                            <input
                                type="checkbox"
                                checked={
                                    settings.promotionalEmails
                                }
                                disabled={saving}
                                onChange={(e) =>
                                    handleToggle(
                                        "promotionalEmails",
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="settings-slider" />

                        </label>

                    </div>

                </section>


                {/* PRIVACY */}

                <section className="settings-section">

                    <div className="settings-section-header">

                        <div className="settings-section-icon">
                            🔒
                        </div>

                        <div>

                            <h2>
                                Privacy
                            </h2>

                            <p>
                                Manage your personal information.
                            </p>

                        </div>

                    </div>


                    <div className="settings-item">

                        <div>

                            <h3>
                                Personal Information
                            </h3>

                            <p>
                                Manage your name, phone number and address.
                            </p>

                        </div>

                        <button
                            className="btn-view settings-action"
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            View Profile
                        </button>

                    </div>

                </section>


                {/* ACCOUNT */}

                <section className="settings-section settings-danger-section">

                    <div className="settings-section-header">

                        <div className="settings-section-icon">
                            ⚠️
                        </div>

                        <div>

                            <h2>
                                Account
                            </h2>

                            <p>
                                Manage your Aurelian Gallery account.
                            </p>

                        </div>

                    </div>


                    {/* =========================================
        DEACTIVATE ACCOUNT
       ========================================= */}

                    <div className="settings-item">

                        <div>

                            <h3>
                                Deactivate Account
                            </h3>

                            <p>
                                Temporarily disable your account
                                and log out.
                            </p>

                        </div>

                        <button
                            className="settings-danger-btn"
                            onClick={() => setConfirmAction("deactivate")}
                            disabled={accountActionLoading}
                        >

                            {accountActionLoading
                                ? "Processing..."
                                : "Deactivate"
                            }

                        </button>

                    </div>


                    {/* =========================================
        DELETE ACCOUNT
       ========================================= */}

                    <div className="settings-item">

                        <div>

                            <h3>
                                Delete Account
                            </h3>

                            <p>
                                Permanently delete your Aurelian
                                Gallery account. This action cannot
                                be undone.
                            </p>

                        </div>

                        <button
                            className="settings-danger-btn"
                            onClick={() => setConfirmAction("delete")}
                            disabled={accountActionLoading}
                        >

                            {accountActionLoading
                                ? "Processing..."
                                : "Delete Account"
                            }

                        </button>

                    </div>

                </section>

                <div className="settings-footer">

                    <button
                        className="btn-secondary"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Back
                    </button>

                </div>

            </div>
            {confirmAction && (

    <div className="confirm-overlay">

        <div className="confirm-modal">

            <div className={`confirm-icon confirm-icon--${confirmAction === "delete" ? "danger" : "warning"}`}>
                {confirmAction === "delete" ? "🗑" : "⏸"}
            </div>

            <h2 className="confirm-title">
                {confirmAction === "delete" ? "Delete Account" : "Deactivate Account"}
            </h2>

            {confirmAction === "delete" ? (
                <>
                    <p className="confirm-message confirm-message--strong">
                        This action is permanent.
                    </p>
                    <p className="confirm-message">
                        Your Aurelian Gallery account will be permanently deleted. This cannot be undone.
                    </p>
                </>
            ) : (
                <p className="confirm-message">
                    Your account will be disabled and you'll be logged out. You can contact the gallery administrator to reactivate it.
                </p>
            )}

            <div className="confirm-divider" />

            <div className="confirm-actions">

                <button
                    className={confirmAction === "delete" ? "confirm-btn-danger" : "confirm-btn-warning"}
                    onClick={confirmAction === "delete" ? handleDeleteAccount : handleDeactivateAccount}
                    disabled={accountActionLoading}
                >
                    {accountActionLoading ? (
                        <span className="btn-spinner-wrap">
                            <span className="btn-spinner" /> Processing...
                        </span>
                    ) : (
                        confirmAction === "delete" ? "Yes, Delete Permanently" : "Yes, Deactivate"
                    )}
                </button>

                <button
                    className="confirm-btn-cancel"
                    onClick={() => setConfirmAction(null)}
                    disabled={accountActionLoading}
                >
                    Cancel
                </button>

            </div>

        </div>

    </div>
)}

        </div>
    );
}

export default SettingsPage;