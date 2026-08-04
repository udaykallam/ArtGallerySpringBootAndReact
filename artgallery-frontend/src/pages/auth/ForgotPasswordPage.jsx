import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";

function ForgotPasswordPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const sendOtp = async (e) => {

        e.preventDefault();

        try {

            await axiosClient.post(
                "/auth/forgot-password",
                { email }
            );

            toast.success(
                "OTP sent successfully!"
            );

            navigate(
                "/verify-otp",
                {
                    state: { email }
                }
            );

        } catch (error) {

            toast.error(
                error.response?.data ||
                "Unable to send OTP."
            );

        }

    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-eyebrow">
                    Aurelian Gallery
                </div>

                <h2>Forgot Password</h2>

                <p className="auth-tagline">
                    Enter your registered email
                </p>

                <form onSubmit={sendOtp}>

                    <div className="field-wrap">

                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="your@email.com"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Send OTP
                    </button>

                </form>

            </div>

        </div>

    );

}

export default ForgotPasswordPage;