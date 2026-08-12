import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });

     const googleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const register = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post("/auth/register", formData);
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-eyebrow">Aurelian Gallery</div>
                <h2>Join the Collection</h2>
                <p className="auth-tagline">Create your private account</p>
                <div className="auth-divider" />

                <form onSubmit={register}>

                    <div className="field-wrap">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Your name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-wrap">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-wrap">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            placeholder="+91 00000 00000"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-wrap">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Create Account
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
                    Already a member?{" "}
                    <Link to="/login">Sign in</Link>
                </p>

            </div>
        </div>
    );
}

export default RegisterPage;