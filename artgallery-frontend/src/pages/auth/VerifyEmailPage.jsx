import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

function VerifyEmailPage() {

    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState("verifying");

    const [message, setMessage] = useState("");


    useEffect(() => {

        const token = searchParams.get("token");

        if (!token) {

            setStatus("error");

            setMessage(
                "Invalid verification link."
            );

            return;
        }

        verifyEmail(token);

    }, [searchParams]);


    const verifyEmail = async (token) => {

        try {

            const response =
                await axiosClient.get(
                    "/auth/verify-email",
                    {
                        params: {
                            token
                        }
                    }
                );

            setStatus("success");

            setMessage(
                response.data ||
                "Email verified successfully."
            );

        } catch (error) {

            console.error(
                "Email verification error:",
                error
            );

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to verify your email.";

            setStatus("error");

            setMessage(errorMessage);

        }

    };


    // ==========================================
    // VERIFYING
    // ==========================================

    if (status === "verifying") {

        return (

            <div className="auth-page">

                <div className="auth-card">

                    <div className="auth-eyebrow">
                        Aurelian Gallery
                    </div>

                    <div className="verify-icon">
                        ✦
                    </div>

                    <h2>
                        Verifying Email
                    </h2>

                    <p className="auth-tagline">
                        Please wait while we verify
                        your email address.
                    </p>

                </div>

            </div>

        );
    }


    // ==========================================
    // SUCCESS
    // ==========================================

    if (status === "success") {

        return (

            <div className="auth-page">

                <div className="auth-card">

                    <div className="auth-eyebrow">
                        Aurelian Gallery
                    </div>

                    <div className="verify-icon verify-icon--success">
                        ✓
                    </div>

                    <h2>
                        Email Verified
                    </h2>

                    <p className="auth-tagline">
                        Your account has been
                        successfully verified.
                    </p>

                    <div className="auth-divider" />

                    <p className="verify-body">
                        Your Aurelian Gallery account
                        is now ready to use.
                    </p>

                    <Link
                        to="/login"
                        className="btn-primary"
                    >
                        Continue to Login
                    </Link>

                </div>

            </div>

        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-eyebrow">
                    Aurelian Gallery
                </div>

                <div className="verify-icon verify-icon--error">
                    !
                </div>

                <h2>
                    Verification Failed
                </h2>

                <p className="auth-tagline">
                    We couldn't verify your email.
                </p>

                <div className="auth-divider" />

                <p className="verify-body">
                    {message}
                </p>

                <Link
                    to="/login"
                    className="btn-primary"
                >
                    Go to Login
                </Link>

            </div>

        </div>

    );
}

export default VerifyEmailPage;