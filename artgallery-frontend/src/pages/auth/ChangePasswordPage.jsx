import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { changePassword } from "../../services/authService";

function ChangePasswordPage() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (newPassword.length < 8) {

            toast.error(
                "New password must contain at least 8 characters."
            );

            return;
        }

        if (newPassword !== confirmPassword) {

            toast.error(
                "New passwords do not match."
            );

            return;
        }

        setLoading(true);

        try {

            await changePassword({
                currentPassword,
                newPassword,
                confirmPassword
            });

            toast.success(
                "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/settings");
            }, 800);

        } catch (error) {

            const data = error?.response?.data;

            let message = "Unable to change password.";

            if (typeof data === "string") {

                message = data;

            } else if (
                data &&
                typeof data.message === "string"
            ) {

                message = data.message;
            }

            toast.error(message);

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-eyebrow">
                    Aurelian Gallery
                </div>

                <h2>
                    Change Password
                </h2>

                <p className="auth-tagline">
                    Keep your account secure
                </p>

                <div className="auth-divider" />

                <form onSubmit={handleSubmit}>

                    <div className="field-wrap">

                        <label htmlFor="currentPassword">
                            Current Password
                        </label>

                        <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter current password"
                            required
                        />

                    </div>

                    <div className="field-wrap">

                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter new password"
                            minLength={4}
                            required
                        />

                        <small>
                            Password must contain at least 8 characters.
                        </small>

                    </div>

                    <div className="field-wrap">

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Confirm new password"
                            minLength={4}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading
                            ? "Changing Password..."
                            : "Change Password"}
                    </button>

                </form>

                <button
                    type="button"
                    className="btn-secondary"
                    style={{ marginTop: "12px" }}
                    onClick={() => navigate("/settings")}
                >
                    Cancel
                </button>

            </div>

        </div>
    );
}

export default ChangePasswordPage;