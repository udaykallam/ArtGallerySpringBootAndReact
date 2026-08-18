import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccessPage() {

    const navigate = useNavigate();

    useEffect(() => {

        const params = new URLSearchParams(
            window.location.search
        );

        const token = params.get("token");
        const role = params.get("role");
        const userId = params.get("userId");
        const userName = params.get("name");

        if (!token || !role) {

            navigate("/login");

            return;

        }
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);

        switch (role) {

            case "ROLE_ADMIN":
                navigate("/admin/dashboard");
                break;

            case "ROLE_ARTIST":
                navigate("/artist/dashboard");
                break;

            default:
                navigate("/");
                break;

        }

    }, [navigate]);

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-eyebrow">
                    Aurelian Gallery
                </div>

                <h2>Signing you in...</h2>

                <p className="auth-tagline">
                    Please wait while we complete your login.
                </p>

            </div>

        </div>

    );

}

export default OAuthSuccessPage;