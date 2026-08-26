import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";

function RegisterPage() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const [registered, setRegistered] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [resending, setResending] =
        useState(false);

    const [error, setError] =
        useState("");

    const [resendMessage, setResendMessage] =
        useState("");

    const [resendError, setResendError] =
        useState("");


    // ==========================================
    // GOOGLE LOGIN
    // ==========================================

    const googleLogin = () => {

        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";

    };


    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");

    };


    // ==========================================
    // REGISTER
    // ==========================================

    const register = async (e) => {

        e.preventDefault();

        setError("");
        setResendMessage("");
        setResendError("");
        setLoading(true);

        try {

            await axiosClient.post(
                "/auth/register",
                formData
            );

            /*
             * Registration successful.
             *
             * The backend creates the account,
             * creates the verification token,
             * and sends the verification email.
             */

            setRegistered(true);
            toast.success("Registration successful. Check your email to verify your account.");

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Registration failed.";

            setError(message);
            toast.error(message);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // RESEND VERIFICATION EMAIL
    // ==========================================

    const resendVerification = async () => {

        setResending(true);

        setResendMessage("");
        setResendError("");

        try {

            const response =
                await axiosClient.post(
                    "/auth/resend-verification",
                    null,
                    {
                        params: {
                            email: formData.email
                        }
                    }
                );

            setResendMessage(
                response.data ||
                "Verification email sent successfully."
            );
            toast.success(
                response.data ||
                "Verification email sent successfully."
            );

        } catch (error) {

            console.error(
                "Resend verification error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to resend verification email.";

            setResendError(message);
            toast.error(message);

        } finally {

            setResending(false);

        }

    };


    // ==========================================
    // EMAIL VERIFICATION MESSAGE
    // ==========================================

    if (registered) {

        return (

            <div className="auth-page">

                <div className="auth-card">

                    <div className="auth-eyebrow">
                        Aurelian Gallery
                    </div>


                    <div className="verify-icon">
                        ✉
                    </div>


                    <h2>
                        Check Your Email
                    </h2>


                    <p className="auth-tagline">
                        We've sent a verification link
                        to your email address.
                    </p>


                    <div className="auth-divider" />


                    <p className="verify-body">
                        Please check your inbox and
                        click the verification link to
                        activate your Aurelian Gallery
                        account.
                    </p>


                    <p className="verify-note">
                        The verification link is valid
                        for 24 hours.
                    </p>


                    <Link
                        to="/login"
                        className="btn-primary"
                    >
                        Go to Login
                    </Link>


                    {/* =========================
                        RESEND VERIFICATION
                    ========================= */}

                    <p className="auth-footer-link">
                        Didn't receive the email?
                    </p>


                    <button
                        type="button"
                        className="btn-view"
                        onClick={resendVerification}
                        disabled={resending}
                    >

                        {resending
                            ? "Sending..."
                            : "Resend Verification Email"
                        }

                    </button>


                    {/* =========================
                        RESEND SUCCESS
                    ========================= */}

                    {resendMessage && (

                        <p className="verify-success">
                            {resendMessage}
                        </p>

                    )}


                    {/* =========================
                        RESEND ERROR
                    ========================= */}

                    {resendError && (

                        <p className="auth-error">
                            {resendError}
                        </p>

                    )}


                    <p className="verify-note">
                        Check your spam or junk folder
                        if you still don't see the email.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // REGISTRATION FORM
    // ==========================================

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-eyebrow">
                    Aurelian Gallery
                </div>


                <h2>
                    Join the Collection
                </h2>


                <p className="auth-tagline">
                    Create your private account
                </p>


                <div className="auth-divider" />


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                <form onSubmit={register}>


                    {/* =========================
                        NAME
                    ========================= */}

                    <div className="field-wrap">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* =========================
                        EMAIL
                    ========================= */}

                    <div className="field-wrap">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* =========================
                        PHONE
                    ========================= */}

                    <div className="field-wrap">

                        <label htmlFor="phone">
                            Phone
                        </label>

                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            placeholder="+91 00000 00000"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* =========================
                        PASSWORD
                    ========================= */}

                    <div className="field-wrap">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* =========================
                        REGISTER BUTTON
                    ========================= */}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>


                    {/* =========================
                        DIVIDER
                    ========================= */}

                    <div className="auth-divider-row">

                        <span className="auth-divider-line" />

                        <span className="auth-or-text">
                            or
                        </span>

                        <span className="auth-divider-line" />

                    </div>


                    {/* =========================
                        GOOGLE
                    ========================= */}

                    <button
                        type="button"
                        className="google-btn"
                        onClick={googleLogin}
                    >

                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                        />

                        Continue with Google

                    </button>

                </form>


                {/* =========================
                    LOGIN LINK
                ========================= */}

                <p className="auth-footer-link">

                    Already a member?{" "}

                    <Link to="/login">
                        Sign in
                    </Link>

                </p>

            </div>

        </div>

    );
}

export default RegisterPage;