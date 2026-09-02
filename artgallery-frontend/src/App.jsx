import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import AdminAnnouncementsPage from "./pages/admin/AdminAnnouncementsPage";
import AdminSupportPage from "./pages/admin/AdminSupportPage";

import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import OAuthSuccessPage from "./pages/auth/OAuthSuccessPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

import NotFoundPage from "./pages/errors/NotFoundPage";
import ServerUnavailablePage from "./pages/errors/ServerUnavailablePage";

import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/customer/SettingsPage";

import ContactPage from "./pages/support/ContactPage";
import SupportTicketPage from "./pages/support/SupportTicketPage";


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =====================================================
                    PUBLIC ROUTES
                ===================================================== */}

                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmailPage />}
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
                    path="/verify-otp"
                    element={<VerifyOtpPage />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                />

                <Route
                    path="/server-unavailable"
                    element={<ServerUnavailablePage />}
                />

                <Route
                    path="/artworks/:id"
                    element={<ArtworkDetailsPage />}
                />


                {/* =====================================================
                    CUSTOMER ROUTES
                ===================================================== */}

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER"
                            ]}
                        >
                            <OrdersPage />
                        </ProtectedRoute>
                    }
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
                    path="/contact"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER"
                            ]}
                        >
                            <ContactPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contact/tickets/:ticketId"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER"
                            ]}
                        >
                            <SupportTicketPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER"
                            ]}
                        >
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER"
                            ]}
                        >
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_CUSTOMER"
                            ]}
                        >
                            <ChangePasswordPage />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================================
                    ARTIST ROUTES
                ===================================================== */}

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


                {/* =====================================================
                    ADMIN ROUTES
                ===================================================== */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ADMIN"
                            ]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/categories"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ADMIN"
                            ]}
                        >
                            <CategoriesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ADMIN"
                            ]}
                        >
                            <UsersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/artworks"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ADMIN"
                            ]}
                        >
                            <ArtworksPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ADMIN"
                            ]}
                        >
                            <AdminOrdersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/support"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ADMIN"
                            ]}
                        >
                            <AdminSupportPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/announcements"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ROLE_ADMIN"
                            ]}
                        >
                            <AdminAnnouncementsPage />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================================
                    404
                ===================================================== */}

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;