import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/customer/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ArtworkDetailsPage from "./pages/customer/ArtworkDetailsPage";
import WishlistPage from "./pages/customer/WishlistPage";
import CartPage from "./pages/customer/CartPage";
import Navbar from "./components/common/Navbar";
import OrdersPage from "./pages/customer/OrdersPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ArtistDashboard from "./pages/artist/ArtistDashboard";
import MyArtworks from "./pages/artist/MyArtworks";
import UploadArtwork from "./pages/artist/UploadArtwork";
import EditArtwork from "./pages/artist/EditArtwork";
import ArtistOrders from "./pages/artist/ArtistOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoriesPage from "./pages/admin/CategoriesPage";
import UsersPage from "./pages/admin/UsersPage";
import ArtworksPage from "./pages/admin/ArtworksPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import OAuthSuccessPage from "./pages/auth/OAuthSuccessPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import ServerUnavailablePage from "./pages/errors/ServerUnavailablePage";
import ProfilePage from "./pages/profile/ProfilePage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import SettingsPage from "./pages/customer/SettingsPage";


function App() {

    return (

        <BrowserRouter>
            <ToastContainer
                position="top-right"
                autoClose={3000}
            />

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />

                <Route
                    path="/server-unavailable"
                    element={<ServerUnavailablePage />}
                />

                <Route
                    path="/orders"
                    element={<OrdersPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/oauth-success"
                    element={<OAuthSuccessPage />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />

                <Route
                    path="/settings"
                    element={<SettingsPage />}
                />

                <Route
                    path="/change-password"
                    element={<ChangePasswordPage />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOtpPage />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/profile"
                    element={<ProfilePage />}
                />

                <Route
                    path="/artworks/:id"
                    element={<ArtworkDetailsPage />}
                />

                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER"
                            ]}
                        >
                            <WishlistPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER"
                            ]}
                        >
                            <CartPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/artist/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ARTIST"
                            ]}
                        >
                            <ArtistDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/artist/artworks"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ARTIST"
                            ]}
                        >
                            <MyArtworks />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/artist/upload"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ARTIST"
                            ]}
                        >
                            <UploadArtwork />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/artist/artworks/edit/:id"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ARTIST"
                            ]}
                        >
                            <EditArtwork />
                        </ProtectedRoute>
                    }
                />

                  <Route
                    path="/artist/orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ARTIST"
                            ]}
                        >
                            <ArtistOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/categories"
                    element={<CategoriesPage />}
                />

                <Route
                    path="/admin/users"
                    element={<UsersPage />}
                />

                <Route
                    path="/admin/artworks"
                    element={
                        <ArtworksPage />
                    }
                />

                <Route
                    path="/admin/orders"
                    element={<AdminOrdersPage />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;