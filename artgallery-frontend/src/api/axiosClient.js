import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

axiosClient.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
    response => response,

    error => {
         if (!error.response) {

            window.location.href =
                "/server-unavailable";
        }

        if (
            error.response?.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "role"
            );

            alert(
                "Session expired. Please login again."
            );

            window.location.href =
                "/login";
        }

        if (
            error.response?.status === 403
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "role"
            );

            alert(
                "Your account has been suspended."
            );

            window.location.href =
                "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;