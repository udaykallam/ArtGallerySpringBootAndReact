import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";

function ServerUnavailablePage() {

    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);

    const handleRetry = async () => {

        setChecking(true);

        try {

            await axiosClient.get("/artworks");

            toast.success("Connection restored!");

            navigate("/");

        } catch (error) {

            toast.error(
                "Server is still unavailable."
            );

        } finally {

            setChecking(false);

        }

    };

    return (

        <div className="error-page">

            <div className="error-card">

                <div className="error-icon">
                    ⚠️
                </div>

                <h1>
                    Service Unavailable
                </h1>

                <p>
                    We couldn't connect to the Aurelian Gallery server.
                </p>

                <p className="error-subtitle">
                    Please check your internet connection or try again later.
                </p>

                <button
                    className="btn-primary"
                    onClick={handleRetry}
                    disabled={checking}
                >
                    {checking ? "Checking..." : "Retry"}
                </button>

                <button
                    className="btn-secondary"
                    style={{ marginTop: "12px" }}
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>

            </div>

        </div>

    );

}

export default ServerUnavailablePage;