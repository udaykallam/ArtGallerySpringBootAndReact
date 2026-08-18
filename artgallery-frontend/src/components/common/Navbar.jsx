import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "../NotificationBell";


function Navbar() {

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] =
        useState(false);

    const menuRef = useRef(null);


    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");

    const userName =
        localStorage.getItem("userName") ||
        "Account";


    // =========================
    // CLOSE MENU WHEN CLICKING OUTSIDE
    // =========================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {

                setMenuOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");

        setMenuOpen(false);

        navigate("/login");

    };


    return (

        <nav className="navbar">

            {/* =========================
                LOGO
            ========================= */}

            <div className="nav-logo">

                <Link to="/">

                    <img
                        src="/art_logo.png"
                        alt="Aurelian Gallery"
                        className="nav-logo-img"
                    />

                    Aurelian Gallery

                </Link>

            </div>


            {/* =========================
                NAVIGATION LINKS
            ========================= */}

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>


                {/* =========================
                    CUSTOMER
                ========================= */}

                {role === "ROLE_CUSTOMER" && (

                    <>

                        <Link to="/wishlist">
                            Wishlist
                        </Link>

                        <Link to="/cart">
                            Cart
                        </Link>

                    </>

                )}


                {/* =========================
                    ARTIST
                ========================= */}

                {role === "ROLE_ARTIST" && (

                    <>

                        <Link to="/artist/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/artist/artworks">
                            My Artworks
                        </Link>

                        <Link to="/artist/upload">
                            Upload
                        </Link>

                    </>

                )}


                {/* =========================
                    ADMIN
                ========================= */}

                {role === "ROLE_ADMIN" && (

                    <>

                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/admin/artworks">
                            Artworks
                        </Link>

                        <Link to="/admin/categories">
                            Categories
                        </Link>

                        <Link to="/admin/users">
                            Users
                        </Link>

                        <Link to="/admin/orders">
                            Orders
                        </Link>

                    </>

                )}


                {/* =========================
                    NOTIFICATIONS
                ========================= */}

                {token && (

                    <NotificationBell />

                )}


                {/* =========================
                    USER DROPDOWN
                ========================= */}

                {token ? (

                    <div
                        className="nav-user-menu"
                        ref={menuRef}
                    >

                        <button
                            className="nav-user-button"
                            onClick={() =>
                                setMenuOpen(
                                    previous =>
                                        !previous
                                )
                            }
                        >

                            {/* Avatar */}

                            <span className="nav-user-avatar">

                                {userName
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                            </span>


                            {/* Name */}

                            <span className="nav-user-name">

                                {userName}

                            </span>


                            {/* Arrow */}

                            <span className="nav-user-arrow">

                                {menuOpen
                                    ? "▲"
                                    : "▼"}

                            </span>

                        </button>


                        {/* =========================
                            DROPDOWN
                        ========================= */}

                        {menuOpen && (

                            <div className="nav-dropdown">

                                {/* PROFILE */}

                                <Link
                                    to="/profile"
                                    onClick={() =>
                                        setMenuOpen(false)
                                    }
                                >

                                    <span>
                                        👤
                                    </span>

                                    Profile

                                </Link>


                                {/* SETTINGS */}

                                <Link
                                    to="/settings"
                                    onClick={() =>
                                        setMenuOpen(false)
                                    }
                                >

                                    <span>
                                        ⚙️
                                    </span>

                                    Settings

                                </Link>


                                {/* CUSTOMER ORDERS */}

                                {role === "ROLE_CUSTOMER" && (

                                    <Link
                                        to="/orders"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                    >

                                        <span>
                                            📦
                                        </span>

                                        My Orders

                                    </Link>

                                )}


                                {/* ARTIST DASHBOARD */}

                                {role === "ROLE_ARTIST" && (

                                    <Link
                                        to="/artist/dashboard"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                    >

                                        <span>
                                            🎨
                                        </span>

                                        Artist Dashboard

                                    </Link>

                                )}


                                {/* ARTIST ORDERS */}

                                {role === "ROLE_ARTIST" && (

                                    <Link
                                        to="/artist/orders"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                    >

                                        <span>
                                            🚛
                                        </span>

                                        Orders

                                    </Link>

                                )}


                                {/* ADMIN DASHBOARD */}

                                {role === "ROLE_ADMIN" && (

                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                    >

                                        <span>
                                            ⚙️
                                        </span>

                                        Admin Dashboard

                                    </Link>

                                )}


                                {/* DIVIDER */}

                                <div
                                    className="nav-dropdown-divider"
                                />


                                {/* LOGOUT */}

                                <button
                                    className="nav-dropdown-logout"
                                    onClick={logout}
                                >

                                    <span>
                                        ↪
                                    </span>

                                    Logout

                                </button>

                            </div>

                        )}

                    </div>

                ) : (

                    <>

                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>

                    </>

                )}

            </div>

        </nav>

    );

}


export default Navbar;