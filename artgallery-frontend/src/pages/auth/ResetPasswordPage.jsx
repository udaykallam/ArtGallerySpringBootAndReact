import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) navigate("/forgot-password");
    }, [email, navigate]);

    const getStrength = () => {
        let score = 0;
        if (newPassword.length >= 8) score++;
        if (/[A-Z]/.test(newPassword)) score++;
        if (/[a-z]/.test(newPassword)) score++;
        if (/\d/.test(newPassword)) score++;
        if (/[^A-Za-z0-9]/.test(newPassword)) score++;
        if (score <= 2) return { text: "Weak",   level: 1, segments: 1 };
        if (score <= 4) return { text: "Medium", level: 2, segments: 3 };
        return              { text: "Strong",  level: 3, segments: 5 };
    };

    const strength = getStrength();

    const passwordsMatch = confirmPassword && newPassword === confirmPassword;
    const passwordsMismatch = confirmPassword && newPassword !== confirmPassword;

    const resetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 8) { toast.error("Password must be at least 8 characters."); return; }
        if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return; }
        setLoading(true);
        try {
            await axiosClient.post("/auth/reset-password", { email, newPassword });
            toast.success("Password changed successfully.");
            setTimeout(() => navigate("/login"), 1200);
        } catch (error) {
            toast.error(error.response?.data || "Unable to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-eyebrow">Aurelian Gallery</div>
                <h2>New Password</h2>
                <p className="auth-tagline">Choose a secure password for your account</p>
                <div className="auth-divider" />

                <form onSubmit={resetPassword}>

                    {/* New password */}
                    <div className="field-wrap">
                        <label htmlFor="new-password">New Password</label>
                        <input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    {/* Strength meter */}
                    {newPassword && (
                        <div className="password-strength">
                            <div className="strength-bars">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className={`strength-bar${i <= strength.segments ? ` strength-bar--${strength.level}` : ""}`}
                                    />
                                ))}
                            </div>
                            <span className={`strength-label strength-label--${strength.level}`}>
                                {strength.text}
                            </span>
                        </div>
                    )}

                    {/* Confirm password */}
                    <div className="field-wrap">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className={passwordsMismatch ? "input-error" : passwordsMatch ? "input-success" : ""}
                            required
                        />
                        {passwordsMismatch && <div className="field-hint field-hint--error">Passwords do not match</div>}
                        {passwordsMatch    && <div className="field-hint field-hint--ok">Passwords match</div>}
                    </div>

                    {/* Show password toggle */}
                    <label className="upload-checkbox-label" style={{ marginBottom: "1.25rem" }}>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="upload-checkbox"
                        />
                        <span className="upload-checkbox-box" />
                        Show password
                    </label>

                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Reset Password"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default ResetPasswordPage;