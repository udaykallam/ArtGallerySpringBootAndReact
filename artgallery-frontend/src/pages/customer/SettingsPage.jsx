import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function SettingsPage() {

    const navigate = useNavigate();

    const [orderNotifications, setOrderNotifications] =
        useState(true);

    const [emailNotifications, setEmailNotifications] =
        useState(true);

    const [promotionalEmails, setPromotionalEmails] =
        useState(false);

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
                                navigate("/change-password")
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
                                checked={orderNotifications}
                                onChange={(e) =>
                                    setOrderNotifications(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="settings-slider" />

                        </label>

                    </div>


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
                                checked={emailNotifications}
                                onChange={(e) =>
                                    setEmailNotifications(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="settings-slider" />

                        </label>

                    </div>


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
                                checked={promotionalEmails}
                                onChange={(e) =>
                                    setPromotionalEmails(
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
                                Manage your privacy preferences.
                            </p>

                        </div>

                    </div>


                    <div className="settings-item">

                        <div>

                            <h3>
                                Personal Information
                            </h3>

                            <p>
                                Manage your name, phone number and address from your profile.
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


                {/* BACK */}

                <div className="settings-footer">

                    <button
                        className="btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                </div>

            </div>

        </div>
    );
}

export default SettingsPage;