import { useState } from "react";
import { Link } from "react-router-dom";
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

    const [error, setError] =
        useState("");

    const googleLogin = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const register = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await axiosClient.post(
                "/auth/register",
                formData
            );

            /*
             * Registration was successful.
             *
             * The backend has created the account
             * and sent the verification email.
             */

            setRegistered(true);

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

        } finally {

            setLoading(false);

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

                    <div
                        style={{
                            fontSize: "52px",
                            marginBottom: "15px"
                        }}
                    >
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

                    <p
                        style={{
                            lineHeight: "1.7",
                            color: "#aaa",
                            marginBottom: "25px"
                        }}
                    >
                        Please check your inbox and
                        click the verification link to
                        activate your Aurelian Gallery
                        account.
                    </p>

                    <p
                        style={{
                            fontSize: "14px",
                            color: "#777",
                            marginBottom: "25px"
                        }}
                    >
                        The verification link is valid
                        for 24 hours.
                    </p>

                    <Link
                        to="/login"
                        className="btn-primary"
                        style={{
                            display: "block",
                            textAlign: "center",
                            textDecoration: "none"
                        }}
                    >
                        Go to Login
                    </Link>

                    <p
                        className="auth-footer-link"
                        style={{
                            marginTop: "20px"
                        }}
                    >
                        Didn't receive the email?
                    </p>

                    <p
                        style={{
                            fontSize: "13px",
                            color: "#777"
                        }}
                    >
                        Check your spam or junk folder.
                    </p>

                </div>

            </div>
        );
    }


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


                {/* ERROR */}

                {error && (

                    <div
                        style={{
                            padding: "12px 15px",
                            marginBottom: "20px",
                            borderRadius: "6px",
                            background: "rgba(180, 60, 60, 0.12)",
                            border: "1px solid rgba(180, 60, 60, 0.3)",
                            color: "#d98c8c",
                            fontSize: "14px"
                        }}
                    >
                        {error}
                    </div>

                )}


                <form onSubmit={register}>

                    {/* NAME */}

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


                    {/* EMAIL */}

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


                    {/* PHONE */}

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


                    {/* PASSWORD */}

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


                    {/* REGISTER */}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>


                    {/* DIVIDER */}

                    <div className="auth-divider-row">

                        <span className="auth-divider-line" />

                        <span className="auth-or-text">
                            or
                        </span>

                        <span className="auth-divider-line" />

                    </div>


                    {/* GOOGLE */}

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