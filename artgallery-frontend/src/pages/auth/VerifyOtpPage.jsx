import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";

function VerifyOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) navigate("/forgot-password");
    }, [email, navigate]);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);
        if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0)
            document.getElementById(`otp-${index - 1}`)?.focus();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            document.getElementById("otp-5")?.focus();
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length !== 6) { toast.error("Please enter the complete OTP."); return; }
        setLoading(true);
        try {
            await axiosClient.post("/auth/verify-otp", { email, otp: code });
            toast.success("OTP verified successfully.");
            navigate("/reset-password", { state: { email } });
        } catch (error) {
            toast.error(error.response?.data || "Invalid OTP.");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            await axiosClient.post("/auth/forgot-password", { email });
            setOtp(["", "", "", "", "", ""]);
            setTimer(60);
            document.getElementById("otp-0")?.focus();
            toast.success("OTP sent successfully.");
        } catch (error) {
            toast.error(error.response?.data || "Unable to resend OTP.");
        }
    };

    const filled = otp.filter(Boolean).length;

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-eyebrow">Aurelian Gallery</div>
                <h2>Verify Code</h2>
                <p className="auth-tagline">We've sent a verification code to</p>
                <div className="otp-email-target">{email}</div>
                <div className="auth-divider" />

                <form onSubmit={verifyOtp}>

                    <div className="otp-container" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                className={`otp-input${digit ? " otp-input--filled" : ""}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    {/* Progress dots */}
                    <div className="otp-progress">
                        {otp.map((_, i) => (
                            <div key={i} className={`otp-dot${otp[i] ? " otp-dot--filled" : ""}`} />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || filled < 6}
                        style={{ marginTop: "1.5rem" }}
                    >
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>

                </form>

                <div className="otp-resend-row">
                    {timer > 0 ? (
                        <p className="otp-timer">
                            Resend code in <span className="otp-timer-count">{timer}s</span>
                        </p>
                    ) : (
                        <button className="btn-secondary" onClick={resendOtp}>
                            Resend Code
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default VerifyOtpPage;