import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
});

axiosClient.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);


axiosClient.interceptors.response.use(

    (response) => response,

    (error) => {

        // =========================
        // BACKEND NOT AVAILABLE
        // =========================

        if (!error.response) {

            window.location.href =
                "/server-unavailable";

            return Promise.reject(error);
        }


        // =========================
        // UNAUTHORIZED
        // =========================

        if (error.response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");

            window.location.href =
                "/login";

            return Promise.reject(error);
        }


        // =========================
        // FORBIDDEN
        // =========================

        if (error.response.status === 403) {

            console.error(
                "403 Forbidden:",
                error.response.data
            );

            // DO NOT LOG THE USER OUT HERE
            // A 403 does not necessarily mean
            // the account is suspended.

            return Promise.reject(error);
        }


        return Promise.reject(error);
    }
);

export default axiosClient;