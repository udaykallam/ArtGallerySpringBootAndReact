import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";

function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loginLoading, setLoginLoading] =
        useState(false);

    const [showReactivation, setShowReactivation] =
        useState(false);

    const [showOtp, setShowOtp] =
        useState(false);

    const [reactivationOtp, setReactivationOtp] =
        useState("");

    const [reactivating, setReactivating] =
        useState(false);

    // Add near the other state
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        const digit = value.replace(/\D/g, "").slice(-1);

        const next = [...otpDigits];
        next[index] = digit;
        setOtpDigits(next);
        setReactivationOtp(next.join(""));

        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;

        const next = ["", "", "", "", "", ""];
        pasted.split("").forEach((char, i) => { next[i] = char; });
        setOtpDigits(next);
        setReactivationOtp(pasted.padEnd(6, "").slice(0, 6));
        otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    };


    // =====================================================
    // CHECK EXISTING LOGIN
    // =====================================================

    useEffect(() => {

        if (localStorage.getItem("token")) {

            navigate("/");

        }

    }, [navigate]);


    // =====================================================
    // GOOGLE LOGIN
    // =====================================================

    const googleLogin = () => {

        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";

    };


    // =====================================================
    // SAVE LOGIN DATA
    // =====================================================

    const saveLoginData = (data) => {

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        localStorage.setItem(
            "userId",
            data.userId
        );

        localStorage.setItem(
            "userName",
            data.name
        );


        const role =
            data.role;


        if (role === "ROLE_ADMIN") {

            navigate(
                "/admin/dashboard"
            );

        } else if (role === "ROLE_ARTIST") {

            navigate(
                "/artist/dashboard"
            );

        } else {

            navigate("/");
        }
    };


    // =====================================================
    // NORMAL LOGIN
    // =====================================================

    const login = async (e) => {

        e.preventDefault();

        setLoginLoading(true);

        try {

            const response =
                await axiosClient.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );


            // =================================================
            // NORMAL LOGIN SUCCESS
            // =================================================

            saveLoginData(
                response.data
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            // =================================================
            // ACCOUNT DEACTIVATED
            // =================================================

            if (
                error.response?.status === 403 &&
                error.response?.data?.status ===
                "REACTIVATION_REQUIRED"
            ) {

                /*
                 * IMPORTANT:
                 *
                 * The backend has already:
                 *
                 * 1. Generated the OTP
                 * 2. Saved the OTP
                 * 3. Sent the OTP to the user's email
                 *
                 * Therefore we DO NOT call /auth/login again.
                 */

                setShowReactivation(true);

                setShowOtp(false);

                setReactivationOtp("");

                return;
            }


            // =================================================
            // NORMAL ERROR
            // =================================================

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Login failed."
            );

        } finally {

            setLoginLoading(false);

        }
    };


    // =====================================================
    // YES — REACTIVATE ACCOUNT
    // =====================================================

    const handleReactivate = async () => {

        setReactivating(true);

        try {

            await axiosClient.post(
                "/auth/send-reactivation-otp",
                {
                    email,
                    password
                }
            );

            setShowOtp(true);

            toast.success(
                "A verification code has been sent to your email."
            );

        } catch (error) {

            console.error(
                "Send reactivation OTP error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to send reactivation OTP."
            );

        } finally {

            setReactivating(false);
        }
    };


    // =====================================================
    // VERIFY REACTIVATION OTP
    // =====================================================

    const verifyReactivation = async () => {

        if (
            !/^\d{6}$/.test(
                reactivationOtp
            )
        ) {

            toast.error(
                "Please enter the 6-digit OTP."
            );

            return;
        }


        setReactivating(true);


        try {

            // =================================================
            // REACTIVATE ACCOUNT
            // =================================================

            await axiosClient.post(
                "/auth/reactivate-account",
                {
                    email,
                    otp: reactivationOtp
                }
            );


            toast.success(
                "Your account has been reactivated."
            );


            // =================================================
            // CLOSE POPUP
            // =================================================

            setShowReactivation(false);

            setShowOtp(false);

            setReactivationOtp("");


            // =================================================
            // LOGIN AGAIN
            // =================================================

            /*
             * The account is now enabled.
             *
             * Therefore this login request will NOT
             * generate another reactivation OTP.
             */

            const response =
                await axiosClient.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );


            saveLoginData(
                response.data
            );


        } catch (error) {

            console.error(
                "Reactivation error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to reactivate your account."
            );

        } finally {

            setReactivating(false);

        }
    };


    // =====================================================
    // CANCEL REACTIVATION
    // =====================================================

    const cancelReactivation = () => {

        setShowReactivation(false);

        setShowOtp(false);

        setReactivationOtp("");

    };


    return (

        <>

            {/* =================================================
                INTERNAL CSS
            ================================================= */}

            {/* <style>
                {`

                    .reactivation-overlay {
                        position: fixed;
                        inset: 0;
                        z-index: 9999;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        padding: 20px;

                        background: rgba(0, 0, 0, 0.72);

                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                    }


                    .reactivation-modal {
                        width: 100%;
                        max-width: 440px;

                        padding: 42px 38px;

                        background: #111;

                        border: 1px solid rgba(255, 255, 255, 0.12);

                        border-radius: 14px;

                        text-align: center;

                        box-shadow:
                            0 25px 70px rgba(0, 0, 0, 0.55);

                        animation:
                            reactivationAppear 0.25s ease-out;
                    }


                    @keyframes reactivationAppear {

                        from {
                            opacity: 0;
                            transform: translateY(12px) scale(0.98);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }

                    }


                    .reactivation-modal .auth-eyebrow {
                        margin-bottom: 22px;
                    }


                    .reactivation-modal h2 {
                        margin-bottom: 10px;
                    }


                    .reactivation-modal .verify-body {
                        margin: 20px 0 28px;

                        line-height: 1.7;

                        color: #aaa;
                    }


                    .reactivation-modal .field-wrap {
                        text-align: left;

                        margin-top: 24px;
                        margin-bottom: 22px;
                    }


                    .reactivation-modal .field-wrap input {
                        text-align: center;

                        letter-spacing: 7px;

                        font-size: 22px;

                        font-weight: 500;

                        padding: 15px;
                    }


                    .reactivation-modal .btn-primary {
                        width: 100%;

                        margin-top: 5px;
                    }


                    .reactivation-modal .btn-secondary {
                        width: 100%;

                        margin-top: 12px;

                        padding: 13px 18px;

                        border: 1px solid rgba(255, 255, 255, 0.14);

                        border-radius: 6px;

                        background: transparent;

                        color: #aaa;

                        font-family: inherit;

                        font-size: 14px;

                        cursor: pointer;

                        transition:
                            background 0.2s ease,
                            color 0.2s ease,
                            border-color 0.2s ease;
                    }


                    .reactivation-modal .btn-secondary:hover {
                        background: rgba(255, 255, 255, 0.06);

                        color: #fff;

                        border-color:
                            rgba(255, 255, 255, 0.25);
                    }


                    .reactivation-modal .verify-icon {
                        width: 62px;
                        height: 62px;

                        margin: 0 auto 20px;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        border-radius: 50%;

                        background:
                            rgba(255, 255, 255, 0.06);

                        border:
                            1px solid rgba(255, 255, 255, 0.12);

                        font-size: 27px;
                    }


                    .reactivation-modal .otp-hint {
                        margin-top: 12px;

                        font-size: 13px;

                        color: #666;

                        line-height: 1.5;
                    }


                    @media (max-width: 520px) {

                        .reactivation-overlay {
                            padding: 15px;
                        }


                        .reactivation-modal {
                            padding: 34px 24px;
                        }


                        .reactivation-modal h2 {
                            font-size: 25px;
                        }

                    }

                `}
            </style> */}


            {/* =================================================
                LOGIN PAGE
            ================================================= */}

            <div className="auth-page">

                <div className="auth-card">

                    <div className="auth-eyebrow">
                        Aurelian Gallery
                    </div>


                    <h2>
                        Welcome Back
                    </h2>


                    <p className="auth-tagline">
                        Sign in to your collection
                    </p>


                    <div className="auth-divider" />


                    {/* =================================================
                        LOGIN FORM
                    ================================================= */}

                    <form onSubmit={login}>

                        <div className="field-wrap">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="field-wrap">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <div className="forgot-password-link">

                                <Link to="/forgot-password">
                                    Forgot password?
                                </Link>

                            </div>

                        </div>


                        <button type="submit" className="btn-primary" disabled={loginLoading}>
                            {loginLoading ? (
                                <span className="btn-spinner-wrap">
                                    <span className="btn-spinner" /> Entering...
                                </span>
                            ) : (
                                "Enter the Gallery"
                            )}
                        </button>


                        <div className="auth-divider-row">

                            <span className="auth-divider-line" />

                            <span className="auth-or-text">
                                or
                            </span>

                            <span className="auth-divider-line" />

                        </div>


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

                        New to Aurelian?{" "}

                        <Link to="/register">
                            Create an account
                        </Link>

                    </p>

                </div>


                {/* =================================================
                    REACTIVATION MODAL
                ================================================= */}

                {showReactivation && (

                    <div className="reactivation-overlay">

                        <div className="reactivation-modal">

                            <div className="auth-eyebrow">
                                Aurelian Gallery
                            </div>


                            {/* =================================================
                                STEP 1 — ASK USER
                            ================================================= */}

                            {!showOtp ? (

                                <>

                                    <div className="verify-icon">
                                        ✦
                                    </div>


                                    <h2>
                                        Account Deactivated
                                    </h2>


                                    <p className="auth-tagline">
                                        Your account is currently
                                        deactivated.
                                    </p>


                                    <div className="auth-divider" />


                                    <p className="verify-body">
                                        Would you like to reactivate
                                        your Aurelian Gallery account?
                                    </p>


                                    <div className="reactivation-confirm-actions">
                                        <button type="button" className="btn-primary" onClick={handleReactivate} disabled={reactivating}>
                                            {reactivating ? (
                                                <span className="btn-spinner-wrap"><span className="btn-spinner" /> Sending code...</span>
                                            ) : (
                                                "Yes, Reactivate Account"
                                            )}
                                        </button>

                                        <button type="button" className="btn-decline" onClick={cancelReactivation} disabled={reactivating}>
                                            No, Go Back
                                        </button>
                                    </div>
                                </>

                            ) : (

                                /* =================================================
                                   STEP 2 — OTP
                                ================================================= */

                                <>

                                    <div className="verify-icon">
                                        ✉
                                    </div>


                                    <h2>
                                        Verify Your Account
                                    </h2>


                                    <p className="auth-tagline">
                                        Enter the verification
                                        code sent to your email.
                                    </p>


                                    <div className="auth-divider" />


                                    <p className="verify-body">
                                        We've sent a 6-digit OTP
                                        to your registered email
                                        address.
                                    </p>


                                    <div className="field-wrap">
                                        <label>Verification Code</label>

                                        <div className="otp-container">
                                            {otpDigits.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => (otpRefs.current[index] = el)}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength="1"
                                                    className={`otp-input ${digit ? "otp-input--filled" : ""}`}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    onPaste={handleOtpPaste}
                                                />
                                            ))}
                                        </div>
                                    </div>


                                    <p className="otp-hint">
                                        This code is valid for
                                        5 minutes.
                                    </p>


                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={
                                            verifyReactivation
                                        }
                                        disabled={
                                            reactivating
                                        }
                                    >

                                        {reactivating
                                            ? "Verifying..."
                                            : "Verify & Reactivate"
                                        }

                                    </button>


                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={
                                            cancelReactivation
                                        }
                                        disabled={
                                            reactivating
                                        }
                                    >
                                        Cancel
                                    </button>

                                </>

                            )}

                        </div>

                    </div>

                )}

            </div>

        </>
    );
}

export default LoginPage;