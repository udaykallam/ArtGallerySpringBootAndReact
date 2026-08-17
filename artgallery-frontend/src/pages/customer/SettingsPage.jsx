import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
    getSettings,
    updateNotificationSettings
} from "../../services/settingsService";

function SettingsPage() {

    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        orderNotifications: true,
        emailNotifications: true,
        promotionalEmails: false
    });

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);


    useEffect(() => {

        loadSettings();

    }, []);


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


                    <div className="settings-item">

                        <div>

                            <h3>
                                Deactivate Account
                            </h3>

                            <p>
                                Temporarily disable your account.
                            </p>

                        </div>

                        <button
                            className="settings-danger-btn"
                            onClick={() =>
                                toast.info(
                                    "Account deactivation will be available soon."
                                )
                            }
                        >
                            Deactivate
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

        </div>
    );
}

export default SettingsPage;