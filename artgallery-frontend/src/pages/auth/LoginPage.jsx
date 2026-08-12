import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const googleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const login = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post("/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("userName",response.data.name);
            const role = response.data.role;
            if (role === "ROLE_ADMIN") navigate("/admin/dashboard");
            else if (role === "ROLE_ARTIST") navigate("/artist/dashboard");
            else navigate("/");
        } catch (error) {
            toast.error("Invalid email or password. Please try again.");
            console.error(error.response?.data?.message || error.response?.data);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-eyebrow">Aurelian Gallery</div>
                <h2>Welcome Back</h2>
                <p className="auth-tagline">Sign in to your collection</p>
                <div className="auth-divider" />

                <form onSubmit={login}>

                    <div className="field-wrap">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-wrap">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="forgot-password-link">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">
                        Enter the Gallery
                    </button>

                    <div className="auth-divider-row">
                        <span className="auth-divider-line" />
                        <span className="auth-or-text">or</span>
                        <span className="auth-divider-line" />
                    </div>

                    <button type="button" className="google-btn" onClick={googleLogin}>
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                        />
                        Continue with Google
                    </button>

                </form>

                <p className="auth-footer-link">
                    New to Aurelian? <Link to="/register">Create an account</Link>
                </p>

            </div>
        </div>
    );
}

export default LoginPage;